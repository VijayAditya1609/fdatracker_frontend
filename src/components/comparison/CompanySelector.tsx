import React from 'react';
import { Search, X } from 'lucide-react';
import { CompanyOption } from '../../types/companyComparison';

interface CompanySelectorProps {
  companies: CompanyOption[];
  selectedCompanies: CompanyOption[];
  onSelectCompany: (company: CompanyOption) => void;
  onRemoveCompany: (companyId: string) => void;
  isLoading: boolean;
}

export default function CompanySelector({
  companies,
  selectedCompanies,
  onSelectCompany,
  onRemoveCompany,
  isLoading
}: CompanySelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCompanies = companies.filter(
    company => 
      company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedCompanies.some(selected => selected.id === company.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedCompanies.map((company) => (
          <div
            key={company.id}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
          >
            <span className="text-sm text-white">{company.company_name}</span>
            <button
              onClick={() => onRemoveCompany(company.id)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {selectedCompanies.length < 4 && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Add company to compare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                {isLoading ? (
                  <div className="p-4 text-gray-400">Loading companies...</div>
                ) : filteredCompanies.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => {
                          onSelectCompany(company);
                          setSearchQuery('');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                      >
                        {company.company_name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-gray-400">No companies found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}