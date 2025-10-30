/**
 * Teacher List Component
 * 
 * Displays and manages teachers with:
 * - DataGrid with enhanced UX
 * - Assignment management
 * - Loading states and skeleton loaders
 * - Empty state handling
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Chip, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

// Components
import { EnhancedDataGrid } from '../../../../components/common';

// Redux
import { getAllTeachers } from '../../adminSlice/adminTeacherSlice.js';

const TeacherList = ({ onAssign }) => { 
    const dispatch = useDispatch();
    const { teachers, isLoading } = useSelector((state) => state.adminTeachers);
    
    useEffect(() => {
        if (teachers.length === 0) {
            dispatch(getAllTeachers());
        }
    }, [dispatch, teachers.length]);

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
            field: 'assignments', 
            headerName: 'Assigned Subjects',
            flex: 1.5,
            minWidth: 180,
            renderCell: (params) => {
                const assignments = params.row.teacherDetails?.assignments || [];
                if (!assignments.length) {
                    return (
                        <Chip 
                            label="No assignments" 
                            size="small" 
                            variant="outlined" 
                            color="default"
                        />
                    );
                }

                const subjectNames = assignments
                    .map(a => a.subject?.name || 'Unknown')
                    .join(', ');

                return (
                    <Tooltip title={subjectNames} arrow>
                        <Chip 
                            label={`${assignments.length} subject${assignments.length !== 1 ? 's' : ''}`}
                            size="small" 
                            color="primary"
                            variant="outlined"
                        />
                    </Tooltip>
                );
            },
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
                    onClick={() => onAssign(params.row)}
                    sx={{ textTransform: 'none' }}
                >
                    Manage Assignments
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ mt: 2 }}>
            <EnhancedDataGrid
                rows={teachers || []}
                columns={columns}
                getRowId={(row) => row._id}
                isLoading={isLoading}
                height={500}
                emptyStateProps={{
                    icon: PersonIcon,
                    title: 'No teachers found',
                    description: 'Teachers will appear here once they register and are assigned the faculty role',
                }}
            />
        </Box>
    );
};

export default TeacherList;