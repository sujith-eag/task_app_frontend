import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

/**
 * StatCard - A card component for displaying dashboard statistics
 * Shows total count with optional trend indicator
 */
const StatCard = ({
  title,
  value,
  trend,
  subtitle,
  icon: Icon,
  color = 'primary',
  loading = false,
}) => {
  // Determine trend icon and color
  const getTrendDisplay = () => {
    if (trend === undefined || trend === null) return null;
    
    if (trend > 0) {
      return {
        icon: <TrendingUpIcon fontSize="small" />,
        color: 'success.main',
        text: `+${trend}%`,
      };
    } else if (trend < 0) {
      return {
        icon: <TrendingDownIcon fontSize="small" />,
        color: 'error.main',
        text: `${trend}%`,
      };
    }
    return {
      icon: <TrendingFlatIcon fontSize="small" />,
      color: 'text.secondary',
      text: '0%',
    };
  };

  const trendDisplay = getTrendDisplay();

  if (loading) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
          <Skeleton variant="text" width="50%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
          {Icon && (
            <Box
              sx={{
                backgroundColor: `${color}.light`,
                color: `${color}.main`,
                borderRadius: 1.5,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon fontSize="small" />
            </Box>
          )}
        </Box>

        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trendDisplay && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trendDisplay.color,
                gap: 0.5,
              }}
            >
              {trendDisplay.icon}
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {trendDisplay.text}
              </Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  trend: PropTypes.number,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  loading: PropTypes.bool,
};

export default StatCard;
