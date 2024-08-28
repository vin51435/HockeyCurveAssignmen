import React, { useReducer, useContext, createContext, useEffect } from 'react';

const StateContext = createContext();
const DispatchContext = createContext();

const generateUniqueId = () => Date.now();

const initialTaskState = JSON.parse(localStorage.getItem('tasks')) || [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Draft and submit the project proposal document.",
    createdOn: '2024-09-22', // Current date innew Date()'
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 1,
    completed: false,
  },
  {
    id: 2,
    title: "Review Team Feedback",
    description: "Go through the feedback provided by the team.",
    createdOn: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 2,
    completed: false,
  },
  {
    id: 3,
    title: "Submit Timesheet",
    description: "Submit the timesheet for this week.",
    createdOn: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 3,
    completed: false,
  },
  {
    id: 4,
    title: "Submit Timesheet2",
    description: "Submit the timesheet for this week.",
    createdOn: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 3,
    completed: true,
  },
  {
    id: 5,
    title: "Over Due",
    description: "Submit the timesheet for last week.",
    createdOn: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    priority: 1,
    completed: false,
  }
];


function reducer(state, action) {
  switch (action.type) {
    case 'display':
      console.log(state);
      return state;
    case 'state': {
      return action.payload;
    }
    case 'complete': {
      const updatedState = state.map(task =>
        task.id === action.payload.id ? { ...task, completed: true } : task
      );
      return updatedState;
    }
    case 'update': {
      const updatedState = state.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload } // Replace the entire task object
          : task
      );
      return updatedState;
    }
    case 'snooze': {
      const updatedState = state.map(task =>
        task.id === action.payload.id
          ? { ...task, dueDate: new Date(new Date(task.dueDate).getTime() + 24 * 60 * 60 * 1000).toISOString() }
          : task
      );
      return updatedState;
    }
    case 'delete': {
      return state.filter(task => task.id !== action.payload?.id);
    }
    case 'add': {
      console.log(action.payload);
      const newTask = {
        id: generateUniqueId(),
        title: action.payload?.title,
        description: action.payload?.description,
        dueDate: new Date(action.payload?.dueDate),
        priority: action.payload?.priority && 3,
        createdOn: new Date(),
        completed: false,
      };

      return [...state, newTask];
    }
    default:
      throw new Error('Unknown action type');
  }
}

// eslint-disable-next-line react/prop-types
export function TaskStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialTaskState);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state));
  }, [state]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Custom hooks for accessing state and dispatch
export function useAppState() {
  return useContext(StateContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}
