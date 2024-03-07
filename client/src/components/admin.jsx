import React, { useEffect, useState } from 'react';
import './admin.css';
import Select from 'react-select';
import axios from 'axios';
import Error from './images/Error.png';
import { useNavigate } from 'react-router-dom';

const Admin = ({isLogin}) =>{
    const [selected,setSelected]=useState({ value: 'all', label: 'All' });
    const [search,setSearch]=useState('all');
    const [data,setData]=useState([]);
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
      const fData= async()=>{
        try{
          await axios.post('http://127.0.0.1:5000/admin',{"query" : search})
          .then(res =>{
            setData(res.data);
            console.log(res.data);
          })
          .catch(err => console.log(err));
        }catch(e){
          console.error(e);
        }
      }
      fData();
    }, [search]);

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
          </>
        ):(
          <>
            <div className="error-container">
              <h1>Sorry You haven't Logged in...</h1>
              <img src={Error} alt="Error" srcset="" />
              <div className="link">
              <svg className='arrow' xmlns="http://www.w3.org/2000/svg" height='20' width='20' viewBox="0 0 512 512">
                <path  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
              </svg>
              <div className='p' onClick={(e)=> link("/admin")}><label>Go to Login</label></div>
              </div>
            </div>
          </>
        )}
      </div>
    )
}

export default Admin;