/**
 * User Management Component
 * 
 * Comprehensive user management interface with:
 * - Tab-based navigation (Students / General Users)
 * - Server-side pagination and search
 * - DataGrid with enhanced UX
 * - User promotion, editing, and enrollment management
 * - Loading states and empty states
 * - Development logging
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Button, Alert, Chip, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import UpgradeIcon from '@mui/icons-material/Upgrade';

// Components
import { EnhancedDataGrid, SearchInput } from '../../../../components/common';
import ManageEnrollmentModal from './ManageEnrollmentModal.jsx';
import PromoteUserModal from './PromoteUserModal.jsx';
import EditStudentModal from './EditStudentModal.jsx';

// Redux
import { getUsersByRole, setSearchTerm, clearUsers } from '../../adminSlice/adminUserSlice.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('UserManagement');

const UserManagement = () => {
    const dispatch = useDispatch();
    const { 
        userList, 
        usersPagination, 
        searchTerm,
        isLoading, 
        isError, 
        message 
    } = useSelector((state) => state.adminUsers);

    const [activeTab, setActiveTab] = useState('student');
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

    // Local pagination state for DataGrid
    const [paginationModel, setPaginationModel] = useState({
        page: 0, // DataGrid uses 0-indexed pages
        pageSize: 20,
    });

    // `userList` can be an array or a paginated/shape object returned from the API.
    // Normalize to an array safely to avoid "filter is not a function" runtime errors.
    const normalizeUserList = (list) => {
        if (!list) return [];
        if (Array.isArray(list)) return list;
        if (Array.isArray(list.data)) return list.data;
        if (Array.isArray(list.users)) return list.users;
        if (Array.isArray(list.docs)) return list.docs; // mongoose-paginate style
        return [];
    };

    const validUserList = normalizeUserList(userList).filter((user) => user && user._id);

    // Fetch users when tab, pagination, or search changes
    useEffect(() => {
        logger.mount({ activeTab, usersCount: validUserList.length });
        fetchUsers();
    }, [activeTab, paginationModel.page, paginationModel.pageSize, searchTerm]);

    const fetchUsers = useCallback(() => {
        dispatch(getUsersByRole({
            role: activeTab,
            page: paginationModel.page + 1, // API uses 1-indexed pages
            limit: paginationModel.pageSize,
            search: searchTerm,
        }));
    }, [dispatch, activeTab, paginationModel.page, paginationModel.pageSize, searchTerm]);

    /**
     * Handle tab change
     */
    const handleTabChange = (event, newValue) => {
        logger.action('Tab changed', { from: activeTab, to: newValue });
        setActiveTab(newValue);
        // Reset pagination and search when switching tabs
        setPaginationModel({ page: 0, pageSize: 20 });
        dispatch(setSearchTerm(''));
        dispatch(clearUsers());
    };

    /**
     * Handle pagination model change from DataGrid
     */
    const handlePaginationModelChange = useCallback((newModel) => {
        logger.action('Pagination changed', { 
            from: paginationModel, 
            to: newModel 
        });
        setPaginationModel(newModel);
    }, [paginationModel]);

    /**
     * Handle search term change
     */
    const handleSearchChange = useCallback((value) => {
        logger.action('Search changed', { searchTerm: value });
        dispatch(setSearchTerm(value));
        // Reset to first page when searching
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    }, [dispatch]);

    /**
     * Handle refresh
     */
    const handleRefresh = () => {
        logger.action('Refresh clicked', { activeTab });
        fetchUsers();
    };

    // Modal Handlers
    const handleOpenEnrollmentModal = (user) => {
        logger.action('Open enrollment modal', { userId: user._id, userName: user.name });
        setSelectedUser(user);
        setIsEnrollmentModalOpen(true);
    };
    const handleCloseEnrollmentModal = () => {
        logger.info('Close enrollment modal');
        setIsEnrollmentModalOpen(false);
    };

    const handleOpenPromoteModal = (user) => {
        logger.action('Open promote modal', { userId: user._id, userName: user.name });
        setSelectedUser(user);
        setIsPromoteModalOpen(true);
    };
    const handleClosePromoteModal = () => {
        logger.info('Close promote modal');
        setIsPromoteModalOpen(false);
    };

    const handleOpenEditModal = (user) => {
        logger.action('Open edit modal', { userId: user._id, userName: user.name });
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        logger.info('Close edit modal');
        setIsEditModalOpen(false);
    };

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
                <Tooltip title="Promote this user to faculty role">
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleOpenPromoteModal(params.row)}
                        startIcon={<UpgradeIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Promote
                    </Button>
                </Tooltip>
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
                    <Tooltip title="Edit student details">
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => handleOpenEditModal(params.row)}
                            startIcon={<EditIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title="Manage subject enrollment">
                        <Button 
                            variant="outlined" 
                            size="small" 
                            color="secondary" 
                            onClick={() => handleOpenEnrollmentModal(params.row)}
                            startIcon={<BookIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Enroll
                        </Button>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    if (isError) return <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">User Management</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={activeTab === 'student' 
                            ? "Search by name, email, or USN..." 
                            : "Search by name or email..."}
                        isLoading={isLoading}
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRefresh}
                        startIcon={<RefreshIcon />}
                        disabled={isLoading}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Students" value="student" icon={<SchoolIcon />} iconPosition="start" />
                    <Tab label="General Users" value="user" icon={<PersonIcon />} iconPosition="start" />                    
                </Tabs>
            </Box>

            <EnhancedDataGrid
                rows={validUserList}
                columns={activeTab === 'user' ? userColumns : studentColumns}
                getRowId={(row) => row._id}
                isLoading={isLoading}
                height={500}
                // Server-side pagination
                serverPagination
                rowCount={usersPagination.total}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                emptyStateProps={{
                    icon: activeTab === 'student' ? SchoolIcon : PersonIcon,
                    title: searchTerm 
                        ? `No matching ${activeTab === 'student' ? 'students' : 'users'}` 
                        : `No ${activeTab === 'student' ? 'students' : 'users'} found`,
                    description: searchTerm 
                        ? `No results match "${searchTerm}". Try a different search term.`
                        : activeTab === 'student' 
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