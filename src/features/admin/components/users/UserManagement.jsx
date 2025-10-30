/**
 * User Management Component
 * 
 * Comprehensive user management interface with:
 * - Tab-based navigation (Students / General Users)
 * - DataGrid with enhanced UX
 * - User promotion, editing, and enrollment management
 * - Loading states and empty states
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Button, Alert, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

// Components
import { EnhancedDataGrid } from '../../../../components/common';
import ManageEnrollmentModal from './ManageEnrollmentModal.jsx';
import PromoteUserModal from './PromoteUserModal.jsx';
import EditStudentModal from './EditStudentModal.jsx';

// Redux
import { getUsersByRole } from '../../adminSlice/adminUserSlice.js';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { userList, isLoading, isError, message } = useSelector((state) => state.adminUsers);

    const [activeTab, setActiveTab] = useState('student');
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

    const validUserList = userList ? userList.filter(user => user && user._id) : [];

    // Fetch users when tab changes
    useEffect(() => {
        dispatch(getUsersByRole(activeTab));
    }, [dispatch, activeTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Modal Handlers
    const handleOpenEnrollmentModal = (user) => {
        setSelectedUser(user);
        setIsEnrollmentModalOpen(true);
    };
    const handleCloseEnrollmentModal = () => setIsEnrollmentModalOpen(false);

    const handleOpenPromoteModal = (user) => {
        setSelectedUser(user);
        setIsPromoteModalOpen(true);
    };
    const handleClosePromoteModal = () => setIsPromoteModalOpen(false);

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => setIsEditModalOpen(false);

    // DataGrid Column Definitions
    const userColumns = [
        { 
            field: 'name', 
            headerName: 'Name', 
            flex: 1,
            minWidth: 150,
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            flex: 1.5,
            minWidth: 200,
        },
        {
            field: 'actions', 
            headerName: 'Actions', 
            flex: 1,
            minWidth: 180,
            sortable: false,
            renderCell: (params) => (
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleOpenPromoteModal(params.row)}
                    sx={{ textTransform: 'none' }}
                >
                    Promote to Faculty
                </Button>
            ),
        },
    ];

    const studentColumns = [
        { 
            field: 'name', 
            headerName: 'Name', 
            flex: 1,
            minWidth: 150,
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            flex: 1.5,
            minWidth: 200,
        },
        { 
            field: 'usn', 
            headerName: 'USN', 
            flex: 1,
            minWidth: 120,
            renderCell: (params) => params.row.studentDetails?.usn || 'N/A',
        },
        { 
            field: 'batch', 
            headerName: 'Batch', 
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => {
                const batch = params.row.studentDetails?.batch;
                return batch ? (
                    <Chip label={batch} size="small" variant="outlined" />
                ) : 'N/A';
            }
        },
        { 
            field: 'semester', 
            headerName: 'Sem', 
            flex: 0.5,
            minWidth: 70,
            renderCell: (params) => {
                const sem = params.row.studentDetails?.semester;
                return sem ? (
                    <Chip label={`Sem ${sem}`} size="small" color="primary" variant="outlined" />
                ) : 'N/A';
            }
        },
        { 
            field: 'section', 
            headerName: 'Section', 
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => {
                const section = params.row.studentDetails?.section;
                return section ? (
                    <Chip label={section} size="small" variant="outlined" />
                ) : 'N/A';
            }
        },
        {
            field: 'actions', 
            headerName: 'Actions', 
            flex: 1.5,
            minWidth: 220,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleOpenEditModal(params.row)}
                        sx={{ textTransform: 'none' }}
                    >
                        Edit Details
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        color="secondary" 
                        onClick={() => handleOpenEnrollmentModal(params.row)}
                        sx={{ textTransform: 'none' }}
                    >
                        Enrollment
                    </Button>
                </Box>
            ),
        },
    ];

    if (isError) return <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>User Management</Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Students" value="student" />
                    <Tab label="General Users" value="user" />                    
                </Tabs>
            </Box>

            <EnhancedDataGrid
                rows={validUserList}
                columns={activeTab === 'user' ? userColumns : studentColumns}
                getRowId={(row) => row._id}
                isLoading={isLoading}
                height={500}
                emptyStateProps={{
                    icon: activeTab === 'student' ? SchoolIcon : PersonIcon,
                    title: activeTab === 'student' ? 'No students found' : 'No users found',
                    description: activeTab === 'student' 
                        ? 'Students will appear here once they register and are approved'
                        : 'General users will appear here after registration',
                }}
            />

            {/* Modals */}
            {isPromoteModalOpen && (
                <PromoteUserModal 
                    open={isPromoteModalOpen}
                    handleClose={handleClosePromoteModal}
                    user={selectedUser}
                />
            )}
            {isEditModalOpen && (
                <EditStudentModal
                    open={isEditModalOpen}
                    handleClose={handleCloseEditModal}
                    student={selectedUser}
                />
            )}
            {isEnrollmentModalOpen && (
                <ManageEnrollmentModal
                    open={isEnrollmentModalOpen}
                    handleClose={handleCloseEnrollmentModal}
                    student={selectedUser}
                />
            )}
        </Box>
    );
};

export default UserManagement;