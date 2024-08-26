import React, { useEffect, useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { useAppDispatch, useAppState } from '../Reducers/reducer';
import { TbCalendarStats } from "react-icons/tb";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegFolderOpen } from 'react-icons/fa';
import DarkModeToggle from '../Components/DarkModeButton';

const AddTask = () => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: null, priority: null });
  const [showOptions, setShowOptions] = useState(false);
  const [type, setType] = useState(null);
  const state = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  useEffect(() => {
    if (id) {
      setType('edit');
      const task = state.find(ele => ele.id === parseInt(id));
      if (!task || task.completed) navigate('/');
      setForm(task || {}); // Provide default value if task is not found
    } else {
      setType('add');
      setForm({ dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] }); // Ensure proper date format
    }
  }, [id, state]);

  const calendarRef = useRef(null);
  const textAreaRef = useRef(null);

  const adjustHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const duplicateTitle = state.find(ele => ele.title === form.title);
    if (type === 'add') {
      if (duplicateTitle) {
        alert('Title already exists!');
        return;
      }
      dispatch({ type: 'add', payload: form });
    } else {
      if (duplicateTitle && duplicateTitle.id !== form.id) {
        alert('Title already exists!');
        return;
      }
      dispatch({ type: 'update', payload: { ...form } });
    }
    navigate('/');
  };

  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <div className='w-full sm:w-2/4'>
        <div className='flex justify-end w-full'><DarkModeToggle /></div>
        <div>
          <span className='flex items-center px-2 py-2 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit ml-3 rounded-t-lg'>
            <span className='text-xl font-semibold'><FaRegFolderOpen /></span>
            <span className='pl-2 font-medium'>Task List View</span>
          </span>
        </div>
        <div className='block p-4 rounded-md bg-zinc-100 dark:bg-zinc-900'>
          <div className='pb-4 flex justify-between items-center text-xl'>
            <span className='font-semibold'>{type === 'add' ? 'Add New Task' : 'Edit Task'}</span>
            <span
              onClick={() => dispatch({ type: 'delete', payload: { id: form?.id } })}
              className='flex px-8 py-1 h-full bg-rose-600 text-sm font-medium text-white rounded-3xl'>Delete</span>
          </div>
          <form className='flex flex-col gap-2' onSubmit={(e) => submitHandler(e)}>
            <input
              className='dark:bg-gray-900 dark:text-white dark:shadow-[inset_0_0_4px_0_rgba(255,255,255,0.2)] dark:shadow-gray-700 px-3 py-2 w-full font-medium text-black shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 focus:outline-none focus-visible:none'
              placeholder='Task Name' name='title'
              value={form?.title}
              required
              onChange={(e) => handleOnChange(e)}
            />
            <textarea
              className='dark:bg-gray-900 px-3 py-2 w-full font-medium text-black dark:text-white dark:shadow-[inset_0_0_4px_0_rgba(255,255,255,0.2)] dark:shadow-gray-700 shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 focus:outline-none resize-none overflow-hidden h-auto'
              placeholder='Description'
              name='description'
              rows={1} // Start with a single row
              required
              ref={textAreaRef}
              onInput={(e) => adjustHeight(e.target)}
              onFocus={(e) => adjustHeight(e.target)}
              value={form?.description}
              onChange={(e) => handleOnChange(e)}
            />
            <div
              onClick={() => calendarRef.current.flatpickr.open()}
              className='dark:bg-gray-900 relative inline-block px-3 py-2 w-full dark:shadow-[inset_0_0_4px_0_rgba(255,255,255,0.2)] dark:shadow-gray-700 shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 bg-white'>
              <Flatpickr
                ref={calendarRef}
                data-enable-time
                required
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                  altInput: true,
                  altFormat: "j M Y - h:i K",
                  disableMobile: true,
                  minDate: "today",
                }}
                // value={new Date("Wed Aug 07 2024 15:40:00 GMT+0530 (India Standard Time)")}
                value={form.dueDate}
                name='dueDate'
                onChange={(dates) => setForm(prev => ({ ...prev, dueDate: dates[0] }))}
                className='bg-white dark:bg-gray-900 font-medium focus:outline-none focus-visible:none'
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-emerald-800 dark:text-emerald-300 text-xl"
              >
                <TbCalendarStats />
              </span>
            </div>
            <div
              onClick={() => setShowOptions(prev => !prev)}
              className='dark:bg-gray-900 relative px-3 py-2 w-full dark:shadow-[inset_0_0_4px_0_rgba(255,255,255,0.2)] dark:shadow-gray-700 shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 bg-white'
            >
              <div className='flex justify-between items-center font-medium'>
                <span>
                  {(() => {
                    switch (form?.priority) {
                      case 1:
                        return 'High';
                      case 2:
                        return 'Medium';
                      case 3:
                        return 'Low';
                      default:
                        return 'Select Priority';
                    }
                  })()}
                </span>

                <span >
                  <svg className={`w-3 h-3 transition-all text-emerald-800 dark:text-emerald-300 text-xl`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
                    <path d="M245 456.701 490 33.299H0z" fill='currentColor' />
                  </svg>
                </span>
              </div>
            </div>
            <div className={`${showOptions ? 'opacity-1' : 'opacity-0 pointer-events-none'} flex py-1 font-medium flex-col -top-1 justify-space items-start relative w-full dark:shadow-[inset_0_0_4px_0_rgba(255,255,255,0.2)] dark:shadow-gray-700 shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 bg-white dark:bg-gray-900`}>
              <div
                onClick={() => {
                  setForm(prev => ({ ...prev, priority: 1 }));
                  setShowOptions(false);
                }}
                className='dark:bg-gray-900 flex justify-between items-center w-full px-3 py-1 cursor-pointer border-b-2 border-emerald-800 dark:border-emerald-700'>
                <span>High</span>
                <span className='w-3 h-3 rounded-full bg-orange-900'></span></div>
              <div
                onClick={() => {
                  setForm(prev => ({ ...prev, priority: 2 }));
                  setShowOptions(false);
                }}
                className='dark:bg-gray-900 flex justify-between items-center w-full px-3 py-1 cursor-pointer border-b-2 border-emerald-800 dark:border-emerald-700'>
                <span>Medium</span>
                <span className='w-3 h-3 rounded-full bg-orange-500'></span></div>
              <div
                onClick={() => {
                  setForm(prev => ({ ...prev, priority: 3 }));
                  setShowOptions(false);
                }}
                className='dark:bg-gray-900 flex justify-between items-center w-full px-3 py-1 cursor-pointer'>
                <span>Low</span>
                <span className='w-3 h-3 rounded-full bg-blue-900'></span></div>
            </div>
            {
              type === 'add' ?
                <div className='flex justify-between items-center gap-4 py-9'>
                  <button
                    type='submit'
                    className='flex flex-1 items-center justify-center px-8 py-1 h-full bg-emerald-800 dark:bg-emerald-700 text-sm font-medium text-white rounded-3xl cursor-pointer '>
                    Add Task
                  </button>
                  <span className='flex flex-1 items-center justify-center px-8 py-1 h-full bg-emerald-800 dark:bg-emerald-700 text-sm font-medium text-white rounded-3xl cursor-pointer '>
                    <Link to={'/'}>Cancel</Link>
                  </span>
                </div>
                :
                <div className="grid grid-cols-2 gap-4 py-3">
                  <button
                    type='submit'
                    className="flex justify-center cursor-pointer col-span-1 py-1 h-full bg-emerald-800 dark:bg-emerald-700 text-sm font-medium text-white rounded-3xl">
                    Save Changes
                  </button>
                  <button
                    type='button'
                    onClick={() => dispatch({ type: 'complete', payload: { id: parseInt(id) } })}
                    className="flex justify-center cursor-pointer col-span-1 py-1 h-full bg-emerald-800 dark:bg-emerald-700 text-sm font-medium text-white rounded-3xl">
                    Mark as done
                  </button>
                  <Link to={'/'} className="flex justify-center col-span-2 mx-auto px-8 py-1 h-full bg-emerald-800 dark:bg-emerald-700 text-sm font-medium text-white rounded-3xl">
                    Cancel
                  </Link>
                </div>
            }
          </form >
        </div >
      </div >
    </div >
  );
};

export default AddTask;