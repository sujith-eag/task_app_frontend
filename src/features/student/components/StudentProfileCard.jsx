
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, Typography, Box, Chip, Avatar, List,
    ListItem, ListItemText, CircularProgress, Divider } from '@mui/material';
import { getStudentProfile } from '../studentSlice.js';
import AccountCircle from '@mui/icons-material/AccountCircle';

const StudentProfileCard = () => {
    const dispatch = useDispatch();
    const { profile, isLoading } = useSelector((state) => state.student);
    const { user } = useSelector((state) => state.auth); // For basic details

    useEffect(() => {
        if (!profile) { // Fetch only if profile data isn't already in the store
            dispatch(getStudentProfile());
        }
    }, [dispatch, profile]);

    if (isLoading && !profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) return null;
  
  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 1.5, sm: 2 },
        background: (theme) => 
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        border: '2px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* --- Header Section --- */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Avatar
            src={  user.avatar || <AccountCircle /> }
            alt={user.name}
            sx={{
              width: { xs: 80, sm: 96 },
              height: { xs: 80, sm: 96 },
              mb: 2,
              boxShadow: (theme) => theme.palette.mode === 'dark'
                ? '0 4px 16px rgba(33, 150, 243, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px rgba(25, 118, 210, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '3px solid',
              borderColor: 'primary.main',
            }}
          />
          <Typography variant="h5" fontWeight={700} sx={{ 
            mb: 0.5,
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
            Student Profile
          </Typography>
        </Box>

        {/* --- Academic Info Chips --- */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
            mb: 3,
          }}
        >
          <Chip
            label={`USN: ${user.studentDetails.usn}`}
            color="primary"
            variant="filled"
            sx={{
              fontWeight: 600,
              boxShadow: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
          <Chip 
            label={`Semester: ${user.studentDetails.semester}`} 
            color="secondary"
            sx={{
              fontWeight: 600,
              boxShadow: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
          <Chip 
            label={`Section: ${user.studentDetails.section}`} 
            color="success"
            sx={{
              fontWeight: 600,
              boxShadow: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
          <Chip 
            label={`Batch: ${user.studentDetails.batch}`} 
            color="warning"
            sx={{
              fontWeight: 600,
              boxShadow: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: 'divider' }} />

        {/* --- Subjects Section --- */}
        <Box>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
            Enrolled Subjects
          </Typography>

          {profile.enrolledSubjects?.length ? (
            <List dense sx={{ borderRadius: 2 }}>
              {profile.enrolledSubjects.map((subject, idx) => (
                <ListItem
                  key={subject._id}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    px: 2,
                    py: 1,
                    background: (theme) => idx % 2 === 0 
                      ? (theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.03)' 
                          : '#f9fafb')
                      : (theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.02)' 
                          : '#ffffff'),
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(33, 150, 243, 0.15)'
                        : '#eef2ff',
                      borderColor: 'primary.main',
                      transform: 'translateX(4px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={600} fontSize={{ xs: '0.9rem', sm: '1rem' }}>
                        {subject.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                        Code: {subject.subjectCode}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" variant="body2">
              No enrolled subjects found.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;