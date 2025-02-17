import React from 'react';
import { BarChart2, TrendingUp, Brain, AlertCircle, Target, Activity } from 'lucide-react';
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

export default function AnalyticsTab() {
  // Trend Analysis Chart Data
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Risk Score',
        data: [7.2, 7.5, 7.8, 7.4, 7.1, 6.8],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Industry Average',
        data: [6.5, 6.5, 6.6, 6.4, 6.5, 6.5],
        borderColor: 'rgba(156, 163, 175, 1)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Predicted Risk Score</div>
              <div className="mt-2 flex items-center">
                <span className="text-2xl font-bold text-white">6.8</span>
                <span className="ml-2 text-sm text-green-400 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  -5.6%
                </span>
              </div>
            </div>
            <Brain className="h-8 w-8 text-blue-400" />
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">Confidence Score</div>
            <div className="mt-1 text-sm text-white">85%</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Industry Percentile</div>
              <div className="mt-2 flex items-center">
                <span className="text-2xl font-bold text-white">85th</span>
              </div>
            </div>
            <Target className="h-8 w-8 text-purple-400" />
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">Similar Facilities</div>
            <div className="mt-1 text-sm text-white">15 facilities</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Remediation Progress</div>
              <div className="mt-2 flex items-center">
                <span className="text-2xl font-bold text-white">65%</span>
              </div>
            </div>
            <Activity className="h-8 w-8 text-green-400" />
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400">Estimated Completion</div>
            <div className="mt-1 text-sm text-white">2 months</div>
          </div>
        </div>
      </div>

      {/* Risk Trend Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Risk Trend Analysis</h3>
          <div className="flex items-center space-x-4">
            <select className="bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 px-3 py-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>Last 2 Years</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <Line data={trendData} options={chartOptions} />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-400" />
          AI Insights
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center text-yellow-400 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Potential Risk Areas</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
              <li>Environmental monitoring frequency needs improvement</li>
              <li>Documentation system shows patterns of inconsistency</li>
              <li>Training program effectiveness requires evaluation</li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center text-green-400 mb-2">
              <Target className="h-5 w-5 mr-2" />
              <span className="font-medium">Recommended Actions</span>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
              <li>Implement automated environmental monitoring system</li>
              <li>Enhance documentation review process</li>
              <li>Develop comprehensive training effectiveness metrics</li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center text-blue-400 mb-2">
              <Activity className="h-5 w-5 mr-2" />
              <span className="font-medium">Industry Benchmarks</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="text-sm text-gray-400">Quality System</div>
                <div className="text-lg font-semibold text-white">85%</div>
                <div className="text-xs text-green-400">+5% above avg</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Documentation</div>
                <div className="text-lg font-semibold text-white">72%</div>
                <div className="text-xs text-red-400">-8% below avg</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Training</div>
                <div className="text-lg font-semibold text-white">78%</div>
                <div className="text-xs text-yellow-400">At industry avg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}