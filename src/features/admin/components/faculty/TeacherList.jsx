import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { getAllTeachers } from '../../adminSlice/adminTeacherSlice.js';

const TeacherList = ({ onAssign }) => { // onAssign is a function to open the modal
    const dispatch = useDispatch();
    const { teachers, isLoading } = useSelector((state) => state.adminTeachers);
    
    useEffect(() => {
        dispatch(getAllTeachers());
    }, [dispatch]);

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { 
            field: 'assignments', 
            headerName: 'Assigned Subjects',
            flex: 1.5,
            renderCell: (params) => {
                const assignments = params.row.teacherDetails?.assignments || [];
                if (!assignments.length) return "0";

                return (
                <span title={assignments.map(a => a.subject?.name).join(", ")}>
                    {assignments.length}
                </span>
                );
            },
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

    if (isLoading && teachers.length === 0) return <CircularProgress />;

    return (
        <Box sx={{ height: 400, width: '100%', mt: 2 }}>
            <DataGrid
                rows={teachers || []}
                columns={columns}
                getRowId={(row) => row._id}
                loading={isLoading}
                slots={{
                    noRowsOverlay: () => <Typography>No teachers found.</Typography>
                }}                
            />
        </Box>
    );
};

export default TeacherList;