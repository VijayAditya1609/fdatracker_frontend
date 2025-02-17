import React, { useEffect, useState } from 'react';
import { FileWarning, AlertTriangle, AlertCircle, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { getDashboardStats } from '../../services/dashboard';
import type { DashboardStats } from '../../services/dashboard';

interface KeyMetricsProps {
  dateRange: string;
}

export default function KeyMetrics({ dateRange }: KeyMetricsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats(dateRange);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading metrics...</div>;
  }

  if (error || !stats) {
    return <div className="text-center text-red-400">{error || 'Failed to load metrics'}</div>;
  }

  const metrics = [
    {
      title: 'Total Inspections Done',
      value: stats.totalInspections,
      trend: { value: '', direction: 'up', isPositive: true },
      icon: <AlertCircle className="h-8 w-8 text-blue-400" />
    },
    {
      title: 'Total Form 483s Issued',
      value: stats.total483,
      trend: { value: '+12.5%', direction: 'up', isPositive: false },
      icon: <FileWarning className="h-8 w-8 text-yellow-400" />
    },
    {
      title: 'Form 483s Converted to Warning Letters',
      value: stats.converted483,
      trend: { value: '+33.3%', direction: 'up', isPositive: false },
      icon: <AlertTriangle className="h-8 w-8 text-red-400" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {metrics.map((metric) => (
        <div key={metric.title} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{metric.title}</p>
              <p className="text-2xl font-semibold text-white mt-2">{metric.value}</p>
            </div>
            {metric.icon}
          </div>
          {/* <div className="mt-4 flex items-center text-sm">
            {metric.trend.direction === 'up' ? (
              <TrendingUp className={`h-4 w-4 mr-1 ${metric.trend.isPositive ? 'text-green-400' : 'text-red-400'}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 mr-1 ${metric.trend.isPositive ? 'text-green-400' : 'text-red-400'}`} />
            )}
            <span className={metric.trend.isPositive ? 'text-green-400' : 'text-red-400'}>
              {metric.trend.value}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
          </div> */}
        </div>
      ))}
    </div>
  );
}