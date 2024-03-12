import React from 'react';
import Select from 'react-select';

const Data = (props) =>{
    const options = [
        { value: 'all', label: 'All' },
        { value: 'ans', label: 'Answered' },
        { value: 'nAns', label: 'Not Answered' },
    ];

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

    return (
        <>
            <div className="drop-box">
                <Select
                  className='select'
                  id="dropdown"
                  options={options}
                  value={props.selected}
                  onChange={props.handleSelectChange}
                  isSearchable={false}
                  styles={customStyles}
                />
            </div>
            <div className='body-div'>
              {props.data.map((item,index)=>(
                  <div className='data' key={index} style={{backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#bfbfbf'}}>
                    <div>{item.query}</div>
                    <div>{item.key}</div>
                  </div>
              ))}
            </div>
        </>
    )
};

export default Data;
