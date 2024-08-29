import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TaskViewAccordion from '../Components/TaskViewAccordion';
import { Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../Reducers/reducer';
import { ImPlus } from 'react-icons/im';
import { FaRegFolderOpen } from 'react-icons/fa';
import DarkModeToggle from '../Components/DarkModeButton';
import { FixedSizeList as List } from 'react-window';
import { TbAnalyzeFilled } from 'react-icons/tb';

const TaskPage = () => {
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [accordionOpen, setAccordionOpen] = useState(0);
  const state = useAppState();
  const dispatch = useAppDispatch();

  const filteredTasks = useMemo(() => {
    let tasks = state;
    switch (tab) {
      case 1:
        tasks = tasks.filter(task => task.priority === 1);
        break;
      case 2:
        tasks = tasks.filter(task => task.priority === 2);
        break;
      case 3:
        tasks = tasks.filter(task => task.priority === 3);
        break;
      case 4:
        tasks = tasks.filter(task => task.completed);
        break;
      default:
        break;
    }

    if (searchTerm) {
      tasks = tasks.filter(task => task?.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return tasks;
  }, [tab, searchTerm, state]);

  const tabs = [
    { name: 'All', index: 0 },
    { name: 'High', index: 1 },
    { name: 'Medium', index: 2 },
    { name: 'Low', index: 3 },
    { name: 'Done', index: 4 }
  ];

  const handleAccordionClick = useCallback((id) => () => {
    setAccordionOpen(prev => (prev === id ? 0 : id));
  }, []);

  const handleAccordionDispatch = (action) => {
    dispatch(action);
  };

  const TaskItem = ({ index }) => {
    const task = filteredTasks[index];
    const itemRef = useRef(null);
    const dragIndexRef = useRef(null);
    const [draggingItem, setDraggingItem] = useState(null);
    const longPressTimeout = useRef(null);
    const [isLongPress, setIsLongPress] = useState(false);
    const startTouchPosition = useRef({ x: 0, y: 0 });
    const touchMoved = useRef(false);

    useEffect(() => {
      const item = itemRef.current;

      const handleTouchMove = (e) => {
        if (isLongPress && draggingItem) {
          e.preventDefault();
          const touchX = e.touches[0].clientX;
          const touchY = e.touches[0].clientY;

          const itemRect = draggingItem.getBoundingClientRect();
          const itemWidth = itemRect.width;
          const itemHeight = itemRect.height;

          draggingItem.style.left = `${touchX - itemWidth / 2}px`;
          draggingItem.style.top = `${touchY - itemHeight / 2}px`;
        } else if (!isLongPress) {
          // Track movement to distinguish between tap and long press
          touchMoved.current = true;
        }
      };

      item.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        item.removeEventListener('touchmove', handleTouchMove);
      };
    }, [isLongPress, draggingItem]);

    const handleTouchStart = (e, index) => {
      if (tab !== 0) return;

      startTouchPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      touchMoved.current = false;

      longPressTimeout.current = setTimeout(() => {
        console.log('handleTouch touchMoved.current', touchMoved.current);
        if (!touchMoved.current) {
          setIsLongPress(true);
          dragIndexRef.current = index;

          const clone = itemRef.current.cloneNode(true);
          clone.style.position = 'absolute';
          clone.style.pointerEvents = 'none';
          clone.style.left = `${e.touches[0].clientX - itemRef.current.offsetWidth / 2}px`;
          clone.style.top = `${e.touches[0].clientY - itemRef.current.offsetHeight / 2}px`;
          clone.style.width = `${itemRef.current.offsetWidth}px`;
          clone.style.height = `${itemRef.current.offsetHeight}px`;
          clone.style.opacity = '0.8';
          document.body.appendChild(clone);
          setDraggingItem(clone);
        }
      }, 500); // Long press threshold
    };

    const handleTouchEnd = (e) => {
      console.log('handleTouchEnd');
      clearTimeout(longPressTimeout.current);

      if (isLongPress) {
        console.log('isLongPress inside handleTouchEnd');
        const draggedItem = dragIndexRef.current;
        const touchEndY = e.changedTouches[0].clientY;

        let dropIndex = index;

        filteredTasks.forEach((_, i) => {
          const element = document.querySelector(`[data-index='${i}']`);
          const rect = element.getBoundingClientRect();

          if (touchEndY > rect.top && touchEndY < rect.bottom) {
            dropIndex = i;
          }
        });

        if (draggingItem) {
          draggingItem.remove();
          setDraggingItem(null);
        }

        if (draggedItem !== null && draggedItem !== dropIndex) {
          updateTaskOrder(draggedItem, dropIndex);
        }

        dragIndexRef.current = null;
        setIsLongPress(false);
      } else {
        console.log('not a long press');
      }
    };

    const handleTouchMove = (e) => {
      // Track movements to cancel long press if necessary
      const moveX = e.touches[0].clientX - startTouchPosition.current.x;
      const moveY = e.touches[0].clientY - startTouchPosition.current.y;

      if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10) {
        clearTimeout(longPressTimeout.current);
        touchMoved.current = true;
      }
    };

    const handleDragStart = (e, index) => {
      e.dataTransfer.setData('index', index);
    };

    const handleDrop = (e, dropIndex) => {
      const dragIndex = e.dataTransfer.getData('index');
      updateTaskOrder(dragIndex, dropIndex);
    };

    const updateTaskOrder = (dragIndex, dropIndex) => {
      const updatedTasks = [...filteredTasks];
      const [draggedItem] = updatedTasks.splice(dragIndex, 1);
      updatedTasks.splice(dropIndex, 0, draggedItem);

      dispatch({ type: 'state', payload: updatedTasks });
    };

    const eventHandlers = {
      draggable: tab === 0,
      onDragStart: (e) => handleDragStart(e, index),
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => handleDrop(e, index),
      onTouchStart: (e) => handleTouchStart(e, index),
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    };

    return (
      <div className="pb-1 bg-zinc-100 dark:bg-zinc-900"      >
        <div
          ref={itemRef}
          data-index={index}
        >
          <TaskViewAccordion
            key={task.id}
            props={task}
            accordionOpen={accordionOpen}
            handleAccordionClick={handleAccordionClick(task.id)}
            handleAccordionDispatch={handleAccordionDispatch}
            {...eventHandlers}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <div className='w-full sm:w-2/4 lg:w-2/5'>
        <div className='flex justify-end w-full'><DarkModeToggle /></div>
        <div>
          <span className='flex items-center px-2 py-2 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit ml-3 rounded-t-lg'>
            <span className='text-xl font-semibold'><FaRegFolderOpen /></span>
            <span className='pl-2 font-medium'>Task List View</span>
          </span>
        </div>
        <div className='relative'>
          <div className='px-4 pt-4 bg-zinc-300 rounded-t-xl dark:bg-zinc-700'>
            <div className='flex justify-between items-center'>
              <Link to={'/task'} className='flex justify-center items-center mb-4 px-2 py-1 pr-3 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit rounded-3xl'>
                <span className='text-sm font-bold rounded-3xl bg-white text-black relative p-1 -left-1'><ImPlus /></span>
                <span className='pl-1 text-xs font-medium'>Add New Task</span>
              </Link>
              <Link to={'/analytics'} className='flex justify-center items-center mb-4 px-2 py-1 pr-3 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit rounded-3xl'>
                <span className='text-sm font-bold rounded-3xl bg-white text-black relative p-1 -left-1'><TbAnalyzeFilled /></span>
                <span className='pl-1 text-xs font-medium'>Analytics</span>
              </Link>
            </div>
            <div className='flex justify-evenly items-center gap-1'>
              {tabs.map((ele) => (
                <span
                  key={ele.index}
                  onClick={() => setTab(ele.index)}
                  className={`cursor-pointer flex-1 font-medium text-center text-sm rounded-t-lg px-1 py-2 dark:text-white ${tab === ele.index ? 'text-black bg-zinc-100 dark:bg-zinc-900' : 'text-white bg-emerald-800 dark:bg-emerald-700'}`}
                >
                  {ele.name}
                </span>
              ))}
            </div>
          </div>
          <span className='block absolute left-0 w-full h-5 bg-zinc-100 dark:bg-zinc-900' />
          <div className='none px-3 mt-5 pb-4 relative bg-zinc-100 dark:bg-zinc-900'>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full dark:bg-gray-900 dark:text-white dark:shadow-[inset_0_0_4px_0_rgba(255,255,255,0.2)] dark:shadow-gray-700 px-3 py-2 w-full font-medium text-black shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 focus:outline-none focus-visible:none"
            />
          </div>
          <div className='rounded-b-xl bg-zinc-100 dark:bg-zinc-900'>
            <List
              height={600}
              itemCount={filteredTasks.length}
              itemSize={100}
              width={'100%'}
            >
              {TaskItem}
            </List>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
