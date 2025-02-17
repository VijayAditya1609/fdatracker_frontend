import { SystemData, SubSystemData, TopSubSystem } from '../types/system';

export const calculateRiskScore = (data: SystemData): string => {
  const totalCount = Object.values(data.subSystems).reduce((sum, sub) => sum + sub.totalCount, 0);
  const baseScore = (totalCount / 1000) * 10;
  return Math.min(Math.max(baseScore, 1), 10).toFixed(1);
};

export const calculateTrend = (data: SystemData): 'up' | 'down' => {
  const form483Total = Object.values(data.subSystems)
    .reduce((sum, sub) => sum + sub.form483Count, 0);
  const wlTotal = Object.values(data.subSystems)
    .reduce((sum, sub) => sum + sub.warningLetterCount, 0);
  return form483Total > wlTotal ? 'up' : 'down';
};

export const calculateTrendValue = (data: SystemData): string => {
  const form483Total = Object.values(data.subSystems)
    .reduce((sum, sub) => sum + sub.form483Count, 0);
  const wlTotal = Object.values(data.subSystems)
    .reduce((sum, sub) => sum + sub.warningLetterCount, 0);
  const ratio = ((form483Total / wlTotal) - 1) * 100;
  return `${Math.abs(ratio).toFixed(1)}%`;
};

export const getTopSubSystems = (subSystems: { [key: string]: SubSystemData }): TopSubSystem[] => {
  return Object.entries(subSystems)
    .map(([name, data]) => ({
      name,
      count: data.totalCount
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};

export const getRiskColor = (score: number): string => {
  if (score >= 8) return 'text-red-400';
  if (score >= 6) return 'text-yellow-400';
  return 'text-green-400';
};

export const getRiskBgColor = (score: number): string => {
  if (score >= 8) return 'bg-red-400/10';
  if (score >= 6) return 'bg-yellow-400/10';
  return 'bg-green-400/10';
};