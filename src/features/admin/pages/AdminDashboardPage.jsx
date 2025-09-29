import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import ApplicationReview from '../components/applications/ApplicationReview.jsx';
import FacultyManager from '../components/faculty/FacultyManager.jsx';
import SubjectManager from '../components/subjects/SubjectManager.jsx'
import UserManagement from '../components/users/UserManagement.jsx';

import { getPendingApplications, getUsersByRole } from '../adminSlice/adminUserSlice.js';
import { getSubjects } from '../adminSlice/adminSubjectSlice.js';
import { getAllTeachers } from '../adminSlice/adminTeacherSlice.js';

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
    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch all actions to pre-fetch data for all tabs on initial component mount
        dispatch(getPendingApplications());
        dispatch(getSubjects());
        dispatch(getAllTeachers());
        dispatch(getUsersByRole('student'));
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
                    <Tabs value={tabIndex} onChange={handleTabChange}
                        aria-label="admin dashboard tabs"
                        variant="scrollable" scrollButtons="auto"
                        >
                        <Tab icon={<PeopleAltIcon />} iconPosition="start"
                            label="Student Applications" />
                        <Tab icon={<LibraryBooksIcon />} iconPosition="start"
                            label="Subject Management" />
                        <Tab icon={<SchoolIcon />} iconPosition="start"
                            label="Faculty Management" />
                        <Tab icon={<ManageAccountsIcon />} iconPosition="start" label="User Management" />
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
                <TabPanel value={tabIndex} index={3}>
                    <UserManagement />
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default AdminDashboardPage;