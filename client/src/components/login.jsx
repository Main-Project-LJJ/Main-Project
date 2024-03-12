import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import image from './images/login.png';


const Login = ({setLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const link = useNavigate();

  const failure = (msg) =>{
    toast.error(msg,{
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try{
      axios.post('http://127.0.0.1:5000/login',{
        'name':username.trim(),
        'password':password.trim()
      })
      .then(res =>{
        if(res.data.data ==='ok'){
          setLogin(true);
          link("/dashboard");
        }else if(res.data.data === 'wrong pass'){
          failure("Enter correct password");
        }else if (res.data.data === 'wrong user'){
          failure("Enter correct username");
        }  
      })
      .catch(e => console.log(e));
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="login">
        <div className="login-container">
          <h1>Login</h1>
          <div className='form-container'>
            <img className='login-img' src={image} alt="Login" />
            <div className='form'>
              <form onSubmit={handleSubmit} method='POST'>
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    className='login-input'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input 
                    className='login-input'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-button">
                  <button className='login-button' type="submit">Login</button>
                </div>
              </form>
            </div>
          </div>
          <ToastContainer />
        </div>
    </div>
  );
};

export default Login;
