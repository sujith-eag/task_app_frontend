import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Color palette for semesters
const SEMESTER_COLORS = [
  '#2196f3', // Blue
  '#4caf50', // Green
  '#ff9800', // Orange
  '#9c27b0', // Purple
  '#00bcd4', // Cyan
  '#f44336', // Red
  '#795548', // Brown
  '#607d8b', // Blue Grey
];

/**
 * SemesterDistributionChart - Pie chart showing student distribution by semester
 */
const SemesterDistributionChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 300 }}>
        <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
      </Paper>
    );
  }

  // Format data for the chart
  const chartData = data.map((item, index) => ({
    name: `Semester ${item.semester}`,
    value: item.count,
    semester: item.semester,
    color: SEMESTER_COLORS[index % SEMESTER_COLORS.length],
  }));

  const totalStudents = chartData.reduce((sum, item) => sum + item.value, 0);
  const isEmpty = chartData.length === 0;

  // Custom label renderer
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Students by Semester
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {totalStudents.toLocaleString()}
        </Typography>
      </Box>

      {isEmpty ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography color="text.secondary">
            No student data available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value, name) => [`${value} students`, name]}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                formatter={(value) => (
                  <span style={{ fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

SemesterDistributionChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      semester: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

export default SemesterDistributionChart;
