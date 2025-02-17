import React from 'react';
import RiskScoreGauge from '../visualizations/RiskScoreGauge';

interface RiskAssessmentCardProps {
  score: number;
  confidence?: number;
}

export default function RiskAssessmentCard({ score, confidence = 92 }: RiskAssessmentCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">AI Confidence</span>
          <span className="text-sm text-green-400">{confidence}%</span>
        </div>
      </div>
      <RiskScoreGauge score={score} />
    </div>
  );
}