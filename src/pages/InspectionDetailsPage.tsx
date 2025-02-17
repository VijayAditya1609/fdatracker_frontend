import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  AlertCircle ,
  XCircle,
  FileText,
  FileWarning,
  Activity,
  Clock,
  ArrowRight,
  Target,
  Brain,
  Shield
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import RiskScoreGauge from '../components/visualizations/RiskScoreGauge';

const inspectionData = {
  id: 'INSP-2024-001',
  facilityName: 'PharmaCorp Manufacturing',
  feiNumber: '3002123456',
  companyName: 'PharmaCorp Inc.',
  location: 'Boston, MA, USA',
  inspectionDates: {
    start: '2024-03-01',
    end: '2024-03-05'
  },
  inspectionType: 'Surveillance',
  productType: 'Drug Product',
  classificationCode: 'VAI',
  investigators: [
    'John Smith',
    'Sarah Johnson'
  ],
  systemsCovered: [
    'Quality System',
    'Laboratory Control',
    'Production',
    'Packaging & Labeling'
  ],
  riskScore: 7.8,
  form483: {
    id: '483-2024-001',
    issueDate: '2024-03-05',
    observations: 5,
    status: 'Open',
    systems: ['Quality System', 'Laboratory Control']
  },
  recentActions: [
    {
      type: 'Form 483',
      id: '483-2023-002',
      date: '2023-09-15',
      status: 'Closed',
      summary: 'Minor observations in laboratory controls'
    },
    {
      type: 'Warning Letter',
      id: 'WL-2023-001',
      date: '2023-10-30',
      status: 'Closed',
      summary: 'Data integrity concerns'
    }
  ],
  complianceHistory: {
    inspections: [
      { year: 2024, count: 1, classification: 'VAI' },
      { year: 2023, count: 2, classification: 'NAI' },
      { year: 2022, count: 1, classification: 'VAI' },
      { year: 2021, count: 1, classification: 'NAI' },
      { year: 2020, count: 1, classification: 'VAI' }
    ],
    citations: {
      total: 12,
      open: 2,
      closed: 10
    }
  }
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'citations', label: 'Citations', icon: FileWarning },
  { id: 'compliance-history', label: 'Compliance History', icon: Clock }
];

export default function InspectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const getClassificationColor = (code: string) => {
    switch (code) {
      case 'NAI':
        return 'bg-green-400/10 text-green-400';
      case 'VAI':
        return 'bg-yellow-400/10 text-yellow-400';
      case 'OAI':
        return 'bg-red-400/10 text-red-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-yellow-400/10 text-yellow-400';
      case 'closed':
        return 'bg-green-400/10 text-green-400';
      case 'in progress':
        return 'bg-blue-400/10 text-blue-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
  };

  // Chart data for compliance trend
  const complianceTrendData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [{
      label: 'Inspections',
      data: inspectionData.complianceHistory.inspections.map(i => i.count),
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">Inspection Details</h1>
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400">
                {inspectionData.id}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                {inspectionData.inspectionDates.start} - {inspectionData.inspectionDates.end}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5" />
                {inspectionData.location}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
            ${getClassificationColor(inspectionData.classificationCode)}`}>
            {inspectionData.classificationCode}
          </span>
        </div>

        {/* Basic Info Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-400" />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-white">{inspectionData.facilityName}</h2>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-1" />
                    {inspectionData.companyName}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">FEI Number</div>
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{inspectionData.feiNumber}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Inspection Type</div>
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{inspectionData.inspectionType}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Product Type</div>
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{inspectionData.productType}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Duration</div>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">5 Days</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Systems Covered</h3>
              <div className="flex flex-wrap gap-2">
                {inspectionData.systemsCovered.map((system) => (
                  <span
                    key={system}
                    className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400"
                  >
                    {system}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Investigators</h3>
              <div className="flex flex-wrap gap-2">
                {inspectionData.investigators.map((investigator) => (
                  <span
                    key={investigator}
                    className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    {investigator}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">AI Confidence</span>
                <span className="text-sm text-green-400">92%</span>
              </div>
            </div>
            <RiskScoreGauge score={inspectionData.riskScore} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Form 483 Card */}
              {inspectionData.form483 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Form 483</h3>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                      ${getStatusColor(inspectionData.form483.status)}`}>
                      {inspectionData.form483.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">Issue Date</div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {inspectionData.form483.issueDate}
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">Observations</div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {inspectionData.form483.observations}
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">Systems Cited</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {inspectionData.form483.systems.map((system) => (
                          <span
                            key={system}
                            className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-0.5 text-xs font-medium text-blue-400"
                          >
                            {system}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button className="inline-flex items-center text-blue-400 hover:text-blue-300">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Actions */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Actions</h3>
                <div className="space-y-4">
                  {inspectionData.recentActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {action.type === 'Form 483' ? (
                          <FileText className="h-5 w-5 text-blue-400" />
                        ) : (
                          <FileWarning className="h-5 w-5 text-yellow-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{action.type}</span>
                            <span className="text-sm text-gray-400">{action.id}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-400">{action.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                          ${getStatusColor(action.status)}`}>
                          {action.status}
                        </span>
                        <span className="text-sm text-gray-400">{action.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Risk Factors</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          Previous compliance history indicates recurring issues
                        </li>
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          Multiple systems cited in recent inspections
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-green-400 mb-2">Strengths</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Timely response to previous observations
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Effective CAPA implementation
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-4">Recommendations</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">Short Term</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          Focus on strengthening documentation practices and employee training programs
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">Long Term</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          Implement automated quality management system to reduce manual errors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'citations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Total Citations</div>
                    <FileWarning className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {inspectionData.complianceHistory.citations.total}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Open Citations</div>
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {inspectionData.complianceHistory.citations.open}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Closed Citations</div>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {inspectionData.complianceHistory.citations.closed}
                  </div>
                </div>
              </div>

              {/* Citations List */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">All Citations</h3>
                  <div className="space-y-4">
                    {inspectionData.recentActions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {action.type === 'Form 483' ? (
                            <FileText className="h-5 w-5 text-blue-400" />
                          ) : (
                            <FileWarning className="h-5 w-5 text-yellow-400" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{action.type}</span>
                              <span className="text-sm text-gray-400">{action.id}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-400">{action.summary}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                            ${getStatusColor(action.status)}`}>
                            {action.status}
                          </span>
                          <button className="text-blue-400 hover:text-blue-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance-history' && (
            <div className="space-y-6">
              {/* Inspection History Chart */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Inspection History</h3>
                <div className="h-80">
                  <Line data={complianceTrendData} options={chartOptions} />
                </div>
              </div>

              {/* Inspection History Table */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Year
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Inspections
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Classification
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {inspectionData.complianceHistory.inspections.map((inspection) => (
                      <tr key={inspection.year} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {inspection.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {inspection.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                            ${getClassificationColor(inspection.classification)}`}>
                            {inspection.classification}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}