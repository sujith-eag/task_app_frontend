import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Button, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import ManageEnrollmentModal from './ManageEnrollmentModal.jsx';
import PromoteUserModal from './PromoteUserModal.jsx';
import EditStudentModal from './EditStudentModal.jsx';

import { getUsersByRole } from '../../adminSlice.js';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { userList, isLoading, isError, message } = useSelector((state) => state.admin);

    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'student'
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

    const validUserList = userList ? userList.filter(user => user && user._id) : [];

    // Fetch the correct list of users when the component mounts or the tab changes
    useEffect(() => {
        dispatch(getUsersByRole(activeTab));
    }, [dispatch, activeTab]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // --- Modal Handlers ---
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

    // --- DataGrid Column Definitions ---
    const userColumns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'actions', headerName: 'Actions', flex: 1, sortable: false,
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleOpenPromoteModal(params.row)}>
                    Promote to Faculty
                </Button>
            ),
        },
    ];

    const studentColumns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { field: 'usn', headerName: 'USN', flex: 1, 
            renderCell: (params) => {
            return params.row.studentDetails?.usn || 'N/A';
            }
            // valueGetter: (params) => params?.row?.studentDetails?.usn || 'N/A' 
        },
        { field: 'batch', headerName: 'Batch', flex: 0.5, 
            // valueGetter: (params) => params?.row?.studentDetails?.batch || 'N/A' 
            renderCell: (params) => {
                return params.row.studentDetails?.batch || 'N/A';
            }        
        },
        { field: 'semester', headerName: 'Sem', flex: 0.5, 
            // valueGetter: (params) => params?.row?.studentDetails?.semester || 'N/A' 
            renderCell: (params) => {
                return params.row.studentDetails?.semester || 'N/A';
            }        
        },
        { field: 'section', headerName: 'Section', flex: 0.5, 
            // valueGetter: (params) => params?.row?.studentDetails?.section || 'N/A' 
            renderCell: (params) => {
                return params.row.studentDetails?.section || 'N/A';
            }        
        },
        {
            field: 'actions', headerName: 'Actions', flex: 1.5, sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button variant="outlined" size="small" sx={{ mr: 1 }} 
                            onClick={() => handleOpenEditModal(params.row)}
                    >Edit Details
                    </Button>
                    <Button variant="outlined" size="small" color="secondary" 
                            onClick={() => handleOpenEnrollmentModal(params.row)}
                    >Enrollment
                    </Button>
                </Box>
            ),
        },
    ];

    if (isError) return <Alert severity="error">{message}</Alert>;

    return (
        <Box>
            <Typography variant="h5">User Management</Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="General Users" value="user" />
                    <Tab label="Students" value="student" />
                </Tabs>
            </Box>

            <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                <DataGrid
                    rows={validUserList}
                    columns={activeTab === 'user' ? userColumns : studentColumns}
                    getRowId={(row) => row._id}
                    loading={isLoading}
                    pageSizeOptions={[5, 10, 20]}
                />
            </Box>

            {/* Render modals conditionally. */}
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