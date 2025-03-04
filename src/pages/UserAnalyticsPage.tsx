import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Users, UserCheck, UserX, ChevronLeft, ChevronRight, Clock, Search, ChevronUp, ChevronDown } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

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

interface User {
  id: number;
  email: string;
  name: string;
  company_name: string | null;
  designation: string | null;
  department: string | null;
  is_verified: boolean;
  created_at: string;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof User | null;
  direction: SortDirection;
}

export default function UserAnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const navigate = useNavigate();
  useDocumentTitle('User Analytics');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://app.fdatracker.ai:3000/vw_fda_tracker_non_leucine_users');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const verifiedUsers = users.filter(user => user.is_verified).length;
  const unverifiedUsers = users.filter(user => !user.is_verified).length;
  const averageUsersPerMonth = Math.round(totalUsers / Math.max(1, Math.ceil((Date.now() - new Date(Math.min(...users.map(u => new Date(u.created_at).getTime()))).getTime()) / (30 * 24 * 60 * 60 * 1000))));

  // Sort function
  const sortData = (data: User[], key: keyof User | null, direction: SortDirection) => {
    if (!key) return data;

    return [...data].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      
      if (key === 'created_at') {
        return direction === 'asc' 
          ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
          : new Date(b[key]).getTime() - new Date(a[key]).getTime();
      }
      
      return direction === 'asc'
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    });
  };

  // Handle sort
  const handleSort = (key: keyof User) => {
    const direction: SortDirection = 
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Filter and search users
  const filterUsers = useCallback(() => {
    let result = [...users];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => 
        statusFilter === 'verified' ? user.is_verified : !user.is_verified
      );
    }

    // Apply search
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter(user => {
        const searchableFields = [
          user.name,
          user.email,
          user.company_name,
          user.designation,
          user.department
        ].filter(Boolean); // Remove null values

        return searchableFields.some(field => 
          field?.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result = sortData(result, sortConfig.key, sortConfig.direction);
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, debouncedSearchQuery, statusFilter, sortConfig]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Function to get pagination range
  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];

    // Add first page
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Add last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where needed
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // Function to get monthly user data
  const getMonthlyUserData = useCallback(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    const monthlyData = last6Months.map(date => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        count: users.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= monthStart && userDate <= monthEnd;
        }).length
      };
    });

    return {
      labels: monthlyData.map(d => d.month),
      data: monthlyData.map(d => d.count)
    };
  }, [users]);

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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-white">User Analytics</h1>
              <p className="mt-2 text-sm text-gray-400">
                Overview of user statistics and detailed information.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-semibold text-white mt-2">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            {/* Verified Users Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Verified Users</p>
                  <p className="text-2xl font-semibold text-white mt-2">{verifiedUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </div>

            {/* Unverified Users Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Unverified Users</p>
                  <p className="text-2xl font-semibold text-white mt-2">{unverifiedUsers}</p>
                </div>
                <UserX className="h-8 w-8 text-red-400" />
              </div>
            </div>

            {/* Average Users per Month Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg. Users/Month</p>
                  <p className="text-2xl font-semibold text-white mt-2">{averageUsersPerMonth}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Monthly Users Chart */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg">
            <h3 className="text-base font-medium text-white mb-6">Monthly User Growth</h3>
            <div className="h-[336px]">
              {!loading && users.length > 0 && (
                <Line
                  options={chartOptions}
                  data={{
                    labels: getMonthlyUserData().labels,
                    datasets: [
                      {
                        fill: true,
                        data: getMonthlyUserData().data,
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
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">Loading chart data...</p>
                </div>
              )}
              {!loading && users.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">No data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                          placeholder-gray-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'verified' | 'unverified')}
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2 min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">User Details</h2>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[15%]"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[20%]">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[15%]">Company</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[12%]">Designation</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[12%]">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[13%]">Status</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white w-[13%]"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created At
                        {sortConfig.key === 'created_at' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="text-sm font-medium text-white truncate cursor-pointer hover:text-blue-400"
                            onClick={() => navigate(`/user/${user.id}`)}
                          >
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400 truncate">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400 truncate">{user.company_name || '-'}</div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400 truncate">{user.designation || '-'}</div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400 truncate">{user.department || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.is_verified 
                              ? 'bg-green-400/10 text-green-400' 
                              : 'bg-red-400/10 text-red-400'
                          }`}>
                            {user.is_verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && filteredUsers.length > 0 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium text-white">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium text-white">{filteredUsers.length}</span> entries
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-1">
                    {getPaginationRange(currentPage, totalPages).map((number, index) => (
                      number === '...' ? (
                        <span key={index} className="px-3 py-1 text-gray-400">...</span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => handlePageChange(number as number)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            currentPage === number
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          {number}
                        </button>
                      )
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
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