import React from 'react';
import { Building2, MapPin, Calendar, Activity, FileWarning, Shield, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { WarningLetterResponse } from '../../types/warningLetter';
import RiskScoreGauge from '../visualizations/RiskScoreGauge';

interface OverviewTabProps {
  data: WarningLetterResponse;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const { warningLetterDetails } = data;

  // Chart data for compliance trend
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Risk Score',
      data: [7.8, 8.1, 7.9, 8.3, 8.0, 8.2],
      borderColor: 'rgba(239, 68, 68, 1)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4
    }]
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
      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-400" />
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-white">{warningLetterDetails.companyAffected}</h2>
                <div className="flex items-center mt-1 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  {warningLetterDetails.addressOfTheIssue}
                </div>
              </div>
            </div>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Issue Date</div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{warningLetterDetails.date}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Violations</div>
                <FileWarning className="h-5 w-5 text-red-400" />
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{warningLetterDetails.violations.length}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">FEI Number</div>
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{warningLetterDetails.feinumber || 'N/A'}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Country</div>
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{warningLetterDetails.countryOfTheIssue}</div>
            </div>
          </div>

          {warningLetterDetails.investigators && warningLetterDetails.investigators.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Investigators</h3>
              <div className="flex flex-wrap gap-2">
                {warningLetterDetails.investigators.map((investigator, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    {investigator}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Summary Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
        <p className="text-gray-300 leading-relaxed">{data.summaryWL}</p>
      </div>
    </div>
  );
}