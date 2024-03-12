import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const Donut = ({count})=>{
    const data = {
        labels: ['Answered', 'Not Answered'],
        datasets: [
          {
            data: count,
            backgroundColor: ['#00FF40', '#E62020'],
            hoverBackgroundColor: ['#3FFF00','#F40009'],
          },
        ],
      };
    
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'black',
            },
          },
        },
      };

    return(
        <><Doughnut data={data} options={options}/></>      
    );
}

export default Donut;