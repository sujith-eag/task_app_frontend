import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * AttendanceChart - Line chart showing 7-day attendance trend
 */
const AttendanceChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 350 }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  // Format date for display
  const formattedData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  }));

  const isEmpty = data.length === 0;

  return (
    <Paper
      sx={{
        p: 3,
        height: 350,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Attendance Trend (Last 7 Days)
      </Typography>

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
            No attendance data available for this period
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value, name) => {
                  if (name === 'percentage') return [`${value}%`, 'Attendance Rate'];
                  if (name === 'present') return [value, 'Present'];
                  if (name === 'total') return [value, 'Total'];
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="present"
                stroke="#4caf50"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Present"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                stroke="#2196f3"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Total"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#ff9800"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="percentage"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

AttendanceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      present: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

export default AttendanceChart;
