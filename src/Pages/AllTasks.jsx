import React, { useMemo, useState } from 'react';
import TaskViewAccordion from '../Components/TaskViewAccordion';
import { Link } from 'react-router-dom';
import { useAppState } from '../reducers/reducer';

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
    <div className='flex flex-col justify-center items-center'>
      <div className='w-2/4'>
      <div>
        <Link to='/addtask'>
          Add New Task
        </Link>
      </div>
        {tabs.map((ele) => (
          <span
            key={ele.index}
            onClick={() => setTab(ele.index)}
            className={`cursor-pointer px-5 ${tab === ele.index ? 'font-bold' : ''}`}
          >
            {ele.name}
          </span>
        ))}
        <div className='mt-4'>
          <div className=''>
            {filteredTasks.map((ele) => (
              <TaskViewAccordion key={ele.id} props={ele} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
