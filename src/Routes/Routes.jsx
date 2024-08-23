import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskView from '../Pages/TaskView';

const RouteEle = () => {
  return (
    <Router>
      <Routes>
        {/* <Route element={<WebsiteLayout />}>
      </Route> */}
        <Route path="/" element={<TaskView />} />
      </Routes>
    </Router>
  );
};

export default RouteEle;