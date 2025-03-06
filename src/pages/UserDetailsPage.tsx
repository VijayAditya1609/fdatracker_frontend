import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { 
  ArrowLeft, Calendar, Clock, Globe, Building, User, FileText, 
  MapPin, ChevronDown, ChevronUp, LogIn, Mail, Phone, 
  BarChart3, PieChart, Activity, Target, Eye, Search, 
  MousePointer, Timer, Zap, TrendingUp, Star, AlertCircle
} from 'lucide-react';
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
    subsystems: true,
    products: true,
    countries: false,
    investigators: false,
    facilities: false,
    loginAnalytics: true,
    engagementMetrics: true,
    interestAreas: true,
    conversionOpportunities: true
  });
  const [activityTimeRange, setActivityTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
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
  
  // Group activities by session ID
  const sessionGroups = userActivity.reduce((acc, activity) => {
    if (!acc[activity.session_id]) {
      acc[activity.session_id] = [];
    }
    acc[activity.session_id].push(activity);
    return acc;
  }, {} as Record<string, UserActivity[]>);

  // Calculate session metrics
  const calculateSessionMetrics = () => {
    const sessionDurations: number[] = [];
    const pagesPerSession: number[] = [];
    const sessionsWithDates: {date: string, count: number}[] = [];
    const daysOfWeek: number[] = Array(7).fill(0); // 0 = Sunday, 6 = Saturday
    
    Object.entries(sessionGroups).forEach(([sessionId, activities]) => {
      // Sort activities by time
      const sortedActivities = [...activities].sort(
        (a, b) => new Date(a.visit_time).getTime() - new Date(b.visit_time).getTime()
      );
      
      // Calculate session duration in minutes
      if (sortedActivities.length > 1) {
        const firstActivity = new Date(sortedActivities[0].visit_time);
        const lastActivity = new Date(sortedActivities[sortedActivities.length - 1].visit_time);
        const durationMinutes = (lastActivity.getTime() - firstActivity.getTime()) / (1000 * 60);
        
        // Only count reasonable durations (less than 3 hours)
        if (durationMinutes > 0 && durationMinutes < 180) {
          sessionDurations.push(durationMinutes);
        }
      }
      
      // Count pages per session
      const uniquePagesInSession = new Set(activities.map(a => a.page_name)).size;
      pagesPerSession.push(uniquePagesInSession);
      
      // Track session date
      const sessionDate = sortedActivities[0].visit_date;
      const dayOfWeek = new Date(sessionDate).getDay(); // 0-6
      daysOfWeek[dayOfWeek]++;
      
      // Add to sessions by date
      sessionsWithDates.push({
        date: sessionDate,
        count: 1
      });
    });
    
    // Calculate average session duration
    const avgSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length 
      : 0;
    
    // Calculate average pages per session
    const avgPagesPerSession = pagesPerSession.length > 0
      ? pagesPerSession.reduce((sum, count) => sum + count, 0) / pagesPerSession.length
      : 0;
    
    // Find most active day of week
    const mostActiveDayIndex = daysOfWeek.indexOf(Math.max(...daysOfWeek));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostActiveDay = dayNames[mostActiveDayIndex];
    
    // Find longest and shortest sessions
    const longestSession = Math.max(...sessionDurations) || 0;
    const shortestSession = Math.min(...sessionDurations) || 0;
    
    return {
      totalSessions: Object.keys(sessionGroups).length,
      avgSessionDuration,
      avgPagesPerSession,
      longestSession,
      shortestSession,
      mostActiveDay,
      daysOfWeek,
      dayNames
    };
  };
  
  const sessionMetrics = calculateSessionMetrics();
  
  // Calculate login analytics
  const calculateLoginAnalytics = () => {
    // For each session, find the first activity (chronologically) to determine login time
    const sessionFirstActivities = Object.entries(sessionGroups).map(([sessionId, activities]) => {
      // Sort by time ascending to get the first activity
      const sortedActivities = [...activities].sort(
        (a, b) => new Date(a.visit_time).getTime() - new Date(b.visit_time).getTime()
      );
      return sortedActivities[0];
    });
    
    // Count logins by date
    const loginsByDate = sessionFirstActivities.reduce((acc, activity) => {
      const date = activity.visit_date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count logins by hour of day (0-23)
    const loginsByHour = sessionFirstActivities.reduce((acc, activity) => {
      const hour = new Date(activity.visit_time).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Get most active login hour
    let mostActiveHour = 0;
    let maxLogins = 0;
    
    Object.entries(loginsByHour).forEach(([hour, count]) => {
      if (count > maxLogins) {
        maxLogins = count;
        mostActiveHour = parseInt(hour);
      }
    });
    
    // Format the hour for display (12-hour format with AM/PM)
    const formatHour = (hour: number) => {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12} ${ampm}`;
    };
    
    return {
      totalLogins: sessionFirstActivities.length,
      loginsByDate,
      loginsByHour,
      mostActiveHour: formatHour(mostActiveHour),
      mostActiveHourCount: maxLogins
    };
  };
  
  const loginAnalytics = calculateLoginAnalytics();
  
  // Calculate interest metrics
  const calculateInterestMetrics = () => {
    // Calculate page view frequency
    const pageViewCounts = userActivity.reduce((acc, activity) => {
      const page = activity.page_name;
      if (!page || page === '/undefined') return acc;
      
      if (!acc[page]) {
        acc[page] = {
          count: 0,
          lastVisit: new Date(0),
          subsystem: activity.sub_system || 'Unknown',
          productType: activity.product_type || 'Unknown'
        };
      }
      
      acc[page].count += 1;
      const visitTime = new Date(activity.visit_time);
      if (visitTime > acc[page].lastVisit) {
        acc[page].lastVisit = visitTime;
      }
      
      return acc;
    }, {} as Record<string, { count: number, lastVisit: Date, subsystem: string, productType: string }>);
    
    // Sort pages by view count
    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate engagement score (0-100)
    // Based on: session count, pages per session, session duration, and return visits
    const sessionCount = Object.keys(sessionGroups).length;
    const returnVisitScore = Math.min(sessionCount / 10, 1) * 25; // Max 25 points
    
    const pagesPerSessionScore = Math.min(sessionMetrics.avgPagesPerSession / 5, 1) * 25; // Max 25 points
    
    const durationScore = Math.min(sessionMetrics.avgSessionDuration / 15, 1) * 25; // Max 25 points
    
    const recencyScore = (() => {
      if (userActivity.length === 0) return 0;
      const mostRecent = new Date(userActivity[0].visit_time);
      const now = new Date();
      const daysSinceLastVisit = (now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.min(1, 1 - (daysSinceLastVisit / 30))) * 25; // Max 25 points
    })();
    
    const engagementScore = Math.round(returnVisitScore + pagesPerSessionScore + durationScore + recencyScore);
    
    // Determine engagement level
    let engagementLevel = 'Low';
    if (engagementScore >= 75) engagementLevel = 'High';
    else if (engagementScore >= 40) engagementLevel = 'Medium';
    
    // Calculate percentile (just an estimate for demo)
    const percentile = Math.min(100, Math.max(1, Math.round(engagementScore * 1.2)));
    
    return {
      topPages,
      engagementScore,
      engagementLevel,
      percentile,
      returnVisitScore,
      pagesPerSessionScore,
      durationScore,
      recencyScore
    };
  };
  
  const interestMetrics = calculateInterestMetrics();

  // Prepare data for activity chart based on selected time range
  const getActivityChartData = () => {
    if (activityTimeRange === 'daily') {
      // Daily view - last 7 days
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
    } 
    else if (activityTimeRange === 'weekly') {
      // Weekly view - last 12 weeks
      const result: { labels: string[], data: number[] } = { labels: [], data: [] };
      
      // Start from current date and go backwards
      const currentDate = new Date();
      
      // Create array to hold the weeks (most recent first)
      const weeks = [];
      
      // Generate the 12 week ranges (most recent first)
      for (let i = 0; i < 12; i++) {
        // Calculate end date (start from current date and go back i weeks)
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(currentDate.getDate() - (i * 7));
        
        // Calculate start date (6 days before end date)
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);
        
        weeks.push({
          start: new Date(weekStart),
          end: new Date(weekEnd)
        });
      }
      
      // Reverse to show oldest to newest (left to right on chart)
      weeks.reverse();
      
      // Process each week
      for (const week of weeks) {
        // Format dates for display
        const weekLabel = `${week.start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${week.end.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;
        
        // Count activities in this week
        const count = userActivity.filter(a => {
          if (!a.visit_date || a.page_name === '/undefined') return false;
          
          const activityDate = new Date(a.visit_date);
          // Ensure the date is valid
          if (isNaN(activityDate.getTime())) return false;
          
          return activityDate >= week.start && activityDate <= week.end;
        }).length;
        
        result.labels.push(weekLabel);
        result.data.push(count);
      }
      
      return result;
    }
    else { // monthly
      // Monthly view - last 12 months
      const result: { labels: string[], data: number[] } = { labels: [], data: [] };
      
      // Get current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Loop through last 12 months
      for (let i = 11; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        
        // Adjust year if month is negative
        if (month < 0) {
          month += 12;
          year -= 1;
        }
        
        // Create date for first day of month
        const monthStart = new Date(year, month, 1);
        // Create date for last day of month
        const monthEnd = new Date(year, month + 1, 0);
        
        // Count activities in this month
        const count = userActivity.filter(a => {
          const activityDate = new Date(a.visit_date);
          return activityDate >= monthStart && activityDate <= monthEnd && a.page_name !== '/undefined';
        }).length;
        
        // Format as "MMM YYYY"
        const monthLabel = monthStart.toLocaleDateString('default', { month: 'short', year: 'numeric' });
        
        result.labels.push(monthLabel);
        result.data.push(count);
      }
      
      return result;
    }
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
          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 mb-8 overflow-hidden shadow-xl">
            {/* Header with back button and status */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700/50">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute -right-0.5 -top-0.5 animate-pulse"></div>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">
                  Last active: {loading ? '' : new Date(userActivity[0]?.visit_time).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* User Avatar and Basic Info */}
                <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg border-2 border-gray-700">
                    {!loading && userActivity[0]?.user_full_name ? userActivity[0]?.user_full_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-2xl font-semibold text-white text-center md:text-left">
                      {loading ? 'Loading...' : userActivity[0]?.user_full_name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        Active User
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        Premium
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information and Metrics */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-0">
                  {/* Contact Information */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-inner">
                    <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm text-white">{loading ? '' : userActivity[0]?.user_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Company</p>
                          <p className="text-sm text-white">{loading ? '' : userActivity[0]?.company_name || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="text-sm text-white">{loading ? '' : userActivity[0]?.country || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Metrics */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-inner">
                    <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-400" />
                      User Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Activity Level</p>
                        <p className="text-sm font-medium text-green-400">High</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Logins (30d)</p>
                        <p className="text-sm font-medium text-white">{loginAnalytics.totalLogins}</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Avg. Session</p>
                        <p className="text-sm font-medium text-white">{sessionMetrics.avgSessionDuration.toFixed(1)} min</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Pages/Session</p>
                        <p className="text-sm font-medium text-white">{sessionMetrics.avgPagesPerSession.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Best Time to Contact */}
              <div className="mt-6 bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-xl p-4 border border-indigo-800/30 shadow-inner">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                      <Clock className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">Best Time to Contact</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Based on activity patterns, the best time to reach this user is:
                      </p>
                    </div>
                  </div>
                  <div className="bg-indigo-900/40 rounded-lg py-2 px-4 flex items-center gap-3 self-start">
                    <span className="text-lg font-medium text-indigo-300">{loginAnalytics.mostActiveHour}</span>
                    <div className="h-4 w-px bg-indigo-700"></div>
                    <span className="text-sm text-gray-400">Weekdays</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <Phone className="h-4 w-4" />
                  Schedule Call
                </button>
                <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <Target className="h-4 w-4" />
                  Add to Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3 mb-8">
            {/* Login Count */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Login Count</p>
                  <p className="text-2xl font-semibold text-white mt-2">{loginAnalytics.totalLogins}</p>
                </div>
                <LogIn className="h-8 w-8 text-indigo-400" />
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-medium text-white">
                {activityTimeRange === 'daily' && 'Daily Activity (Last 7 Days)'}
                {activityTimeRange === 'weekly' && 'Weekly Activity (Last 12 Weeks)'}
                {activityTimeRange === 'monthly' && 'Monthly Activity (Last 12 Months)'}
              </h3>
              <div className="flex items-center">
                <select
                  value={activityTimeRange}
                  onChange={(e) => setActivityTimeRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-1.5 text-sm font-medium"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
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
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">Loading chart data...</p>
                </div>
              )}
              {!loading && userActivity.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">No activity data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Login Analytics Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('loginAnalytics')}
            >
              <div className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-medium text-white">Login Analytics</h3>
              </div>
              {expandedSections.loginAnalytics ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections.loginAnalytics && (
              <div className="mt-6">
                {/* Most Active Login Time */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Most Active Login Time</h4>
                  <div className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-indigo-400" />
                      <div>
                        <p className="text-lg font-semibold text-white">{loginAnalytics.mostActiveHour}</p>
                        <p className="text-xs text-gray-400">Most common login time</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{loginAnalytics.mostActiveHourCount}</p>
                      <p className="text-xs text-gray-400">logins at this hour</p>
                    </div>
                  </div>
                </div>
                
                {/* Login Patterns by Hour */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Login Patterns by Hour</h4>
                  <div className="space-y-2">
                    {Object.entries(loginAnalytics.loginsByHour)
                      .sort(([hourA], [hourB]) => parseInt(hourA) - parseInt(hourB))
                      .map(([hour, count]) => {
                        const hourFormatted = new Date(2022, 0, 1, parseInt(hour)).toLocaleTimeString([], {
                          hour: 'numeric',
                          hour12: true
                        });
                        const percentage = (count / loginAnalytics.totalLogins) * 100;
                        
                        return (
                          <div key={hour} className="flex items-center">
                            <div className="w-16 text-sm text-gray-400">{hourFormatted}</div>
                            <div className="flex-1 mx-2">
                              <div className="h-2 bg-indigo-500 rounded" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="w-8 text-right text-sm text-gray-400">{count}</div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                
                {/* Login Patterns by Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Login Dates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(loginAnalytics.loginsByDate)
                      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                      .slice(0, 10) // Show only the 10 most recent dates
                      .map(([date, count]) => {
                        const formattedDate = new Date(date).toLocaleDateString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        });
                        
                        return (
                          <div key={date} className="bg-gray-700/30 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-white">{count}</span>
                              <span className="text-xs text-gray-400">login{count !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Engagement Metrics Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('engagementMetrics')}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-medium text-white">Engagement Metrics</h3>
              </div>
              {expandedSections.engagementMetrics ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections.engagementMetrics && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Session Duration */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Timer className="h-5 w-5 text-blue-400" />
                      <h4 className="text-sm font-medium text-white">Session Duration</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Average</span>
                      <span className="text-sm font-medium text-white">
                        {sessionMetrics.avgSessionDuration.toFixed(1)} minutes
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Longest</span>
                      <span className="text-sm font-medium text-white">
                        {sessionMetrics.longestSession.toFixed(1)} minutes
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Shortest</span>
                      <span className="text-sm font-medium text-white">
                        {sessionMetrics.shortestSession.toFixed(1)} minutes
                      </span>
                    </div>
                  </div>
                  
                  {/* Visit Frequency */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <h4 className="text-sm font-medium text-white">Visit Frequency</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Daily Average</span>
                      <span className="text-sm font-medium text-white">{(totalVisits / 30).toFixed(1)} visits</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Weekly Average</span>
                      <span className="text-sm font-medium text-white">{(totalVisits / 4).toFixed(1)} visits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Most Active Day</span>
                      <span className="text-sm font-medium text-white">{sessionMetrics.mostActiveDay}</span>
                    </div>
                  </div>
                  
                  {/* Engagement Score */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <h4 className="text-sm font-medium text-white">Engagement Score</h4>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{interestMetrics.engagementScore}</div>
                      <div className="text-xs text-gray-400 mb-2">{interestMetrics.engagementLevel} Engagement</div>
                      <div className="w-full bg-gray-600 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${interestMetrics.engagementScore}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Top {100 - interestMetrics.percentile}% of users
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Page Interaction Metrics */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Page Interaction Metrics</h4>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold text-white mb-1">{uniquePages}</div>
                        <div className="text-xs text-gray-400 text-center">Unique Pages Viewed</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {sessionMetrics.avgPagesPerSession.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400 text-center">Avg. Pages per Session</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {sessionMetrics.avgSessionDuration > 0 
                            ? `${Math.round(sessionMetrics.avgSessionDuration * 60 / sessionMetrics.avgPagesPerSession)}s` 
                            : '0s'}
                        </div>
                        <div className="text-xs text-gray-400 text-center">Avg. Time per Page</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {Object.entries(sessionGroups).filter(([_, activities]) => activities.length > 5).length}
                        </div>
                        <div className="text-xs text-gray-400 text-center">Sessions with 5+ Pages</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
                    

          {/* Conversion Opportunities Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('conversionOpportunities')}
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-medium text-white">Conversion Opportunities</h3>
              </div>
              {expandedSections.conversionOpportunities ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections.conversionOpportunities && (
              <div className="mt-6">
                {/* Opportunity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* High Interest Areas */}
                  <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <h4 className="text-sm font-medium text-white">High Interest Areas</h4>
                    </div>
                    
                    {/* Top Products */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="font-medium">Top Products:</span> User has shown significant interest in:
                      </p>
                      <ul className="space-y-2">
                        {Object.entries(productTypeStats).slice(0, 3).map(([name, count]) => (
                          <li key={name} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                            <span className="text-sm text-white">{name}</span>
                            <span className="text-xs text-gray-400 ml-auto">{count} views</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Top Subsystems */}
                    <div>
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="font-medium">Top Subsystems:</span> Most frequently accessed:
                      </p>
                      <ul className="space-y-2">
                        {Object.entries(subsystemStats).slice(0, 3).map(([name, count]) => (
                          <li key={name} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                            <span className="text-sm text-white">{name}</span>
                            <span className="text-xs text-gray-400 ml-auto">{count} views</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className="mt-4 w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-medium transition-colors">
                      Send Targeted Information
                    </button>
                  </div>
                  
                  {/* Subscription Upgrade */}
                  <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 rounded-lg p-4 border border-indigo-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-indigo-400" />
                      <h4 className="text-sm font-medium text-white">Subscription Upgrade</h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      User has viewed premium features multiple times but has a basic plan.
                    </p>
                    <div className="bg-indigo-800/50 rounded p-2 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300">Current Plan</span>
                        <span className="text-xs font-medium text-white">Basic</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-300">Recommended</span>
                        <span className="text-xs font-medium text-indigo-300">Premium</span>
                      </div>
                    </div>
                    <button className="mt-1 w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors">
                      Send Upgrade Offer
                    </button>
                  </div>
                  
                </div>
                
                
              </div>
            )}
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
