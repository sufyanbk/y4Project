import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, Text, SimpleGrid, Spinner, Center } from '@chakra-ui/react';
import Card from '../components/Card'; // Make sure this path is correct
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/stats/all')
      .then(response => {
        setStats(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (!stats) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }



  // Prepare your chart data here...
  // Example for Users by Role Chart Data
  const usersByRoleData = {
    labels: stats.usersByRole.map(role => role.ROLE_DESCRIPTION),
    datasets: [{
      label: 'Users by Role',
      data: stats.usersByRole.map(role => role.USER_COUNT),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  // Example for Active vs Inactive Users Chart Data
  const activeVsInactiveData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      label: 'Active vs Inactive Users',
      data: stats.activeVsInactiveUsers.map(status => status.STATUS_COUNT),
      backgroundColor: ['#4BC0C0', '#FF6384'],
      hoverBackgroundColor: ['#4BC0C0', '#FF6384']
    }]
  };

  // Example for Users by Group Chart Data
  const usersByGroupData = {
    labels: stats.usersByGroup.map(group => group.REPORTING_NAME),
    datasets: [{
      label: 'Users by Group',
      data: stats.usersByGroup.map(group => group.USER_COUNT),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false, // You can set this to false to make charts responsive
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true, // You can set this to false if you don't want to display legends
      },
    },
  };
  

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, xl: 4 }} spacing={4}>
        {/* Card for Total Users */}
        <Card title="Total Users" value={stats.totalUsers} />
        {/* Card for Users by Role */}
        <Card chart={<Bar data={usersByRoleData} options={chartOptions} />} />
        {/* Card for Active vs Inactive Users*/}
        <Card chart={<Pie data={activeVsInactiveData} options={chartOptions} />} />
        {/* Card for Users by Group */}
        <Card chart={<Doughnut data={usersByGroupData} options={chartOptions} />} />
        {/* Add more cards as needed */}
      </SimpleGrid>
    </Box>
  );
};


export default Dashboard;
