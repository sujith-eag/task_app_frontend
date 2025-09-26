import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';

import ApplicationReview from '../features/admin/components/ApplicationReview.jsx';
import SubjectManager from '../features/admin/components/SubjectManager.jsx';
import FacultyManager from '../features/admin/components/FacultyManager';

import { getPendingApplications, 
            getSubjects,
            getAllTeachers
        } from '../features/admin/adminSlice.js';


const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const AdminDashboardPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const dispatch = useDispatch(); // Get the dispatch function

    useEffect(() => {
        // Dispatch all actions to pre-fetch data for all tabs on initial component mount
        dispatch(getPendingApplications());
        dispatch(getSubjects());
        dispatch(getAllTeachers());
    }, [dispatch]);
    
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Admin Dashboard
            </Typography>
            <Paper elevation={3} sx={{ borderRadius: 2, mt: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="admin dashboard tabs">
                        <Tab icon={<PeopleAltIcon />} iconPosition="start" label="Student Applications" />
                        <Tab icon={<LibraryBooksIcon />} iconPosition="start" label="Subject Management" />
                        <Tab icon={<SchoolIcon />} iconPosition="start" label="Faculty Management" />
                    </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                    <ApplicationReview />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <SubjectManager />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <FacultyManager />
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default AdminDashboardPage;