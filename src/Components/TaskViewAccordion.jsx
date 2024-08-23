import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../Reducers/reducer';

const TaskViewAccordion = ({ props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef(null);
  const dispatch = useAppDispatch();

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b" ref={accordionRef}>
      <button
        className="flex items-start justify-between py-5 w-full h-full border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
        onClick={toggleOpen}
      >
        <div className=' flex items-start justify-start w-full font-medium rtl:text-right text-gray-500'>
          <span className='mt-2'>
            <svg className={`w-3 h-3 transition-all ${isOpen ? '' : '-rotate-90'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
              <path d="M245 456.701 490 33.299H0z" />
            </svg>
          </span>
          <div className='pl-2 flex flex-col justify-start items-start w-full'>
            <div className='flex justify-between items-center h-full w-full'>
              <span>{props?.title}</span>
              <div className='flex items-center gap-2'>
                <span className=''>{props.priority === 1 ? 'High' : props.priority === 2 ? 'Medium' : 'Low'}</span>
                <span className='w-3 h-3 rounded-full bg-orange-900'></span>
              </div>
            </div>
            <span className='text-sm'>Created: {props.createdOn}</span>
          </div>
        </div>
      </button>
      <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
        <div className="p-4 border-t bg-gray-50">
          <p>
            Description:
            <br />
            {props?.description}
            <br />
            Due Date:
            <br />
            {props?.dueDate} - {props?.dueTime}
          </p>
          <div>
            <button>Edit</button>
            <button onClick={() => dispatch({ type: 'delete', payload: { id: props?.id } })}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskViewAccordion;
