import React from 'react';
import Card from '../components/Card'; // Your existing Card component

const StatisticCard = ({ title, value }) => {
  return (
    <Card>
      <div className="statistic-card">
        <h3>{title}</h3>
        <p>{value}</p>
        {/* You can add more details or a chart here */}
      </div>
    </Card>
  );
};

export default StatisticCard;
