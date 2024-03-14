import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const Donut = ({count})=>{
    const data = {
        labels: ['Answered', 'Not Answered'],
        datasets: [
          {
            data: count.every(value => value === 0) ? [0.1,0] : count,
            backgroundColor: count.every(value => value === 0) ? ['rgba(0, 0, 0, 0.01)'] : ['#00FF40', '#E62020'],
            hoverBackgroundColor: count.every(value => value === 0) ? ['rgba(0, 0, 0, 0.05)'] : ['#3FFF00','#F40009'],
            borderWidth: 2.5,
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