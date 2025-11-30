import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Box, Skeleton, Rating, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Color palette for rating bars
const RATING_COLORS = {
  '1 Star': '#f44336',
  '2 Stars': '#ff9800',
  '3 Stars': '#ffc107',
  '4 Stars': '#8bc34a',
  '5 Stars': '#4caf50',
};

/**
 * FeedbackChart - Bar chart showing feedback rating distribution
 */
const FeedbackChart = ({ data = { summary: {}, breakdown: [] }, loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: 350 }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={280} />
      </Paper>
    );
  }

  const { summary = {}, breakdown = [] } = data;
  const { totalFeedback = 0, averageRatings = {} } = summary;

  // Calculate overall average rating
  const ratingValues = Object.values(averageRatings).filter(v => typeof v === 'number' && !isNaN(v));
  const overallRating = ratingValues.length > 0
    ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    : 0;

  const isEmpty = breakdown.length === 0 || breakdown.every(b => b.count === 0);

  return (
    <Paper
      sx={{
        p: 3,
        height: 350,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Feedback Distribution
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating
            value={overallRating}
            precision={0.1}
            readOnly
            size="small"
          />
          <Chip
            label={`${totalFeedback} reviews`}
            size="small"
            variant="outlined"
          />
        </Box>
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
            No feedback data available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={breakdown}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="rating"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value) => [`${value} reviews`, 'Count']}
              />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                maxBarSize={35}
              >
                {breakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RATING_COLORS[entry.rating] || '#9e9e9e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Average ratings breakdown */}
      {Object.keys(averageRatings).length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {Object.entries(averageRatings).map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${typeof value === 'number' ? value.toFixed(1) : '-'}`}
              size="small"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

FeedbackChart.propTypes = {
  data: PropTypes.shape({
    summary: PropTypes.shape({
      totalFeedback: PropTypes.number,
      averageRatings: PropTypes.object,
    }),
    breakdown: PropTypes.arrayOf(
      PropTypes.shape({
        rating: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      })
    ),
  }),
  loading: PropTypes.bool,
};

export default FeedbackChart;
