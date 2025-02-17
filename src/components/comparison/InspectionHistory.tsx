import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface InspectionHistoryProps {
  selectedCompanies: string[];
}

const inspectionData = {
  'Novo Nordisk': {
    total: 24,
    nai: 18,
    vai: 5,
    oai: 1,
    lastYear: {
      total: 8,
      nai: 6,
      vai: 2,
      oai: 0
    }
  },
  'Eli Lilly': {
    total: 20,
    nai: 16,
    vai: 4,
    oai: 0,
    lastYear: {
      total: 6,
      nai: 5,
      vai: 1,
      oai: 0
    }
  },
  'Sanofi': {
    total: 28,
    nai: 20,
    vai: 6,
    oai: 2,
    lastYear: {
      total: 10,
      nai: 7,
      vai: 2,
      oai: 1
    }
  },
  'AstraZeneca': {
    total: 22,
    nai: 17,
    vai: 4,
    oai: 1,
    lastYear: {
      total: 7,
      nai: 5,
      vai: 2,
      oai: 0
    }
  }
};

export default function InspectionHistory({ selectedCompanies }: InspectionHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Inspection History</h3>
      
      <div className="space-y-6">
        {selectedCompanies.map((company) => {
          const data = inspectionData[company];
          if (!data) return null;

          return (
            <div key={company} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">{company}</h4>
                <span className="text-sm text-gray-400">
                  Total Inspections: {data.total}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-400/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-sm text-green-400">NAI</span>
                    </div>
                    <span className="text-lg font-semibold text-green-400">
                      {data.nai}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-green-400/70">
                    {data.lastYear.nai} in last year
                  </div>
                </div>

                <div className="bg-yellow-400/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-sm text-yellow-400">VAI</span>
                    </div>
                    <span className="text-lg font-semibold text-yellow-400">
                      {data.vai}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-yellow-400/70">
                    {data.lastYear.vai} in last year
                  </div>
                </div>

                <div className="bg-red-400/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-sm text-red-400">OAI</span>
                    </div>
                    <span className="text-lg font-semibold text-red-400">
                      {data.oai}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-red-400/70">
                    {data.lastYear.oai} in last year
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}