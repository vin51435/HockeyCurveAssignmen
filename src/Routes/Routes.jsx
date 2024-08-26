import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskView from '../Pages/AllTasks';
import Test from '../Pages/Test';
import AddEditTask from '../Pages/AddEditTask';

const RouteEle = () => {
  return (
    <Router>
      <Routes>
        {/* <Route element={<Layout />}> */}
          <Route path="/" element={<TaskView />} />
          <Route path="/task" element={<AddEditTask />} />
          <Route path="/test" element={<Test />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default RouteEle;