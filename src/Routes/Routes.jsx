import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskView from '../Pages/TaskPage';
import Test from '../Pages/Test';

const RouteEle = () => {
  return (
    <Router>
      <Routes>
        {/* <Route element={<WebsiteLayout />}>
      </Route> */}
        <Route path="/" element={<TaskView />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default RouteEle;