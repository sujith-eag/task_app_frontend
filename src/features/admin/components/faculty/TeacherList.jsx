/**
 * Teacher List Component
 * 
 * Displays and manages teachers with:
 * - DataGrid with enhanced UX
 * - Assignment management
 * - Loading states and skeleton loaders
 * - Empty state handling
 * - Development logging
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Chip, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Components
import { EnhancedDataGrid } from '../../../../components/common';

// Redux
import { getAllTeachers } from '../../adminSlice/adminTeacherSlice.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('TeacherList');

const TeacherList = ({ onAssign }) => { 
    const dispatch = useDispatch();
    const { teachers, isLoading } = useSelector((state) => state.adminTeachers);
    
    useEffect(() => {
        logger.mount({ teachersCount: teachers.length });
        if (teachers.length === 0) {
            dispatch(getAllTeachers());
        }
    }, [dispatch, teachers.length]);

    /**
     * Handle manage assignments click
     */
    const handleManageAssignments = (teacher) => {
        logger.action('Manage assignments clicked', { 
            teacherId: teacher._id, 
            teacherName: teacher.name,
            assignmentCount: teacher.teacherDetails?.assignments?.length || 0
        });
        onAssign(teacher);
    };

    /**
     * Handle refresh
     */
    const handleRefresh = () => {
        logger.action('Refresh clicked');
        dispatch(getAllTeachers());
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
            field: 'staffId',
            headerName: 'Staff ID',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => {
                const staffId = params.row.teacherDetails?.staffId;
                return staffId || (
                    <Chip label="N/A" size="small" variant="outlined" color="default" />
                );
            },
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
                <Tooltip title="Manage subject assignments for this teacher">
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleManageAssignments(params.row)}
                        startIcon={<AssignmentIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Manage
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
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