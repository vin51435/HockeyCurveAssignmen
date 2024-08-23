import React from 'react';
import { useAppDispatch, useAppState } from '../Reducers/reducer';

const TaskPage = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className=''>
        <h1>No. of Task: {state.length}</h1>
      </div>
      <button className='rounded-full bg-green-600 px-4 py-2 text-white' 
      onClick={() => dispatch({ type: 'display' })}>
      See console
      </button>
    </div>
  );
};

export default TaskPage;