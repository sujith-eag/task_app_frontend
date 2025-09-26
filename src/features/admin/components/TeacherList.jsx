// Create this new file: features/admin/components/TeacherList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllTeachers } from '../adminSlice';

const TeacherList = ({ onAssign }) => { // onAssign is a function to open the modal
    const dispatch = useDispatch();
    const { teachers, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getAllTeachers());
    }, [dispatch]);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { 
            field: 'assignments', 
            headerName: 'Assigned Subjects', 
            flex: 1,
            valueGetter: (params) => params?.row?.teacherDetails?.assignments?.length || 0
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => onAssign(params.row)}>
                    Manage Assignments
                </Button>
            ),
        },
    ];

    if (isLoading && !teachers.length == 0) return <CircularProgress />;

    return (
        <Box sx={{ height: 400, width: '100%', mt: 2 }}>
            <DataGrid
                rows={teachers || []}
                columns={columns}
                getRowId={(row) => row._id}
                loading={isLoading}
            />
        </Box>
    );
};

export default TeacherList;