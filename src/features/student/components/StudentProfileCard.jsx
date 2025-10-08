
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
        borderRadius: 3,
        p: 2,
        background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
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
              width: 96,
              height: 96,
              mb: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          />
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
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
          />
          <Chip label={`Semester: ${user.studentDetails.semester}`} color="secondary" />
          <Chip label={`Section: ${user.studentDetails.section}`} color="success" />
          <Chip label={`Batch: ${user.studentDetails.batch}`} color="warning" />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* --- Subjects Section --- */}
        <Box>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Enrolled Subjects
          </Typography>

          {profile.enrolledSubjects?.length ? (
            <List dense sx={{ borderRadius: 2 }}>
              {profile.enrolledSubjects.map((subject, idx) => (
                <ListItem
                  key={subject._id}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: 2,
                    py: 1,
                    bgcolor: idx % 2 === 0 ? '#f9fafb' : '#ffffff',
                    '&:hover': {
                      bgcolor: '#eef2ff',
                      transition: '0.2s ease',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight="500">{subject.name}</Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
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