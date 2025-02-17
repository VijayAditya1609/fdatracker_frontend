import React from 'react';
import { getRiskColor } from '../../utils/systemCalculations';

interface RiskScoreGaugeProps {
  score: number;
}

const RiskScoreGauge = ({ score }: RiskScoreGaugeProps) => {
  const percentage = (score / 10) * 100;
  const rotation = (percentage * 1.8) - 90; // Convert percentage to degrees (-90 to center at 0)
  const riskColor = getRiskColor(score).replace('text-', 'bg-');

  return (
    <div className="relative w-48 h-48">
      {/* Gauge Background */}
      <div className="absolute inset-0 rounded-full border-8 border-gray-700" />
      
      {/* Gauge Fill */}
      <div 
        className="absolute inset-0 rounded-full border-8 border-transparent"
        style={{
          clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)',
          borderTopColor: riskColor.replace('bg-', ''),
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 1s ease-out'
        }}
      />
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getRiskColor(score)}`}>
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-gray-400 mt-1">Risk Score</span>
      </div>
      
      {/* Scale Markers */}
      <div className="absolute inset-0">
        {[0, 2.5, 5, 7.5, 10].map((mark, i) => (
          <div
            key={mark}
            className="absolute w-1 h-4 bg-gray-600"
            style={{
              left: '50%',
              top: '10%',
              transform: `rotate(${(i * 45) - 90}deg)`,
              transformOrigin: '50% 150px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RiskScoreGauge;