import React, { useMemo, useState } from 'react';
import TaskViewAccordion from '../Components/TaskViewAccordion';
import { Link } from 'react-router-dom';
import { useAppState } from '../Reducers/reducer';
import { ImPlus } from 'react-icons/im';
import { FaRegFolderOpen } from 'react-icons/fa';

const TaskPage = () => {
  const [tab, setTab] = useState(0);
  const state = useAppState();

  const filteredTasks = useMemo(() => {
    switch (tab) {
      case 1:
        return state.filter(task => task.priority === 1); // High priority
      case 2:
        return state.filter(task => task.priority === 2); // Medium priority
      case 3:
        return state.filter(task => task.priority === 3); // Low priority
      case 4:
        return state.filter(task => task.completed); // Completed tasks
      default:
        return state; // All tasks
    }
  }, [tab, state]);

  const tabs = [
    { name: 'All', index: 0 },
    { name: 'High', index: 1 },
    { name: 'Medium', index: 2 },
    { name: 'Low', index: 3 },
    { name: 'Done', index: 4 }
  ];

  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <div className='w-full sm:w-2/4'>
        <div>
          <span className='flex items-center px-2 py-2 text-sm text-white bg-emerald-800 w-fit ml-2 rounded-t-lg'>
            <span className='text-xl font-semibold'><FaRegFolderOpen /></span>
            <span className='pl-2 font-medium'>Task List View</span>
          </span>
        </div>
        <div className='relative '>
          <div className='px-4 pt-4 bg-zinc-300 rounded-t-xl'>
            <Link to={'/task'} className='flex justify-center items-center mb-4 px-2 py-1 text-sm text-white bg-emerald-800 w-fit rounded-3xl'>
              <span className='text-sm font-bold rounded-3xl bg-white text-black relative p-1 -left-1'><ImPlus /></span>
              <span className='pl-2 text-xs font-medium'>Add New Task</span>
            </Link>
            <div className='flex justify-evenly items-center gap-1'>
              {tabs.map((ele) => (
                <span
                  key={ele.index}
                  onClick={() => setTab(ele.index)}
                  className={`cursor-pointer flex-1 font-medium text-center text-sm rounded-t-lg px-1 py-2 ${tab === ele.index ? 'text-black bg-zinc-100' : 'text-white bg-emerald-800'}`}
                >
                  {ele.name}
                </span>
              ))}
            </div>
          </div>
          <span className='block absolute left-0 w-full h-5 bg-zinc-100' />
          <div className='mt-4'>
            <div className='bg-zinc-100'>
              {filteredTasks.map((ele) => (
                <TaskViewAccordion key={ele.id} props={ele} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
