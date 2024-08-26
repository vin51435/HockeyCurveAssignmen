import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../Reducers/reducer';
import { Link } from 'react-router-dom';

const TaskViewAccordion = ({ props }) => {
  const [isOpen, setIsOpen] = useState(0);
  const accordionRef = useRef(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target)) {
        setIsOpen(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function formatDateTime(dateString, showTime = true) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    let formattedDate = `${day} ${month} ${year}`;

    if (showTime) {
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const time = date.toLocaleTimeString('en-US', timeOptions);
      formattedDate += ` - ${time}`;
    }

    return formattedDate;
  }

  return (
    <div className="bg-zinc-300 mb-3 dark:bg-zinc-700"
      data-accordionid={props.id}
      ref={accordionRef}
    >
      <div
        className="flex items-start justify-between py-2 px-3 w-full h-full cursor-pointer dark:text-gray-400"
        onClick={() => setIsOpen(prev => {
          if (prev === props.id) {
            return 0;
          } else {
            return props.id;
          };
        })}
      >
        <div className=' flex items-start justify-start w-full font-medium rtl:text-right text-gray-500'>
          <span className='mt-2 text-emerald-800 dark:text-emerald-300'>
            <svg className={`w-3 h-3 transition-all ${isOpen ? '' : '-rotate-90'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
              <path d="M245 456.701 490 33.299H0z" fill='currentColor' />
            </svg>
          </span>
          <div className='pl-2 flex flex-col justify-center items-start w-full'>
            <div className='flex justify-between items-center h-full w-full'>
              <span className='text-black dark:text-white'>{props?.title}</span>
              <div className='flex items-center gap-2'>
                <span className='text-black dark:text-white'>{props.priority === 1 ? 'High' : props.priority === 2 ? 'Medium' : 'Low'}</span>
                <span className={`w-3 h-3 rounded-full ${props.priority === 1 ? 'bg-orange-900' : props.priority === 2 ? 'bg-orange-500' : 'bg-blue-900'}`}></span>
              </div>
            </div>
            {props?.completed
              ?
              <span className='text-xs text-emerald-800 dark:text-emerald-300'>Completed</span>
              :
              (new Date(props?.dueDate) < (new Date()))
                ?
                <span className='text-xs text-red-700 dark:text-red-500'>Overdue: {formatDateTime(props?.dueDate, true)}</span>
                :
                <span className='text-xs text-black dark:text-white'>Due Date: {formatDateTime(props?.dueDate, true)}</span>
            }
          </div>
        </div>
      </div>
      <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen === props.id ? 'h-full' : 'max-h-0'}`}>
        <div className="pt-4  px-8 border-t bg-zinc-100 dark:bg-zinc-900">
          <p className='leading-5'>
            <span className='text-emerald-800 dark:text-emerald-300 font-bold'> Description:</span>
            <br />
            <span className='font-medium'>{props?.description}</span>
            <br />
            <span className='text-emerald-800 dark:text-emerald-300 font-bold'> Created:</span>
            <br />
            <span className='font-medium'>{formatDateTime(props.createdOn, true)}</span>
            <br />
          </p>
          <div className='flex justify-between items-center gap-2 h-full w-full mt-4'>
            {!props?.completed &&
              <>
                <Link
                  className='flex-1 py-1 h-full text-center cursor-pointer bg-emerald-800 dark:bg-emerald-700 text-base text-white rounded-3xl'
                  to={`/task?id=${props.id}`} >
                  Edit
                </Link>
                <span
                  className='flex-1 py-1 h-full text-center cursor-pointer bg-emerald-800 dark:bg-emerald-700 text-base text-white rounded-3xl'
                  onClick={() => dispatch({ type: 'snooze', payload: { id: props?.id } })}>
                  Snooze
                </span>
              </>
            }
            <span
              className='flex-1 py-1 h-full text-center cursor-pointer bg-emerald-800 dark:bg-emerald-700 text-base text-white rounded-3xl'
              onClick={() => dispatch({ type: 'delete', payload: { id: props?.id } })}>
              Delete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskViewAccordion;
