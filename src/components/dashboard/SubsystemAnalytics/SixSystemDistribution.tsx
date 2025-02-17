import React, { useEffect, useState } from 'react';
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
import { getSystemCounts } from '../../../services/dashboard';
import type { SystemCount } from '../../../services/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SixSystemDistributionProps {
  dateRange: string;
}

export default function SixSystemDistribution({ dateRange }: SixSystemDistributionProps) {
  const [systems, setSystems] = useState<SystemCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const data = await getSystemCounts(dateRange);
        setSystems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load system distribution');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, [dateRange]);

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading system distribution...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          padding: 10,
          font: {
            size: 11
          }
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          padding: 5,
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        },
        border: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'centre' as const,
        labels: {
          color: '#D1D5DB',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'System Distribution',
        color: '#F3F4F6',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F3F4F6',
        bodyColor: '#D1D5DB',
        padding: 12,
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          size: 11
        }
      }
    }
  };

  const data = {
    labels: systems.map(system => system.system_name),
    datasets: [
      {
        label: 'Form 483s',
        data: systems.map(system => parseInt(system.count_483s)),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 20
      },
      {
        label: 'Warning Letters',
        data: systems.map(system => parseInt(system.count_warning_letters)),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 20
      }
    ]
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
      <div className="h-[400px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}