import React from 'react';
import { Activity, AlertTriangle, FileWarning, ClipboardCheck } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { ChartData, FacilityStats } from '../../../services/facility';
import { Chart as ChartJS } from 'chart.js';

interface InspectionHistoryProps {
  chartData: ChartData[];
  stats: FacilityStats;
}

export default function InspectionHistory({ chartData, stats }: InspectionHistoryProps) {
  // Get unique years and sort them
  const years = [...new Set(chartData.map(item => item.extract))].sort();

  // Helper function to sum up counts for a specific year and classification
  const sumCountsForYearAndClass = (year: string, classCode: string) => {
    return chartData
      .filter(item => item.extract === year && item.classificationcode === classCode)
      .reduce((sum, item) => sum + parseInt(item.count), 0);
  };

  // Process chart data by summing counts by year for each classification
  const naiData = years.map(year => sumCountsForYearAndClass(year, 'NAI'));
  const vaiData = years.map(year => sumCountsForYearAndClass(year, 'VAI'));
  const oaiData = years.map(year => sumCountsForYearAndClass(year, 'OAI'));

  // Updated chart options with fixed y-axis
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
          stepSize: 1, // Force step size to be 1
          precision: 0, // Remove decimal places
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        cornerRadius: 8,
      },
    },
  };

  // Updated chart data with modern colors
  const inspectionTrendData = {
    labels: years,
    datasets: [
      {
        label: 'NAI',
        data: naiData,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Modern blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 0,
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'VAI',
        data: vaiData,
        backgroundColor: 'rgba(245, 158, 11, 0.7)', // Modern amber
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 0,
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: 'OAI',
        data: oaiData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // Modern red
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 0,
        borderRadius: 4,
        barThickness: 16,
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Facility Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Inspections</div>
            <ClipboardCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{stats.count_inspections}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Form 483s</div>
            <FileWarning className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{stats.count_483}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Warning Letters</div>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{stats.count_wl}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Classifications</div>
            <Activity className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">
            {naiData.reduce((a, b) => a + b, 0) + 
             vaiData.reduce((a, b) => a + b, 0) + 
             oaiData.reduce((a, b) => a + b, 0)}
          </div>
        </div>
      </div>

      {/* Inspection Trend Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Inspection History</h3>
        <div className="h-80">
          <Bar 
            data={inspectionTrendData} 
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}