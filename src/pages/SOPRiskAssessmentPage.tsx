import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, AlertCircle, Brain, Target, Activity, ArrowRight, ChevronDown, Clock, TrendingUp, FileWarning, Shield, Building2 } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const sampleSOP = {
  id: 'SOP-2024-001',
  title: 'Aseptic Processing and Fill Operations',
  company: 'Dr. Reddys Laboratories',
  version: '2.0',
  effectiveDate: '2024-03-01',
  department: 'Manufacturing',
  category: 'Production',
  riskScore: 8.2,
  status: 'Under Review',
  relatedRegulations: ['21 CFR 211.113', '21 CFR 211.42'],
  historicalFindings: [
    {
      id: '483-2023-001',
      type: 'Form 483',
      date: '2023-09-15',
      finding: 'Inadequate environmental monitoring during aseptic operations',
      severity: 'Critical'
    },
    {
      id: 'WL-2023-002',
      type: 'Warning Letter',
      date: '2023-10-30',
      finding: 'Failure to establish proper controls for aseptic processing',
      severity: 'Major'
    }
  ],
  riskFactors: [
    {
      category: 'Process Risk',
      score: 8.5,
      factors: [
        'Complex sterile manufacturing process',
        'Multiple manual interventions',
        'Critical process parameters'
      ]
    },
    {
      category: 'Compliance Risk',
      score: 7.8,
      factors: [
        'Historical compliance issues',
        'Recent regulatory citations',
        'Industry trend of similar violations'
      ]
    },
    {
      category: 'Product Risk',
      score: 8.7,
      factors: [
        'Sterile injectable product',
        'High-risk therapeutic area',
        'Complex formulation'
      ]
    }
  ],
  aiRecommendations: [
    {
      area: 'Environmental Monitoring',
      recommendation: 'Enhance monitoring frequency during critical operations',
      priority: 'High',
      impact: 'Direct impact on product quality'
    },
    {
      area: 'Personnel Training',
      recommendation: 'Implement advanced aseptic technique training program',
      priority: 'Medium',
      impact: 'Improved process control'
    },
    {
      area: 'Documentation',
      recommendation: 'Strengthen batch record review process',
      priority: 'High',
      impact: 'Better compliance documentation'
    }
  ]
};

export default function SOPRiskAssessmentPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRiskFactor, setSelectedRiskFactor] = useState<string | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 8) return 'bg-red-400/10';
    if (score >= 6) return 'bg-yellow-400/10';
    return 'bg-green-400/10';
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">SOP Risk Assessment</h1>
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400">
                {sampleSOP.id}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              AI-powered risk analysis and compliance assessment for Standard Operating Procedures
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-secondary flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload New SOP
            </button>
          </div>
        </div>

        {/* SOP Info Card */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-400" />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-white">{sampleSOP.title}</h2>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-1" />
                    {sampleSOP.company}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-medium text-yellow-400">
                {sampleSOP.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Version</div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{sampleSOP.version}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Effective Date</div>
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{sampleSOP.effectiveDate}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Department</div>
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{sampleSOP.department}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Category</div>
                  <FileWarning className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-lg font-semibold text-white">{sampleSOP.category}</div>
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
            <div className={`${getRiskBgColor(sampleSOP.riskScore)} rounded-lg p-6 border ${getRiskColor(sampleSOP.riskScore).replace('text', 'border')}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertCircle className={`h-5 w-5 ${getRiskColor(sampleSOP.riskScore)} mr-2`} />
                  <span className="text-sm font-medium text-gray-300">High Risk</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-sm text-red-400">+2.3%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{sampleSOP.riskScore.toFixed(1)}</div>
              <div className="text-sm text-gray-400 mt-1">Risk Score</div>
              <div className="mt-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getRiskColor(sampleSOP.riskScore).replace('text', 'bg')}`}
                    style={{ width: `${(sampleSOP.riskScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'historical-findings', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }
                `}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Risk Factors */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Risk Factors</h3>
                <div className="space-y-4">
                  {sampleSOP.riskFactors.map((factor) => (
                    <div
                      key={factor.category}
                      className="bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{factor.category}</span>
                        <span className={`${getRiskColor(factor.score)}`}>
                          {factor.score.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {factor.factors.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-400">
                            <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Regulations */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Related Regulations</h3>
                <div className="space-y-4">
                  {sampleSOP.relatedRegulations.map((regulation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-blue-400 mr-3" />
                        <span className="text-white">{regulation}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historical-findings' && (
            <div className="space-y-6">
              {sampleSOP.historicalFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {finding.type === 'Form 483' ? (
                        <FileText className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      )}
                      <div>
                        <h4 className="text-lg font-medium text-white">{finding.type}</h4>
                        <p className="text-sm text-gray-400">{finding.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                      ${finding.severity === 'Critical' ? 'bg-red-400/10 text-red-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                      {finding.severity}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-300">{finding.finding}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {finding.date}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {sampleSOP.aiRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 text-purple-400" />
                      <h4 className="text-lg font-medium text-white">{recommendation.area}</h4>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                      ${recommendation.priority === 'High' ? 'bg-red-400/10 text-red-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                      {recommendation.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-300">{recommendation.recommendation}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-400">
                    <Target className="h-4 w-4 mr-1" />
                    Impact: {recommendation.impact}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}