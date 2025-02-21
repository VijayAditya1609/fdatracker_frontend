import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Building2,
  Activity,
  TrendingDown,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { api } from '../../../config/api';
import { auth } from '../../../services/auth';
import { authFetch } from '../../../services/authFetch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataPoint {
  classificationcode: string;
  extract: string;
  count: string;
}

export default function CompanyOverview() {
  const { id } = useParams<{ id: string }>();
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
    
        const statsResponse = await authFetch(`${api.companyStatsData}?companyId=${id}`);
        const statsJson = await statsResponse.json();
        setStatsData(statsJson || {});
    
        const chartResponse = await authFetch(`${api.companyChartsData}?companyId=${id}`);
        const chartJson = await chartResponse.json();
        setChartData(chartJson || []);
      } catch (err) {
        setError('Failed to load company data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, [id]);

  const processStackedBarData = () => {
    if (!chartData.length) return null;

    const years = [...new Set(chartData.map(item => item.extract))].sort();
    const classifications = ['NAI', 'VAI', 'OAI'];

    const datasets = classifications.map(code => {
      const color =
        code === 'NAI' ? 'rgb(87, 188, 255)' :
        code === 'VAI' ? 'rgb(0, 122, 255)' :
        'rgb(255, 159, 64)';

      return {
        label: code,
        data: years.map(year =>
          chartData
            .filter(item => item.extract === year && item.classificationcode === code)
            .reduce((sum, item) => sum + parseInt(item.count || '0'), 0)
        ),
        backgroundColor: color,
      };
    });

    return {
      labels: years,
      datasets,
    };
  };

  const processPieData = () => {
    if (!chartData.length) return null;

    const totals = chartData.reduce((acc, item) => {
      const code = item.classificationcode;
      if (!acc[code]) acc[code] = 0;
      acc[code] += parseInt(item.count || '0');
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
    const percentages = Object.entries(totals).map(([code, value]) => ({
      code,
      percentage: ((value / total) * 100).toFixed(1),
    }));

    return {
      labels: percentages.map(item => item.code),
      datasets: [
        {
          data: percentages.map(item => parseFloat(item.percentage)),
          backgroundColor: [
            'rgba(87, 188, 255, 0.8)', // NAI
            'rgba(0, 122, 255, 0.8)',  // VAI
            'rgba(255, 159, 64, 0.8)', // OAI
          ],
          hoverBackgroundColor: [
            'rgba(87, 188, 255, 1)',
            'rgba(0, 122, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
        },
      ],
    };
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Active Facilities</p>
          <p className="text-2xl font-semibold text-white mt-2">
            {statsData?.active_facilities || 0}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Facilities</p>
          <p className="text-2xl font-semibold text-white mt-2">
            {statsData?.total_facilities || 0}
          </p>
        </div>
        {/* <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Inspections</p>
          <p className="text-2xl font-semibold text-white mt-2">
            {statsData?.count_inspections || 0}
          </p>
        </div> */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Form 483s</p>
          <p className="text-2xl font-semibold text-white mt-2">
            {statsData?.count_483 || 0}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400">Total Warning Letter</p>
          <p className="text-2xl font-semibold text-white mt-2">
            {statsData?.count_wl || 0}
          </p>
        </div>
        
      </div>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Inspection by Classification Code
          </h3>
          <div className="h-80">
            {processPieData() ? (
              <Pie data={processPieData() as any} options={pieOptions} />
            ) : (
              <p className="text-gray-400 text-center">No data available for the pie chart</p>
            )}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Inspections by Year
          </h3>
          <div className="h-80">
            {processStackedBarData() ? (
              <Bar data={processStackedBarData() as any} options={stackedBarOptions} />
            ) : (
              <p className="text-gray-400 text-center">No data available for the bar chart</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
