import React, { useMemo, useState } from 'react';
import DarkModeToggle from '../Components/DarkModeButton';
import { TbAnalyzeFilled } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { FaRegFolderOpen } from 'react-icons/fa';
import { ImPlus } from 'react-icons/im';
import { useAppState } from '../Reducers/reducer';

const Accordion = ({ title, content, id, isOpen, toggleAccordion }) => {
  return (
    <div className="bg-zinc-300 mb-3 dark:bg-zinc-700">
      <div
        onClick={() => toggleAccordion(id)}
        className="flex items-start justify-between py-2 px-3 w-full h-full cursor-pointer dark:text-gray-400">
        <div className='flex items-start justify-start w-full font-medium rtl:text-right text-gray-500'>
          <span className='mt-2 text-emerald-800 dark:text-emerald-300'>
            <svg className={`w-3 h-3 transition-all ${isOpen ? '' : '-rotate-90'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
              <path d="M245 456.701 490 33.299H0z" fill='currentColor' />
            </svg>
          </span>
          <div className='pl-2 flex flex-col justify-center items-start w-full'>
            <div className='flex justify-between items-center h-full w-full'>
              <span className='text-black dark:text-white'>{title}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'h-full' : 'max-h-0'}`}>
        <div className="pt-4 px-8 border-t bg-zinc-100 dark:bg-zinc-900">
          <span className='leading-5'>
            {content}
          </span>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [accordionOpen, setAccordionOpen] = useState([]);
  const state = useAppState();

  const completedstateCount = useMemo(() => {
    return state.filter(task => task.completed).length;
  }, [state]);

  const completionRate = useMemo(() => {
    return (completedstateCount / state.length) * 100;
  }, [completedstateCount, state.length]);

  const priorityCounts = useMemo(() => {
    return state.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});
  }, [state]);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const tasksDueToday = useMemo(() => {
    return state.filter(task => new Date(task.dueDate).toISOString().split('T')[0] === today).length;
  }, [state, today]);

  const overdueTasks = useMemo(() => {
    return state.filter(task => new Date(task.dueDate) < new Date() && !task.completed).length;
  }, [state]);

  const tasksByDate = useMemo(() => {
    return state.reduce((acc, task) => {
      const date = new Date(task.createdOn).toISOString().split('T')[0];
      acc[date] = acc[date] || { created: 0, completed: 0 };
      acc[date].created += 1;
      if (task.completed) acc[date].completed += 1;
      return acc;
    }, {});
  }, [state]);

  const statusCounts = useMemo(() => {
    return state.reduce((acc, task) => {
      acc[task.completed ? 'completed' : 'notCompleted'] += 1;
      return acc;
    }, { completed: 0, notCompleted: 0 });
  }, [state]);

  const toggleAccordion = (id) => {
    setAccordionOpen(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <div className='w-full sm:w-2/4 lg:w-2/5'>
        <div className='flex justify-end w-full'><DarkModeToggle /></div>
        <div>
          <span className='flex items-center px-2 py-2 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit ml-3 rounded-t-lg'>
            <span className='text-xl font-semibold'><TbAnalyzeFilled /></span>
            <span className='pl-2 font-medium'>Analytics</span>
          </span>
        </div>
        <div className='relative'>
          <div className='px-4 pt-4 bg-zinc-300 rounded-t-xl dark:bg-zinc-700'>
            <div className='flex justify-between items-center'>
              <Link to={'/task'} className='flex justify-center items-center mb-4 px-2 py-1 pr-3 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit rounded-3xl'>
                <span className='text-sm font-bold rounded-3xl bg-white text-black relative p-1 -left-1'><ImPlus /></span>
                <span className='pl-1 text-xs font-medium'>Add New Task</span>
              </Link>
              <Link to={'/'} className='flex justify-center items-center mb-4 px-2 py-1 pr-3 text-sm text-white bg-emerald-800 dark:bg-emerald-700 w-fit rounded-3xl'>
                <span className='text-sm font-bold rounded-3xl bg-white text-black relative p-1 -left-1'><FaRegFolderOpen /></span>
                <span className='pl-1 text-xs font-medium'>Task List View</span>
              </Link>
            </div>
            <div className='w-fit gap-1 rounded-t-lg font-medium text-center text-sm dark:text-white text-black bg-zinc-100 dark:bg-zinc-900 px-2 py-2'>
              All Analytics
            </div>
          </div>
          <span className='block absolute left-0 w-full h-5 bg-zinc-100 dark:bg-zinc-900' />
          <div className='bg-zinc-100 dark:bg-zinc-900 mt-5 rounded-b-xl pb-5 '>

            <>
              <Accordion
                title="Tasks Analysis"
                content={
                  <>
                    <p>Completion Rate: {completionRate.toFixed(2)}%</p>
                    <p>Tasks Due Today: {tasksDueToday}</p>
                    <p>Overdue Tasks: {overdueTasks}</p>
                  </>
                }
                id={4}
                isOpen={accordionOpen.includes(4)}
                toggleAccordion={toggleAccordion}
              />
              <Accordion
                title="Tasks by Priority"
                content={
                  <>
                    {Object.entries(priorityCounts).map(([priority, count]) => (
                      <p key={priority}>Priority {priority}: {count}</p>
                    ))}
                  </>
                }
                id={3}
                isOpen={accordionOpen.includes(3)}
                toggleAccordion={toggleAccordion}
              />
              <Accordion
                title="Tasks By Status"
                content={
                  <>
                    <p>Completed: {statusCounts.completed}</p>
                    <p>Not Completed: {statusCounts.notCompleted}</p>
                  </>
                }
                id={1}
                isOpen={accordionOpen.includes(1)}
                toggleAccordion={toggleAccordion}
              />
              <Accordion
                title="Tasks By Date"
                content={<>
                  {Object.entries(tasksByDate).map(([date, counts]) => (
                    <p key={date}>
                      {date}: <br />Created {counts.created}, Completed {counts.completed}<br /><br />
                    </p>
                  ))}
                </>}
                id={2}
                isOpen={accordionOpen.includes(2)}
                toggleAccordion={toggleAccordion}
              />
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;