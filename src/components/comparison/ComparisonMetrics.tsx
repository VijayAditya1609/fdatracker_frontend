import React from 'react';
import { Building2, AlertTriangle, FileText, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const companyData = {
  'Novo Nordisk': {
    facilities: 12,
    facilitiesTrend: 'up',
    facilitiesChange: '+2',
    warningLetters: 2,
    warningLettersTrend: 'down',
    warningLettersChange: '-1',
    form483s: 8,
    form483sTrend: 'up',
    form483sChange: '+3',
    complianceScore: 92,
    complianceScoreTrend: 'up',
    complianceScoreChange: '+4.2'
  },
  'Eli Lilly': {
    facilities: 15,
    facilitiesTrend: 'up',
    facilitiesChange: '+1',
    warningLetters: 1,
    warningLettersTrend: 'down',
    warningLettersChange: '-2',
    form483s: 5,
    form483sTrend: 'down',
    form483sChange: '-2',
    complianceScore: 88,
    complianceScoreTrend: 'up',
    complianceScoreChange: '+2.1'
  },
  'Sanofi': {
    facilities: 18,
    facilitiesTrend: 'down',
    facilitiesChange: '-1',
    warningLetters: 3,
    warningLettersTrend: 'up',
    warningLettersChange: '+1',
    form483s: 12,
    form483sTrend: 'up',
    form483sChange: '+4',
    complianceScore: 84,
    complianceScoreTrend: 'down',
    complianceScoreChange: '-3.5'
  },
  'AstraZeneca': {
    facilities: 14,
    facilitiesTrend: 'up',
    facilitiesChange: '+3',
    warningLetters: 1,
    warningLettersTrend: 'down',
    warningLettersChange: '-1',
    form483s: 7,
    form483sTrend: 'down',
    form483sChange: '-1',
    complianceScore: 90,
    complianceScoreTrend: 'up',
    complianceScoreChange: '+1.8'
  }
};

interface ComparisonMetricsProps {
  selectedCompanies: string[];
}

export default function ComparisonMetrics({ selectedCompanies }: ComparisonMetricsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {selectedCompanies.map((company) => {
        const data = companyData[company];
        if (!data) return null;

        return (
          <div key={company} className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{company}</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Building2 className="h-4 w-4 mr-2" />
                      Facilities
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium">{data.facilities}</span>
                      <span className={`ml-2 flex items-center ${
                        data.facilitiesTrend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {data.facilitiesTrend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {data.facilitiesChange}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Warning Letters
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium">{data.warningLetters}</span>
                      <span className={`ml-2 flex items-center ${
                        data.warningLettersTrend === 'down' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {data.warningLettersTrend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {data.warningLettersChange}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <FileText className="h-4 w-4 mr-2" />
                      Form 483s
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium">{data.form483s}</span>
                      <span className={`ml-2 flex items-center ${
                        data.form483sTrend === 'down' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {data.form483sTrend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {data.form483sChange}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Activity className="h-4 w-4 mr-2" />
                      Compliance Score
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium">{data.complianceScore}%</span>
                      <span className={`ml-2 flex items-center ${
                        data.complianceScoreTrend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {data.complianceScoreTrend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {data.complianceScoreChange}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        data.complianceScore >= 90 ? 'bg-green-500' :
                        data.complianceScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.complianceScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}