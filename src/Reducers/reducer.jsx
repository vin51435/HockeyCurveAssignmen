import React, { useReducer, useContext, createContext } from 'react';

const StateContext = createContext();
const DispatchContext = createContext();

const snoozeTask = function () {
  this.dueDate.setDate(this.dueDate.getDate() + 1);
};

const initialTaskState = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Draft and submit the project proposal document.",
    dueDate: new Date(2024, 8, 23), // September 23, 2024
    priority: 1,
    completed: false,
    snooze: snoozeTask
  },
  {
    id: 2,
    title: "Review Team Feedback",
    description: "Go through the feedback provided by the team.",
    dueDate: new Date(2024, 8, 25), // September 25, 2024
    priority: 2,
    completed: false,
    snooze: snoozeTask
  },
  {
    id: 3,
    title: "Submit Timesheet",
    description: "Submit the timesheet for this week.",
    dueDate: new Date(2024, 8, 28), // September 28, 2024
    priority: 3,
    completed: false,
    snooze: snoozeTask
  }
]
  ;

function reducer(state, action) {
  switch (action.type) {
    case 'display':
      console.log(state);
      return state;
    case 'update': {
      const updatedState = [...state];
      const taskIndex = updatedState.findIndex(task => task.id === action.payload?.id);

      if (taskIndex === -1) {
        throw new Error('Task not found'); // Error handling if task is not found
      }

      updatedState[taskIndex] = {
        ...updatedState[taskIndex],
        [action.payload?.name]: action.payload?.value
      };

      return updatedState;
    }
    case 'delete': {
      return state.filter(task => task.id !== action.payload?.id);
    }
    case 'add': {
      const newTask = {
        id: action.payload?.id,
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
