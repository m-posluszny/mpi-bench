import React from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';

const exdata = {
    datasets: [
        {
            label: 'Dataset 1',
            data: [
                { x: -10, y: 0 },
                { x: -5, y: 5 },
                { x: 0, y: 10 },
                { x: 5, y: 5 },
                { x: 10, y: 0 },
            ],
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 0.4)',
            showLine: true, // This will draw the line

        },
        {
            label: 'Dataset 2',
            data: [
                { x: -10, y: 5 },
                { x: -5, y: 10 },
                { x: 0, y: 5 },
                { x: 5, y: 0 },
                { x: 10, y: 5 },
            ],
            backgroundColor: 'rgba(153, 102, 255, 1)',
            borderColor: 'rgba(153, 102, 255, 0.4)',
            showLine: true, // This will draw the line
        },
    ],
};

export const ScatterChart = ({ data, x, y, height = 400, width = 400 }) => {

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: x,
                },
            },
            y: {
                title: {
                    display: true,
                    text: y,
                },
            }
        },
    };

    return (
        <div className='bg-white rounded-xl p-2'>
            <Scatter data={data} options={options} height={height} width={width} />
        </div>
    );
};
