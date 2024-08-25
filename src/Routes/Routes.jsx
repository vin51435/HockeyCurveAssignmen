import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskView from '../Pages/AllTasks';
import Test from '../Pages/Test';
import AddTask from '../Pages/AddTask';

const RouteEle = () => {
  return (
    <Router>
      <Routes>
        {/* <Route element={<WebsiteLayout />}>
      </Route> */}
        <Route path="/" element={<TaskView />} />
        <Route path="/addtask" element={<AddTask />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default RouteEle;