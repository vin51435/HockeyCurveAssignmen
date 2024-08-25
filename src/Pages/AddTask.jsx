import React, { useEffect, useRef, useState } from 'react';
import flatpickr from "flatpickr";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { useAppDispatch, useAppState } from '../Reducers/reducer';
import { TbCalendarStats } from "react-icons/tb";
import { PiFolderOpenLight } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AddTask = ({ type }) => {
  const [showOptions, setShowOptions] = useState(false);
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [date, setDate] = useState(null);
  const calendarRef = useRef(null);

  console.log(date);

  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <div className='w-full md:w-2/4'>
        <Link to='/' className='flex items-center px-2 py-1 text-sm text-white bg-emerald-800 w-fit ml-2 rounded-t-md'>
          <span className='text-xl font-bold'><PiFolderOpenLight /></span>
          <span className='pl-2'>Task List View</span>
        </Link>
        <div className='block p-4 rounded-md bg-zinc-100'>
          <div className='pb-4 flex justify-between items-center text-xl'>
            <span className='font-semibold'>Add New Task</span>
            <span className='flex px-8 py-1 h-full bg-rose-600 text-sm font-medium text-white rounded-3xl'>Delete</span>
          </div>
          <form className='flex flex-col gap-2'>
            <input
              className='px-3 py-2 w-full font-medium text-black shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 focus:outline-none focus-visible:none'
              placeholder='Task Name' name='title' />
            <textarea
              className='px-3 py-2 w-full font-medium text-black shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 focus:outline-none resize-none overflow-hidden'
              placeholder='Description'
              name='title'
              rows={1} // Start with a single row
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            <div
              onClick={() => calendarRef.current.flatpickr.open()}
              className='relative inline-block px-3 py-2 w-full shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 bg-white'>
              <Flatpickr
                ref={calendarRef}
                data-enable-time
                value={date}
                onChange={([selectedDate]) => setDate(selectedDate)}
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                  altInput: true,
                  altFormat: "j M Y - h:i K",
                  disableMobile: true
                }}
                className='bg-white font-medium focus:outline-none focus-visible:none'
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-emerald-800 text-xl"
              >
                <TbCalendarStats />
              </span>
            </div>
            <div
              onClick={() => setShowOptions(prev => !prev)}
              className='relative px-3 py-2 w-full shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 bg-white'
            >
              <div className='flex justify-between items-center font-medium'>
                <span>Select Priority</span>
                <span >
                  <svg className={`w-3 h-3 transition-all text-emerald-800 text-xl`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
                    <path d="M245 456.701 490 33.299H0z" fill='currentColor' />
                  </svg>
                </span>
              </div>
            </div>
            <div className={`${showOptions ? 'opacity-1' : 'opacity-0'} flex py-1 font-medium flex-col -top-1 justify-space items-start relative w-full shadow-[inset_0_0_4px_0_rgba(0,0,0,0.5)] shadow-gray-400 bg-white`}>
              <div className='flex justify-between items-center w-full px-3 py-1 border-b-2 border-emerald-800'>
                <span>High</span>
                <span className='w-3 h-3 rounded-full bg-orange-900'></span></div>
              <div className='flex justify-between items-center w-full px-3 py-1 border-b-2 border-emerald-800'>
                <span>Medium</span>
                <span className='w-3 h-3 rounded-full bg-orange-500'></span></div>
              <div className='flex justify-between items-center w-full px-3 py-1'>
                <span>Low</span>
                <span className='w-3 h-3 rounded-full bg-blue-900'></span></div>
            </div>
            <div className='flex justify-between items-center gap-4 py-9'>
              <span className='flex flex-1 items-center justify-center px-8 py-1 h-full bg-emerald-800 text-sm font-medium text-white rounded-3xl'>Add Task</span>
              <span className='flex flex-1 items-center justify-center px-8 py-1 h-full bg-emerald-800 text-sm font-medium text-white rounded-3xl'>Cacel</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;