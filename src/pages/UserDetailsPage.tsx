import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { ArrowLeft, Calendar, Clock, Globe, Building, User, FileText, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface UserActivity {
  visit_date: string;
  visit_time: string;
  page_name: string;
  url: string;
  session_id: string;
  sub_system: string;
  year: string;
  product_type: string;
  country: string;
  company_name: string;
  investigator_name: string;
  feinumber: string;
  facility_name: string;
  user_email: string;
  user_full_name: string;
}

export default function UserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    subsystems: false,
    products: false,
    countries: false,
    investigators: false,
    facilities: false
  });
  
  useDocumentTitle(`User Details - ${userActivity[0]?.user_full_name || 'Loading...'}`);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await fetch('https://app.fdatracker.ai:3000/vw_all_user_activity', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user activity');
        }

        const allData = await response.json();
        // Filter data for specific user and ensure it's an array
        const userSpecificData = Array.isArray(allData) 
          ? allData.filter(item => item.user_id === parseInt(userId || '0'))
          // Sort by visit_time in descending order
          .sort((a, b) => new Date(b.visit_time).getTime() - new Date(a.visit_time).getTime())
          : [];
        
        setUserActivity(userSpecificData);
      } catch (error) {
        console.error('Error fetching user activity:', error);
        setUserActivity([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserActivity();
    }
  }, [userId]);

  // Calculate statistics - add null checks
  const totalVisits = userActivity?.length || 0;
  const uniquePages = new Set(userActivity?.map(a => a.page_name).filter(page => page !== '/undefined') || []).size;
  const uniqueSessions = new Set(userActivity?.map(a => a.session_id) || []).size;
  const uniqueCountries = new Set((userActivity?.map(a => a.country) || []).filter(Boolean)).size;

  // Prepare data for activity chart - add null checks
  const getActivityChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyVisits = last7Days.map(date => ({
      date,
      count: (userActivity || [])
        .filter(a => a.visit_date === date && a.page_name !== '/undefined')
        .length
    }));

    return {
      labels: dailyVisits.map(d => new Date(d.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })),
      data: dailyVisits.map(d => d.count)
    };
  };

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        borderColor: 'rgb(55, 65, 81)',
        borderWidth: 1,
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(156, 163, 175)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          precision: 0
        }
      }
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userActivity.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userActivity.length / itemsPerPage);

  // Helper function to count occurrences
  const getCountsByField = (field: keyof UserActivity) => {
    const counts = userActivity
      .filter(item => item[field]) // Filter out null/undefined values
      .reduce((acc, item) => {
        const value = item[field] as string;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Sort by count in descending order
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, number>);
  };

  // Calculate statistics for each category
  const subsystemStats = getCountsByField('sub_system');
  const productTypeStats = getCountsByField('product_type');
  const countryStats = getCountsByField('country');
  const investigatorStats = getCountsByField('investigator_name');
  const facilityStats = getCountsByField('facility_name');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Component for rendering statistics section
  const StatsSection = ({ 
    title, 
    stats, 
    section, 
    icon: Icon 
  }: { 
    title: string; 
    stats: Record<string, number>; 
    section: string; 
    icon: any 
  }) => {
    const hasData = Object.keys(stats).length > 0;
    
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
        <div 
          className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/50"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-white">{title}</h3>
            <span className="text-sm text-gray-400">({Object.keys(stats).length})</span>
          </div>
          {expandedSections[section] ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        {expandedSections[section] && (
          <div className="px-6 py-4 border-t border-gray-700">
            {hasData ? (
              <div className="space-y-3">
                {Object.entries(stats).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-blue-500 rounded" style={{ 
                        width: `${(count / Math.max(...Object.values(stats))) * 100}px`
                      }} />
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No data available</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">
                {loading ? 'Loading...' : userActivity[0]?.user_full_name}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {loading ? '' : userActivity[0]?.user_email}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Visits */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Visits</p>
                  <p className="text-2xl font-semibold text-white mt-2">{totalVisits}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            {/* Unique Pages */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Unique Pages</p>
                  <p className="text-2xl font-semibold text-white mt-2">{uniquePages}</p>
                </div>
                <FileText className="h-8 w-8 text-green-400" />
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-semibold text-white mt-2">{uniqueSessions}</p>
                </div>
                <User className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            {/* Countries */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Countries Viewed</p>
                  <p className="text-2xl font-semibold text-white mt-2">{uniqueCountries}</p>
                </div>
                <Globe className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg mb-8">
            <h3 className="text-base font-medium text-white mb-6">Daily Activity (Last 7 Days)</h3>
            <div className="h-[336px]">
              {!loading && userActivity.length > 0 && (
                <Line
                  options={chartOptions}
                  data={{
                    labels: getActivityChartData().labels,
                    datasets: [
                      {
                        fill: true,
                        data: getActivityChartData().data,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                      }
                    ]
                  }}
                />
              )}
            </div>
          </div>

          {/* Category Statistics Sections */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-6">Activity Breakdown</h2>
            
            <StatsSection 
              title="Subsystems" 
              stats={subsystemStats} 
              section="subsystems" 
              icon={Building}
            />
            
            <StatsSection 
              title="Product Types" 
              stats={productTypeStats} 
              section="products" 
              icon={FileText}
            />
            
            <StatsSection 
              title="Countries" 
              stats={countryStats} 
              section="countries" 
              icon={Globe}
            />
            
            <StatsSection 
              title="Investigators" 
              stats={investigatorStats} 
              section="investigators" 
              icon={User}
            />
            
            <StatsSection 
              title="Facilities" 
              stats={facilityStats} 
              section="facilities" 
              icon={Building}
            />
          </div>

          {/* Activity Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Activity History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Page Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Sub System
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentItems.map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {new Date(activity.visit_time).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(activity.visit_time).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{activity.page_name}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {activity.url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{activity.sub_system || '-'}</div>
                        <div className="text-sm text-gray-400">{activity.year || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {activity.company_name || activity.facility_name || '-'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {activity.country || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && userActivity.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, userActivity.length)} of {userActivity.length} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 