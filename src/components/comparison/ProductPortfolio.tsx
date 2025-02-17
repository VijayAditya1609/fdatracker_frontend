import React from 'react';
import { Package, Activity, Flask, Syringe } from 'lucide-react';

interface ProductPortfolioProps {
  selectedCompanies: string[];
}

const portfolioData = {
  'Novo Nordisk': {
    totalProducts: 45,
    categories: {
      'Small Molecules': 12,
      'Biologics': 18,
      'Injectables': 10,
      'Other': 5
    },
    therapeuticAreas: ['Diabetes', 'Obesity', 'Hemophilia', 'Growth Disorders'],
    manufacturingCapabilities: ['API', 'Fill & Finish', 'Aseptic Processing'],
    qualityMetrics: {
      batchSuccess: 98.5,
      qualityEvents: 12,
      recalls: 0
    }
  },
  'Eli Lilly': {
    totalProducts: 52,
    categories: {
      'Small Molecules': 20,
      'Biologics': 15,
      'Injectables': 12,
      'Other': 5
    },
    therapeuticAreas: ['Diabetes', 'Oncology', 'Immunology', 'Neurodegeneration'],
    manufacturingCapabilities: ['API', 'Fill & Finish', 'Biologics Manufacturing'],
    qualityMetrics: {
      batchSuccess: 97.8,
      qualityEvents: 15,
      recalls: 1
    }
  },
  'Sanofi': {
    totalProducts: 65,
    categories: {
      'Small Molecules': 25,
      'Biologics': 20,
      'Injectables': 15,
      'Other': 5
    },
    therapeuticAreas: ['Diabetes', 'Cardiovascular', 'Vaccines', 'Rare Diseases'],
    manufacturingCapabilities: ['API', 'Fill & Finish', 'Vaccine Production'],
    qualityMetrics: {
      batchSuccess: 96.5,
      qualityEvents: 18,
      recalls: 2
    }
  },
  'AstraZeneca': {
    totalProducts: 48,
    categories: {
      'Small Molecules': 18,
      'Biologics': 16,
      'Injectables': 10,
      'Other': 4
    },
    therapeuticAreas: ['Oncology', 'Respiratory', 'Cardiovascular', 'Autoimmune'],
    manufacturingCapabilities: ['API', 'Fill & Finish', 'Biologics Manufacturing'],
    qualityMetrics: {
      batchSuccess: 97.2,
      qualityEvents: 14,
      recalls: 1
    }
  }
};

export default function ProductPortfolio({ selectedCompanies }: ProductPortfolioProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Product Portfolio Analysis</h3>

      <div className="grid grid-cols-4 gap-6">
        {selectedCompanies.map((company) => {
          const data = portfolioData[company];
          if (!data) return null;

          return (
            <div key={company} className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">{company}</h4>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-sm text-gray-300">Total Products</span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {data.totalProducts}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(data.categories).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{category}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-white">{count}</span>
                        <div className="ml-2 w-20 h-1.5 bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${(count / data.totalProducts) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">
                      Therapeutic Areas
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {data.therapeuticAreas.map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs
                                   bg-blue-400/10 text-blue-400"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">
                      Quality Metrics
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Batch Success</span>
                        <span className="text-sm text-green-400">
                          {data.qualityMetrics.batchSuccess}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Quality Events</span>
                        <span className="text-sm text-yellow-400">
                          {data.qualityMetrics.qualityEvents}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Recalls</span>
                        <span className="text-sm text-red-400">
                          {data.qualityMetrics.recalls}
                        </span>
                      </div>
                    </div>
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