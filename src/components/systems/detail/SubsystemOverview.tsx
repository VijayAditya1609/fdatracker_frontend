import React, { useMemo, useState } from 'react';
import { Activity, FileText, AlertTriangle, TrendingUp,ForwardIcon ,LinkIcon,TrendingDown, User, ArrowRight, FileSymlink } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { SystemReport } from '../../../types/system';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      stacked: true,
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    x: {
      stacked: true,
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: 'rgba(255, 255, 255, 0.7)' }
    }
  },
  plugins: {
    legend: {
      labels: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    tooltip: {
      callbacks: {
        footer: (tooltipItems: any) => {
          const total = tooltipItems.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
          return `Total: ${total}`;
        }
      }
    }
  }
};


interface SystemOverviewProps {
  subSystemData: SystemReport['subSystems'][string];
  subSystemName: string;
  dateRange: string;
}

const dateRanges = {
  all: () => true,
  "90days": (date: Date) => date >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  "180days": (date: Date) => date >= new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
  "365days": (date: Date) => date >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
};

const sortByDate = (a: any, b: any) => {
  return new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime();
};

export default function SystemOverview({ subSystemData, subSystemName, dateRange }: SystemOverviewProps) {
  const navigate = useNavigate();

  const handleInvestigatorClick = (investigatorId: string) => {
    navigate(`/investigators/${investigatorId}`);
  };

  const metrics = [
    {
      title: "Total 483s Issued",
      value: subSystemData.total483sIssued,
      icon: <FileText className="h-8 w-8 text-blue-400" />,
      trend: {
        direction: 'up',
        value: '+12.5%'  // You might want to calculate this based on historical data
      }
    },
    {
      title: "483s Converted to WL",
      value: subSystemData.total483sConverted,
      icon: <AlertTriangle className="h-8 w-8 text-yellow-400" />,
      trend: {
        direction: 'up',
        value: '+8.3%'
      }
    },
    {
      title: "Total Observations",
      value: subSystemData.totalObservations,
      icon: <Activity className="h-8 w-8 text-purple-400" />,
      trend: {
        direction: 'up',
        value: '+15.2%'
      }
    },
    {
      title: "Escalation Count",
      value: subSystemData.processTypeEscalationCount,
      icon: <TrendingUp className="h-8 w-8 text-orange-400" />,
      trend: {
        direction: 'down',
        value: '-5.3%'
      }
    }
  ];

  // Sample Data for Charts (you can replace these with your actual data)
  const { areaChartData, barChartData } = useMemo(() => {
    const filteredData = subSystemData.Form483s.filter((form) => {
      if (dateRange === 'all') return true;
      const date = new Date(form.issue_date);
      const daysAgo = parseInt(dateRange);
      return date >= new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    });

    // Group data by year or month based on dateRange
    const groupBy = dateRange === "all" ? "year" : "month";
    
    // Group data for area chart (total 483s)
    const groupedAreaData = filteredData.reduce((acc: Record<string, number>, form) => {
      const date = new Date(form.issue_date);
      const key = groupBy === "year" 
        ? date.getFullYear().toString()
        : date.toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Fixed bar chart data processing
    const groupedBarData = filteredData.reduce((acc: Record<string, { converted: number; notConverted: number }>, form) => {
      const date = new Date(form.issue_date);
      const key = groupBy === "year"
        ? date.getFullYear().toString()
        : date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      // Initialize the period if it doesn't exist
      if (!acc[key]) {
        acc[key] = { converted: 0, notConverted: 0 };
      }

      // Increment the appropriate counter
      if (form.converted_to_wl === "t") {
        acc[key].converted++;
      } else {
        acc[key].notConverted++;
      }

      return acc;
    }, {});

    // Sort the periods chronologically
    const sortedPeriods = Object.keys(groupedBarData).sort((a, b) => {
      if (groupBy === "year") {
        return parseInt(a) - parseInt(b);
      }
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const barChartData = {
      labels: sortedPeriods,
      datasets: [
        {
          label: "483s Converted to WL",
          data: sortedPeriods.map(period => groupedBarData[period].converted),
          backgroundColor: "rgba(255, 165, 0, 0.8)",
          borderColor: "rgba(255, 165, 0, 1)",
          borderWidth: 1
        },
        {
          label: "483s Not Converted to WL",
          data: sortedPeriods.map(period => groupedBarData[period].notConverted),
          backgroundColor: "rgba(54, 162, 235, 0.8)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }
      ]
    };

    return {
      areaChartData: {
        labels: Object.keys(groupedAreaData),
        datasets: [
          {
            label: "Total 483s Issued",
            data: Object.values(groupedAreaData),
            fill: true,
            backgroundColor: "rgba(38, 143, 255, 0.4)",
            borderColor: "rgba(38, 143, 255, 1)",
            tension: 0.4
          }
        ]
      },
      barChartData: barChartData
    };
  }, [subSystemData, dateRange]);

  // Get top 5 recent Form 483s and WLs
  const recentForm483s = useMemo(() => {
    return [...subSystemData.Form483s]
      .filter(form => form.converted_to_wl === 'f')
      .sort(sortByDate)
      .slice(0, 5);
  }, [subSystemData.Form483s]);

  const recentConvertedWLs = useMemo(() => {
    return [...subSystemData.Form483s]
      .filter(form => form.converted_to_wl === 't')
      .sort(sortByDate)
      .slice(0, 5);
  }, [subSystemData.Form483s]);

  return (
    <div className="space-y-10">
      {/* Key Metrics Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric.title} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
                        shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-semibold text-white mt-2">{metric.value}</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  {metric.icon}
                </div>
              </div>
              {/* <div className="mt-4 flex items-center text-sm">
                {metric.trend.direction === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-red-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-400 mr-1" />
                )}
                <span className={metric.trend.direction === 'up' ? 'text-red-400' : 'text-green-400'}>
                  {metric.trend.value}
                </span>
                <span className="text-gray-400 ml-2">vs last year</span>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Area Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg">
            <h3 className="text-base font-medium text-white mb-6">
              Form 483s Issued ({dateRange === 'all' ? 'Yearly' : 'Monthly'})
            </h3>
            <Line data={areaChartData} options={chartOptions} />
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg">
            <h3 className="text-base font-medium text-white mb-6">
             Form 483s Converted to WL ({dateRange === 'all' ? 'Yearly' : 'Monthly'})
            </h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Form 483s */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg 
                        transition-all duration-300 hover:border-gray-600/50 hover:shadow-xl">
          <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Recent Form 483s
            </h3>
            <span className="text-sm text-gray-400">{recentForm483s.length} items</span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="pb-3 text-left text-sm font-medium text-gray-400 px-3">Company</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-400 px-3 hidden sm:table-cell">Issued Date</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-400 px-3">Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {recentForm483s.map((form) => (
                    <tr key={form.id} className="group hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-blue-400 transition-colors">
                            {form.company_affected}
                          </span>
                          <span className="text-sm text-gray-500 sm:hidden">
                            {new Date(form.issue_date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-300 hidden sm:table-cell">
                        {new Date(form.issue_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a 
                          href={`/form-483s/${form.id}`} 
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span className="hidden sm:inline"><FileSymlink className="h-5 w-5" /></span>
                          <span className="sm:hidden">View</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Warning Letters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg 
                        transition-all duration-300 hover:border-gray-600/50 hover:shadow-xl">
          <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Recent Warning Letters
            </h3>
            <span className="text-sm text-gray-400">{recentConvertedWLs.length} items</span>
          </div>
          <div className="p-4 sm:p-5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="pb-3 text-left text-sm font-medium text-gray-400 px-3">Company</th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-400 px-3 hidden sm:table-cell">Issued Date</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-400 px-3">Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {recentConvertedWLs.map((form) => (
                    <tr key={form.id} className="group hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-yellow-400 transition-colors">
                            {form.company_affected}
                          </span>
                          <span className="text-sm text-gray-500 sm:hidden">
                            {new Date(form.issue_date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-300 hidden sm:table-cell">
                        {new Date(form.issue_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a 
                          href={`/warning-letters/${form.wl_analysis}`} 
                          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <span className="hidden sm:inline"><FileSymlink className="h-5 w-5" /></span>
                          <span className="sm:hidden">View</span>
                        </a>  
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Top Investigators - Full Width */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-gray-700/50">
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            Top Investigators
          </h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">Investigator</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">483s</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">Warning Letters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {subSystemData.topInvestigators.map((investigator) => (
                  <tr 
                    key={investigator.investigator_id} 
                    className="hover:bg-gray-700/30 cursor-pointer transition-colors"
                    onClick={() => handleInvestigatorClick(investigator.investigator_id)}
                  >
                    <td className="py-3 text-blue-400 hover:text-blue-300">
                      {investigator.investigator_name}
                    </td>
                    <td className="py-3 text-gray-300">{investigator.count_483}</td>
                    <td className="py-3 text-gray-300">{investigator.count_wl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
