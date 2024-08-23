import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TaskStateProvider } from './Reducers/reducer.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TaskStateProvider>
      <App />
    </TaskStateProvider>
  </StrictMode>,
);
