import React from 'react';
import { Activity, FileText, AlertTriangle, AlertCircle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LabelList, Legend } from 'recharts';
import type { SystemReport } from '../../../types/system';
import { useNavigate, useParams } from 'react-router-dom';

interface SystemOverviewTabProps {
  systemReport: SystemReport;
  dateRange: string;
}

export default function SystemOverviewTab({ systemReport, dateRange }: SystemOverviewTabProps) {
  const navigate = useNavigate();
  const { system_id } = useParams<{ system_id: string }>();

  // Use the new total fields directly from the API
  const totals = {
    total483sIssued: systemReport.systemTotal483sIssued,
    total483sConverted: systemReport.systemTotal483sConverted
  };

  // Calculate conversion rate using the new totals
  const conversionRate = totals.total483sIssued > 0 
    ? Math.round((totals.total483sConverted / totals.total483sIssued) * 100) 
    : 0;

  // Updated data preparation for subsystem comparison chart with sorting
  const subsystemData = Object.entries(systemReport.subSystems)
    .map(([name, data]) => ({
      name,
      form483s: data.total483sIssued,
      warningLetters: data.total483sConverted,
      totalFindings: data.total483sIssued + data.total483sConverted,
      totalObservations: data.totalObservations,
      totalViolations: data.totalViolations
    }))
    .sort((a, b) => b.form483s - a.form483s); // Sort by form483s count

  const handleBarClick = (data: any) => {
    // Encode the subsystem name for the URL and use dynamic system_id
    const encodedSubsystem = encodeURIComponent(data.name);
    navigate(`/systems/${system_id}/subsystems/${encodedSubsystem}`);
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-400/10 rounded-lg">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{totals.total483sIssued}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Form 483s Issued</h3>
          {/* <div className="mt-2 text-xs text-blue-400">
            +{Math.round(totals.total483sIssued * 0.1)} from last period
          </div> */}
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-400/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-white">{totals.total483sConverted}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Warning Letters</h3>
          {/* <div className="mt-2 text-xs text-red-400">
            +{Math.round(totals.total483sConverted * 0.1)} from last period
          </div> */}
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-400/10 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-white">{conversionRate}%</span>
          </div>
          <h3 className="text-gray-400 text-sm">Escalation Rate</h3>
          {/* <div className="mt-2 text-xs text-yellow-400">
            {conversionRate > 50 ? 'High' : conversionRate > 25 ? 'Medium' : 'Low'} risk level
          </div> */}
        </div>
      </div>

      {/* Full-width Subsystem Comparison Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Subsystem Comparison</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
              <span className="text-sm text-gray-400">Form 483s</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-400"></div>
              <span className="text-sm text-gray-400">Warning Letters</span>
            </div>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={subsystemData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#F9FAFB', fontWeight: 600, marginBottom: '8px' }}
                itemStyle={{ color: '#9CA3AF' }}
                formatter={(value: number, name: string) => [
                  value,
                  name === 'form483s' ? 'Form 483s' : 'Warning Letters'
                ]}
              />
              <Bar 
                dataKey="form483s" 
                fill="#60A5FA" 
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              >
                <LabelList 
                  dataKey="form483s" 
                  position="top" 
                  fill="#9CA3AF"
                  fontSize={12}
                />
              </Bar>
              <Bar 
                dataKey="warningLetters" 
                fill="#F87171"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              >
                <LabelList 
                  dataKey="warningLetters" 
                  position="top" 
                  fill="#9CA3AF"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Issues - Now sorted by form483s */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">High-Risk Sub-Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsystemData
            .slice(0, 6)
            .map(({name, form483s, warningLetters, totalObservations, totalViolations}, index) => (
              <div 
                key={name} 
                className="flex flex-col p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/40 transition-colors cursor-pointer"
                onClick={() => navigate(`/systems/${system_id}/subsystems/${encodeURIComponent(name)}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-400' :
                      index === 2 ? 'bg-orange-400/20 text-orange-400' :
                      'bg-blue-400/20 text-blue-400'}`}
                  >
                    {index + 1}
                  </span>
                  <h4 className="text-gray-200 font-medium truncate">{name}</h4>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-400">
                        {form483s} Form 483s
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-gray-400">
                        {warningLetters} Warning Letters
                      </span>
                    </div>
                  </div>
                  
                  {/* <div className={`px-3 py-1 rounded-full text-xs font-medium
                    ${totalObservations > 40 ? 'bg-red-400/10 text-red-400' :
                      totalObservations > 20 ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-green-400/10 text-green-400'}`}
                  >
                    {totalObservations > 40 ? 'High Risk' :
                      totalObservations > 20 ? 'Medium Risk' : 'Low Risk'}
                  </div> */}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 