import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Chat from './components/chat';
import Login from './components/login';
import Admin from './components/admin';


const App = () => {
  const [isLogin, setLogin] = useState(false);

  return(
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Chat/>}/>
          <Route path='/admin'element={<Login setLogin={setLogin}/>}/>
          <Route path='/dashboard' element={<Admin isLogin={isLogin} setLogin={setLogin}/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
