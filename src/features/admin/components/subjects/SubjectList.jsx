/**
 * Subject List Component
 * 
 * Displays and manages subjects with:
 * - DataGrid with pagination
 * - Delete confirmation with proper UX
 * - Loading states and skeleton loaders
 * - Empty state handling
 * - Edit and delete actions
 * - Development logging
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Chip, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import RefreshIcon from '@mui/icons-material/Refresh';

// Components
import { EnhancedDataGrid } from '../../../../components/common';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';

// Redux
import { getSubjects, deleteSubject } from '../../adminSlice/adminSubjectSlice.js';

// Hook
import useConfirmDialog from '../../../../hooks/useConfirmDialog';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('SubjectList');

const SubjectList = ({ onEdit }) => {
    const dispatch = useDispatch();
    const { subjects, isLoading, isError, message } = useSelector((state) => state.adminSubjects);
    const { dialogState, showDialog } = useConfirmDialog();

    // Fetch subjects on mount if not already loaded
    useEffect(() => {
        logger.mount({ subjectsCount: subjects.length });
        if (subjects.length === 0) {
            dispatch(getSubjects());
        }
    }, [dispatch, subjects.length]);

    /**
     * Handle delete subject with confirmation
     * Uses professional ConfirmationDialog instead of window.confirm
     */
    const handleDelete = (subject) => {
        logger.action('Delete clicked', { subjectId: subject._id, subjectName: subject.name });
        
        showDialog({
            title: 'Delete Subject',
            message: `Are you sure you want to delete "${subject.name}" (${subject.subjectCode})?`,
            variant: 'delete',
            confirmText: 'Delete Subject',
            cancelText: 'Cancel',
            requireConfirmation: false,
            onConfirm: async () => {
                try {
                    const result = await dispatch(deleteSubject(subject._id)).unwrap();
                    logger.success('Subject deleted', { subjectId: subject._id });
                    toast.success(result.message || 'Subject deleted successfully');
                } catch (err) {
                    logger.error('Delete failed', { error: err, subjectId: subject._id });
                    toast.error(err || 'Failed to delete subject');
                    throw err; // Keep dialog open on error
                }
            }
        });
    };

    /**
     * Handle edit subject
     */
    const handleEdit = (subject) => {
        logger.action('Edit clicked', { subjectId: subject._id, subjectName: subject.name });
        onEdit(subject);
    };

    /**
     * Handle refresh
     */
    const handleRefresh = () => {
        logger.action('Refresh clicked');
        dispatch(getSubjects());
    };

    // DataGrid columns configuration
    const columns = [
        { 
            field: 'name', 
            headerName: 'Subject Name', 
            flex: 1.5,
            minWidth: 200,
        },
        { 
            field: 'subjectCode', 
            headerName: 'Code', 
            flex: 1,
            minWidth: 100,
        },
        { 
            field: 'semester', 
            headerName: 'Semester', 
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => (
                <Chip 
                    label={`Sem ${params.value}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                />
            ),
        },
        { 
            field: 'department', 
            headerName: 'Department', 
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit subject">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(params.row)}
                            aria-label={`Edit ${params.row.name}`}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete subject">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(params.row)}
                            aria-label={`Delete ${params.row.name}`}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    // Show error alert if fetch failed
    if (isError && subjects.length === 0) {
        return (
            <Box sx={{ mt: 2, p: 3, textAlign: 'center' }}>
                <Box sx={{ color: 'error.main', mb: 2 }}>
                    {message || 'Failed to load subjects'}
                </Box>
                <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                >
                    Retry
                </Button>
            </Box>
        );
    }

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
                rows={subjects}
                columns={columns}
                getRowId={(row) => row._id}
                isLoading={isLoading}
                height={500}
                emptyStateProps={{
                    icon: SchoolIcon,
                    title: 'No subjects found',
                    description: 'Get started by adding your first subject to the system',
                    actionLabel: 'Add Subject',
                    onAction: () => {
                        // This will be handled by parent component
                        // which should open the add subject modal
                    }
                }}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog {...dialogState} />
        </Box>
    );
};

export default SubjectList;