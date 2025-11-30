/**
 * Application Review Component
 * 
 * Review and process pending student applications with:
 * - Server-side pagination and search
 * - DataGrid with enhanced UX
 * - Confirmation dialogs for approve/reject
 * - Loading states and empty states
 * - Chip-based visual indicators
 * - Development logging
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Alert, Chip, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';

// Components
import { EnhancedDataGrid, SearchInput } from '../../../../components/common';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';

// Hooks
import useConfirmDialog from '../../../../hooks/useConfirmDialog';

// Redux
import { getPendingApplications, reviewApplication, setSearchTerm } from '../../adminSlice/adminUserSlice.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('ApplicationReview');

const ApplicationReview = () => {
    const dispatch = useDispatch();
    const { 
        pendingApplications, 
        applicationsPagination, 
        searchTerm,
        isLoading, 
        isError, 
        message 
    } = useSelector((state) => state.adminUsers);
    const { dialogState, showDialog } = useConfirmDialog();

    // Local pagination state for DataGrid
    const [paginationModel, setPaginationModel] = useState({
        page: 0, // DataGrid uses 0-indexed pages
        pageSize: 20,
    });

    // Fetch applications on mount and when pagination/search changes
    useEffect(() => {
        logger.mount({ applicationsCount: pendingApplications.length });
        fetchApplications();
    }, [paginationModel.page, paginationModel.pageSize, searchTerm]);

    const fetchApplications = useCallback(() => {
        dispatch(getPendingApplications({
            page: paginationModel.page + 1, // API uses 1-indexed pages
            limit: paginationModel.pageSize,
            search: searchTerm,
        }));
    }, [dispatch, paginationModel.page, paginationModel.pageSize, searchTerm]);

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
     * Handle application approval with confirmation
     */
    const handleApprove = (user) => {
        logger.action('Approve clicked', { userId: user._id, userName: user.name });
        
        showDialog({
            title: 'Approve Application',
            message: `Are you sure you want to approve ${user.name}'s application?`,
            variant: 'success',
            confirmText: 'Approve',
            onConfirm: async () => {
                try {
                    const result = await dispatch(
                        reviewApplication({ userId: user._id, action: 'approve' })
                    ).unwrap();
                    
                    logger.success('Application approved', { userId: user._id });
                    toast.success(result.message || 'Application approved successfully');
                    // Refresh list after action
                    fetchApplications();
                } catch (err) {
                    logger.error('Approval failed', { error: err, userId: user._id });
                    toast.error(err || 'Failed to approve application');
                    throw err; // Keep dialog open on error
                }
            },
        });
    };

    /**
     * Handle application rejection with confirmation
     */
    const handleReject = (user) => {
        logger.action('Reject clicked', { userId: user._id, userName: user.name });
        
        showDialog({
            title: 'Reject Application',
            message: `Are you sure you want to reject ${user.name}'s application?`,
            variant: 'delete',
            confirmText: 'Reject Application',
            requireConfirmation: false,
            onConfirm: async () => {
                try {
                    const result = await dispatch(
                        reviewApplication({ userId: user._id, action: 'reject' })
                    ).unwrap();
                    
                    logger.success('Application rejected', { userId: user._id });
                    toast.success(result.message || 'Application rejected');
                    // Refresh list after action
                    fetchApplications();
                } catch (err) {
                    logger.error('Rejection failed', { error: err, userId: user._id });
                    toast.error(err || 'Failed to reject application');
                    throw err;
                }
            },
        });
    };

    /**
     * Handle refresh
     */
    const handleRefresh = () => {
        logger.action('Refresh clicked');
        fetchApplications();
    };

    const columns = [
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
                    <Tooltip title="Approve this application">
                        <Button 
                            variant="contained" 
                            color="success" 
                            size="small" 
                            onClick={() => handleApprove(params.row)}
                            startIcon={<CheckCircleIcon />}
                            sx={{ textTransform: 'none', minWidth: 100 }}
                        >
                            Approve
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reject this application">
                        <Button 
                            variant="outlined" 
                            color="error" 
                            size="small" 
                            onClick={() => handleReject(params.row)}
                            startIcon={<CancelIcon />}
                            sx={{ textTransform: 'none', minWidth: 90 }}
                        >
                            Reject
                        </Button>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    if (isError && pendingApplications.length === 0) {
        return (
            <Box>
                <Typography variant="h5" gutterBottom>Pending Student Applications</Typography>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {message || 'Failed to load applications'}
                </Alert>
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Pending Student Applications</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by name, email, or USN..."
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
            
            <EnhancedDataGrid
                rows={pendingApplications}
                columns={columns}
                getRowId={(row) => row._id}
                isLoading={isLoading}
                height={500}
                // Server-side pagination
                serverPagination
                rowCount={applicationsPagination.total}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                emptyStateProps={{
                    icon: PendingActionsIcon,
                    title: searchTerm ? 'No matching applications' : 'No pending applications',
                    description: searchTerm 
                        ? `No applications match "${searchTerm}". Try a different search term.`
                        : 'All student applications have been processed. New applications will appear here.',
                }}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog {...dialogState} />
        </Box>
    );
};

export default ApplicationReview;