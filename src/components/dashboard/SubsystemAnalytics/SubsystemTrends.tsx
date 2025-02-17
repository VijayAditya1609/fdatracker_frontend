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
import { getYearlyTrend } from '../../../services/dashboard';
import type { YearlyTrend } from '../../../services/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SubsystemTrendsProps {
  dateRange: string;
}

export default function SubsystemTrends({ dateRange }: SubsystemTrendsProps) {
  const [trends, setTrends] = useState<YearlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setIsLoading(true);
        const data = await getYearlyTrend(dateRange);
        const filteredData = data
          .filter(trend => trend.issue_year !== null)
          .filter(trend => parseInt(trend.issue_year) >= 2018)
          .sort((a, b) => parseInt(a.issue_year) - parseInt(b.issue_year));
        setTrends(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trends');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, [dateRange]);

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading trends...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  const maxValue = Math.max(
    ...trends.map(trend => Math.max(
      parseInt(trend.count_483s) || 0,
      parseInt(trend.count_warning_letters) || 0
    ))
  );

  const yAxisMax = Math.ceil(maxValue * 1.2);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: yAxisMax,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          padding: 10,
          font: {
            size: 11
          },
          stepSize: Math.ceil(yAxisMax / 5)
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
          }
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
        text: 'FDA Actions By Year',
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
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    }
  };

  const data = {
    labels: trends.map(trend => trend.issue_year),
    datasets: [
      {
        label: 'Form 483s',
        data: trends.map(trend => parseInt(trend.count_483s) || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 16,
        maxBarThickness: 20
      },
      {
        label: 'Warning Letters',
        data: trends.map(trend => parseInt(trend.count_warning_letters) || 0),
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