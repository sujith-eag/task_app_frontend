/**
 * Application Review Component
 * 
 * Review and process pending student applications with:
 * - DataGrid with enhanced UX
 * - Approve/Reject actions
 * - Loading states and empty states
 * - Chip-based visual indicators
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Alert, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

// Components
import { EnhancedDataGrid } from '../../../../components/common';

// Redux
import { getPendingApplications, reviewApplication } from '../../adminSlice/adminUserSlice.js';

const ApplicationReview = () => {
    const dispatch = useDispatch();
    const { pendingApplications, isLoading, isError, message } = useSelector((state) => state.adminUsers);

    useEffect(() => {
        if (pendingApplications.length === 0) {
            dispatch(getPendingApplications());
        }
    }, [dispatch, pendingApplications.length]);

    /**
     * Handle application review (approve/reject)
     */
    const handleReview = (userId, action) => {
        dispatch(reviewApplication({ userId, action }))
            .unwrap()
            .then((res) => {
                toast.success(res.message || `Application ${action}d successfully`);
            })
            .catch((err) => {
                toast.error(err || `Failed to ${action} application`);
            });
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
            minWidth: 200,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        onClick={() => handleReview(params.id, 'approve')}
                        sx={{ textTransform: 'none', minWidth: 80 }}
                    >
                        Approve
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        onClick={() => handleReview(params.id, 'reject')}
                        sx={{ textTransform: 'none', minWidth: 80 }}
                    >
                        Reject
                    </Button>
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
                    onClick={() => dispatch(getPendingApplications())}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Pending Student Applications</Typography>
            
            <EnhancedDataGrid
                rows={pendingApplications}
                columns={columns}
                getRowId={(row) => row._id}
                isLoading={isLoading}
                height={500}
                emptyStateProps={{
                    icon: PendingActionsIcon,
                    title: 'No pending applications',
                    description: 'All student applications have been processed. New applications will appear here.',
                }}
            />
        </Box>
    );
};

export default ApplicationReview;