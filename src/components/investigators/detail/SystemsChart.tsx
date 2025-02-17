import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SystemsChartProps {
  processTypesCount: Record<string, number>;
}

export default function SystemsChart({ processTypesCount }: SystemsChartProps) {
  // Sort systems by count in descending order
  const sortedSystems = Object.entries(processTypesCount)
    .sort(([, a], [, b]) => b - a);

  const data = {
    labels: sortedSystems.map(([name]) => name),
    datasets: [
      {
        label: 'Citations',
        data: sortedSystems.map(([, count]) => count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(147, 51, 234, 0.8)',   // Purple
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(245, 158, 11, 0.8)',   // Orange
          'rgba(16, 185, 129, 0.8)',   // Green
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 50
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            weight: '500'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          },
          label: (context: any) => {
            return `Citations: ${context.raw}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Systems Distribution</h3>
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Systems</div>
          <div className="text-2xl font-semibold text-white">
            {Object.keys(processTypesCount).length}
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Citations</div>
          <div className="text-2xl font-semibold text-white">
            {Object.values(processTypesCount).reduce((a, b) => a + b, 0)}
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Most Cited</div>
          <div className="text-2xl font-semibold text-white">
            {sortedSystems[0]?.[1] || 0}
          </div>
        </div>
      </div>
    </div>
  );
}