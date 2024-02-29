import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Chat from './components/chat';
import Login from './components/login';
import Admin from './components/admin';


const App = () => {
  return(
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Chat/>}/>
          <Route path='/admin'element={<Login/>}/>
          <Route path='/admin-view' element={<Admin/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
