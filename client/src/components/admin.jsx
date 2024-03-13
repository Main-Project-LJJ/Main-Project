import React, { useEffect, useState } from 'react';
import './admin.css';
import axios from 'axios';
import Donut from './adminComp/Donut';
import Data from './adminComp/data';
import ErrorComp from './adminComp/error';
import Profile from './adminComp/profile';
import Error from './images/Error.png';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = ({isLogin, setLogin}) =>{
    const [selected, setSelected]=useState({ value: 'all', label: 'All' });
    const [search, setSearch]=useState('all');
    const [data, setData]=useState([]);
    const [count, setCount] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [newPass, setNewPass] = useState('');
    const [div1, setDiv1] = useState(false);    
    const [div2, setDiv2] = useState(false);

    const handleSelectChange = (selectedOption) => {
        setSelected(selectedOption);
        setSearch(selectedOption.value);
    };

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

    const success = (msg) =>{
      toast.success(msg,{
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    useEffect(() => {
      if (isLogin){
        const count = async()=>{
          try{
            await axios.get('http://127.0.0.1:5000/count')
            .then(res =>{
              setCount(res.data);
            })
            .catch(e => console.error(e));

            await axios.get('http://127.0.0.1:5000/profile')
            .then(res =>{
              setNewUser(res.data[0].name);
              setNewPass(res.data[0].pass);
            })
            .catch(e => console.error(e));
          }catch(e) {
            console.error(e);
          }
        }
        count();
      }
    }, [isLogin,div1,div2]);

    useEffect(() => {
      if (isLogin){
        const fData = async()=>{
          try{
            await axios.post('http://127.0.0.1:5000/admin',{"query" : search})
            .then(res =>{
              setData(res.data);
            })
            .catch(err => console.log(err));
          }catch(e){
            console.error(e);
          }
        }
        fData();
      }
    }, [isLogin, search]);

    const handleSubmit = async () => {
      try {
        if (newUser !=='' && newPass !==''){
          await axios.post('http://127.0.0.1:5000/profileUpdate',{'query': div1 ? newUser : newPass, 'check': div1 ? 0 : 1})
          .then(res =>{
            if (res.data.data === 'updated'){
              div1? setDiv1(false) : setDiv2(false); 
              success(div1 ? 'User Name Updated' : 'Password Updated');
            }else if(res.data.data === 'exists'){
              div1? setDiv1(false) : setDiv2(false); 
              failure(div1 ? 'User Name already exists' : 'Password already exists');
            }
          })
          .catch(e=> console.log(e));
          }
        else{
          div1 ? setDiv1(false) : setDiv2(false); 
        }
      } catch (error) {
        console.error(error);
      }
    }

    return(
      <div className="admin">
        {isLogin ? (
          <>
          <div className="main-container">
          <div className="container">
              <div className="navbar">
                <div className='dash-div'>
                <label>DASHBOARD</label>
                <svg className="ad" xmlns="http://www.w3.org/2000/svg" height='40' width='40' viewBox="0 0 512 512">
                  <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/>
                </svg>
                </div>
              </div>
              <div className="data-box">
                <Data selected={selected} data={data} handleSelectChange={handleSelectChange} />
              </div>
              <div className="pie-chart">
                <Donut count={count}/>
              </div>
              <div className="profile-container">
                <div className="profile">
                  <label>Profile</label>
                </div>
                <div className="content">
                <svg xmlns="http://www.w3.org/2000/svg" height={175} width={85} viewBox="0 0 448 512">
                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                </svg>
                <div className='card'>
                  <div className='card-d'>
                    <Profile 
                      label="Username :"
                      value={newUser}
                      setValue={setNewUser}
                      div={div1}
                      setDiv={setDiv1}
                    />
                  <button className='button 1' onClick={handleSubmit} disabled={div1 ? false : true}>Ok</button>
                  </div>
                  <div className='card-d'>
                    <Profile 
                      label="Password :"
                      value={newPass}
                      setValue={setNewPass}
                      div={div2}
                      setDiv={setDiv2}
                    />
                  <button className='button 2' onClick={handleSubmit} disabled={div2 ? false : true}>Ok</button>
                  </div>
                </div>
                </div>
              </div>
            </div>
            </div>
            <ToastContainer />
          </>
        ):(
          <>
            <div className="error-container">
              <ErrorComp Error={Error}/>
            </div>
          </>
        )}
      </div>
    )
}

export default Admin;