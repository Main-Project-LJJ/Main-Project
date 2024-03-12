import React from "react";
import { useNavigate } from 'react-router-dom';

const ErrorComp = ({Error}) => {
    const link = useNavigate();

    return(
        <>
        <h1>Sorry You haven't Logged in...</h1>
        <img src={Error} alt="Error"/>
        <div className="link">
        <svg className='arrow' xmlns="http://www.w3.org/2000/svg" height='20' width='20' viewBox="0 0 512 512">
          <path  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
        </svg>
        <div className='p' onClick={(e)=> {link("/admin");}}>
            <label>Go to Login</label></div>
        </div>
        </>
    );
};

export default ErrorComp;