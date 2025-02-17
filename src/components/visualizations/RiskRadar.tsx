import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RiskRadarProps {
  data: any;
}

export default function RiskRadar({ data }: RiskRadarProps) {
  const chartData = {
    labels: [
      'Quality System',
      'Facilities & Equipment',
      'Production',
      'Laboratory Controls',
      'Materials System',
      'Packaging & Labeling'
    ],
    datasets: [
      {
        label: 'Risk Score',
        data: [8.5, 7.2, 6.8, 8.9, 5.4, 6.2],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
      },
      {
        label: 'Industry Average',
        data: [7.0, 6.5, 6.0, 7.5, 6.0, 5.5],
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(156, 163, 175, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(156, 163, 175, 1)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="h-64">
      <Radar data={chartData} options={options} />
    </div>
  );
}