import React, { useReducer, useContext, createContext, useEffect } from 'react';

const StateContext = createContext();
const DispatchContext = createContext();

function snoozeTask(task) {
  const newDueDate = new Date(task.dueDate);
  newDueDate.setDate(newDueDate.getDate() + 1);
  task.dueDate = newDueDate.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
}

const generateUniqueId = () => Date.now();

const initialTaskState = JSON.parse(localStorage.getItem('tasks')) || [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Draft and submit the project proposal document.",
    createdOn: '2024-09-22', // Current date in 'YYYY-MM-DD'
    dueDate: '2024-09-23',
    dueTime: '09:00 PM',
    priority: 1,
    completed: false,
    snooze: function () { snoozeTask(this); }
  },
  {
    id: 2,
    title: "Review Team Feedback",
    description: "Go through the feedback provided by the team.",
    createdOn: '2024-09-22',
    dueDate: '2024-09-25',
    dueTime: '10:00:00',
    priority: 2,
    completed: false,
    snooze: function () { snoozeTask(this); }
  },
  {
    id: 3,
    title: "Submit Timesheet",
    description: "Submit the timesheet for this week.",
    createdOn: '2024-09-22',
    dueDate: '2024-09-28',
    dueTime: '11:00:00',
    priority: 3,
    completed: false,
    snooze: function () { snoozeTask(this); }
  },
  {
    id: 4,
    title: "Submit Timesheet2",
    description: "Submit the timesheet for this week.",
    createdOn: '2024-09-22',
    dueDate: '2024-09-28',
    dueTime: '12:00:00',
    priority: 3,
    completed: true,
    snooze: function () { snoozeTask(this); }
  }
];


function reducer(state, action) {
  switch (action.type) {
    case 'display':
      console.log(state);
      return state;
    case 'update': {
      const updatedState = state.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload } // Replace the entire task object
          : task
      );

      return updatedState;
    }
    case 'delete': {
      return state.filter(task => task.id !== action.payload?.id);
    }
    case 'add': {
      const newTask = {
        id: generateUniqueId(),
        title: action.payload?.title,
        description: action.payload?.description,
        dueDate: new Date(action.payload?.dueDate),
        priority: action.payload?.priority,
        completed: action.payload?.completed,
        snooze: snoozeTask // Assuming `snoozeTask` is defined elsewhere
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
