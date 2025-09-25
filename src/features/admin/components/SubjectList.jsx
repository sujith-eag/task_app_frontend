import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Alert, Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getSubjects } from '../adminSlice.js';

const SubjectList = ({ onEdit }) => {
    const dispatch = useDispatch();
    const { subjects, isLoading, isError, message } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getSubjects());
    }, [dispatch]);

    const handleDelete = (subjectId) => {
        if(window.confirm('Are you sure you want to delete this subject?')) {
            dispatch(deleteSubject(subjectId))
                .unwrap()
                .then(res => toast.success(res.message))
                .catch(err => toast.error(err));
        }
    };
    
    const columns = [
        { field: 'name', headerName: 'Subject Name', flex: 1.5 },
        { field: 'subjectCode', headerName: 'Code', flex: 1 },
        { field: 'semester', headerName: 'Semester', flex: 0.5 },
        { field: 'department', headerName: 'Department', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button size="small" sx={{ mr: 1 }} onClick={() => onEdit(params.row)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(params.id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    if (isLoading && subjects.length === 0) return <CircularProgress />;
    if (isError) return <Alert severity="error">{message}</Alert>;

    return (
        <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
            <DataGrid
                rows={subjects}
                columns={columns}
                getRowId={(row) => row._id}
                loading={isLoading}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 20]}
            />
        </Paper>
    );
};

export default SubjectList;