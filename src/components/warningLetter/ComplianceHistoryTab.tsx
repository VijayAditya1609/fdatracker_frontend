import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const complianceHistory = [
  {
    type: 'Form 483',
    id: '483-2023-001',
    date: '2023-09-15',
    observations: 8,
    status: 'Closed',
    criticalFindings: 2,
    response: 'Adequate'
  },
  {
    type: 'Warning Letter',
    id: 'WL-2024-001',
    date: '2024-03-01',
    violations: 6,
    status: 'Open',
    criticalFindings: 1,
    response: 'In Progress'
  }
];

export default function ComplianceHistoryTab() {
  // Compliance Trend Chart Data
  const trendData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Compliance Score',
        data: [85, 82, 78, 75, 72, 68],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Metrics */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Inspections</div>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">12</div>
          <div className="mt-1 flex items-center text-sm text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +2 from last year
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Form 483s</div>
            <FileText className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">8</div>
          <div className="mt-1 flex items-center text-sm text-red-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +3 from last year
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Warning Letters</div>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">2</div>
          <div className="mt-1 flex items-center text-sm text-red-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +1 from last year
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Response Rate</div>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">92%</div>
          <div className="mt-1 flex items-center text-sm text-green-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5% from last year
          </div>
        </div>
      </div>

      {/* Compliance Trend Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Compliance Trend</h3>
        <div className="h-80">
          <Line data={trendData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Compliance History */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Compliance History</h3>
        <div className="space-y-4">
          {complianceHistory.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-4">
                {event.type === 'Form 483' ? (
                  <FileText className="h-6 w-6 text-yellow-400" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{event.type}</span>
                    <span className="text-sm text-gray-400">{event.id}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400">{event.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Findings</div>
                  <div className="text-sm font-medium text-white">
                    {event.observations || event.violations}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Status</div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    event.status === 'Closed' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Response</div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    event.response === 'Adequate' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {event.response}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}