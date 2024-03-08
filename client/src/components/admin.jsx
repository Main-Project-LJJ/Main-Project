import React, { useEffect, useState } from 'react';
import './admin.css';
import Select from 'react-select';
import axios from 'axios';
import Error from './images/Error.png';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';


const Admin = ({isLogin, setLogin}) =>{
    const [selected,setSelected]=useState({ value: 'all', label: 'All' });
    const [search,setSearch]=useState('all');
    const [data,setData]=useState([]);
    const [count , setCount] = useState([]);
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
        const fData= async()=>{
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
          <div className="container">
              <div className="navbar"><label>DashBoard</label></div>
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
                <Pie data={chartData} options={chartOptions}/>
              </div>
              <div className="div4">div4</div>
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