import React, { useEffect, useState } from 'react';
import './admin.css';
import Select from 'react-select';
import axios from 'axios';
import Error from './images/Error.png';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';



const Admin = ({isLogin, setLogin}) =>{
    const [selected, setSelected]=useState({ value: 'all', label: 'All' });
    const [search, setSearch]=useState('all');
    const [data, setData]=useState([]);
    const [count, setCount] = useState([]);
    const [profile, setProfile] = useState({});
    const [newUser, setNewUser] = useState();
    const [newPass, setNewPass] = useState();
    const [div1, setDiv1] = useState(false);    
    const [div2, setDiv2] = useState(false);
    const link = useNavigate();

    const options = [
        { value: 'all', label: 'All' },
        { value: 'ans', label: 'Answered' },
        { value: 'nAns', label: 'Not Answered' },
    ];

    const handleSelectChange = (selectedOption) => {
        setSelected(selectedOption);
        setSearch(selectedOption.value);
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
              setProfile(res.data[0]);
            })
            .catch(e => console.error(e));
          }catch(e) {
            console.error(e);
          }
        }
        count();
      }
    }, [isLogin]);

    const chartData = {
      labels: ['Answered', 'Not Answered'],
      datasets: [
        {
          data: count,
          backgroundColor: ['#00FF40', '#E62020'],
          hoverBackgroundColor: ['#3FFF00','#F40009'],
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

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

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: state.isFocused ? '0 0 0 2px #3366cc' : null,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#3366cc' : '#white',
          color: state.isSelected ? 'white' : 'black',
        }),
      };

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
                <div className="drop-box">
                  <Select
                    className='select'
                    id="dropdown"
                    options={options}
                    value={selected}
                    onChange={handleSelectChange}
                    isSearchable={false}
                    styles={customStyles}
                  />
                </div>
              <div className='body-div'>
                {data.map((item,index)=>(
                    <div className='data' key={index} style={{backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#bfbfbf'}}>
                      <div>{item.query}</div>
                      <div>{item.key}</div>
                    </div>
                ))}
              </div>
              </div>
              <div className="pie-chart">
                <Doughnut data={chartData} options={chartOptions}/>
              </div>
              <div className="profile-container">
                <div className="profile">
                  <label>Profile</label>
                </div>
                <div className="content">
                <svg xmlns="http://www.w3.org/2000/svg" height={250} width={100} viewBox="0 0 448 512">
                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                </svg>
                <div className='card'>
                  <div className='card-d'>
                  <label>Username :</label>
                  {div1 ? (
                    <>
                      <input type="text"
                        className='uname'
                        placeholder={profile.name}
                        onChange={(e)=>setNewUser(e.target.value)}
                      />
                    </>
                  ) : (
                    <p>{profile.name}</p>
                  )}
                  <svg onClick={(e) => setDiv1(true)} xmlns="http://www.w3.org/2000/svg" height={20} width={20} viewBox="0 0 512 512">
                    <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/>
                  </svg>
                  {div1 ?(
                    <><button className='button' onClick={e=>setDiv1(false)}>Ok</button></>
                  ) : (
                    <></>
                  )}
                  </div>
                  <div className='card-d'>
                  <label>Password :</label>
                  {div2 ? (
                    <>
                      <input type="text"
                        className='upass'
                        placeholder={profile.pass}
                        onChange={(e)=>setNewPass(e.target.value)}
                      />
                    </>
                  ) : (
                    <p>{profile.pass}</p>
                  )}
                  <svg onClick={(e) => setDiv2(true)} xmlns="http://www.w3.org/2000/svg" height={20} width={20} viewBox="0 0 512 512">
                    <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/>
                  </svg>
                  {div2 ?(
                    <><button className='button' onClick={e=>setDiv2(false)} style={{display : div2 ? 'inline-block' : 'none' }}>Ok</button></>
                  ) : (
                    <></>
                  )}
                  </div>
                </div>
                </div>
              </div>
            </div>
            </div>
            
          </>
        ):(
          <>
            <div className="error-container">
              <h1>Sorry You haven't Logged in...</h1>
              <img src={Error} alt="Error"/>
              <div className="link">
              <svg className='arrow' xmlns="http://www.w3.org/2000/svg" height='20' width='20' viewBox="0 0 512 512">
                <path  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
              </svg>
              <div className='p' onClick={(e)=> {link("/admin");}}><label>Go to Login</label></div>
              </div>
            </div>
          </>
        )}
      </div>
    )
}

export default Admin;