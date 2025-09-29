import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { getPendingApplications, reviewApplication } from '../../adminSlice/adminUserSlice.js'


const ApplicationReview = () => {
    const dispatch = useDispatch();
    const { pendingApplications, isLoading, isError, message } = useSelector((state) => state.adminUsers);

    useEffect(() => {
        dispatch(getPendingApplications());
    }, [dispatch]);

    const handleReview = (userId, action) => {
        dispatch(reviewApplication({ userId, action }))
            .unwrap()
            .then((res) => toast.success(res.message))
            .catch((err) => toast.error(err));
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { 
            field: 'usn', headerName: 'USN', flex: 1,
            // valueGetter: (params) => params?.row?.studentDetails?.usn || 'N/A' 
            renderCell: (params) => {
                return params.row.studentDetails?.usn || 'N/A';
            }
        },
        { field: 'batch', headerName: 'Batch', flex: 0.5, 
            // valueGetter: (params) => params?.row?.studentDetails?.batch || 'N/A' 
            renderCell: (params) => {
                return params.row.studentDetails?.batch || 'N/A';
            }
        },
        { field: 'section', headerName: 'Section', flex: 0.5, 
            // valueGetter: (params) => params?.row?.studentDetails?.section || 'N/A'
            renderCell: (params) => {
                return params.row.studentDetails?.section || 'N/A';
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="success" 
                            size="small" sx={{ mr: 1 }} onClick={() => handleReview(params.id, 'approve')}
                        >Approve</Button>
                    <Button variant="contained" color="error" 
                            size="small" onClick={() => handleReview(params.id, 'reject')}
                        >Reject</Button>
                </Box>
            ),
        },
    ];

    if (isLoading && pendingApplications.length === 0) return <CircularProgress />;
    if (isError) return <Alert severity="error">{message}</Alert>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Pending Student Applications</Typography>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={pendingApplications}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={isLoading}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                />
            </Box>
        </Box>
    );
};

export default ApplicationReview;