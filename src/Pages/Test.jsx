import React from 'react';
import DarkModeToggle from '../Components/DarkModeButton';

const App = () => {
  return (
    <div className="min-h-screen p-4">
      <DarkModeToggle />
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="text-2xl">Hello World</h1>
        <p>This is a paragraph with dark mode support.</p>
      </div>
    </div>
  );
};

export default App;
