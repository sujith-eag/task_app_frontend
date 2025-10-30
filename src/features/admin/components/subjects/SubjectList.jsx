/**
 * Subject List Component
 * 
 * Displays and manages subjects with:
 * - DataGrid with pagination
 * - Delete confirmation with proper UX
 * - Loading states and skeleton loaders
 * - Empty state handling
 * - Edit and delete actions
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Chip } from '@mui/material';
import { toast } from 'react-toastify';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';

// Components
import { EnhancedDataGrid } from '../../../../components/common';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';

// Redux
import { getSubjects, deleteSubject } from '../../adminSlice/adminSubjectSlice.js';

// Hook
import useConfirmDialog from '../../../../hooks/useConfirmDialog';

const SubjectList = ({ onEdit }) => {
    const dispatch = useDispatch();
    const { subjects, isLoading, isError, message } = useSelector((state) => state.adminSubjects);
    const { dialogState, showDialog } = useConfirmDialog();

    // Fetch subjects on mount if not already loaded
    useEffect(() => {
        if (subjects.length === 0) {
            dispatch(getSubjects());
        }
    }, [dispatch, subjects.length]);

    /**
     * Handle delete subject with confirmation
     * Uses professional ConfirmationDialog instead of window.confirm
     */
    const handleDelete = (subject) => {
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
                    toast.success(result.message || 'Subject deleted successfully');
                } catch (err) {
                    toast.error(err || 'Failed to delete subject');
                    throw err; // Keep dialog open on error
                }
            }
        });
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
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(params.row)}
                        aria-label={`Edit ${params.row.name}`}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row)}
                        aria-label={`Delete ${params.row.name}`}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
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
                    onClick={() => dispatch(getSubjects())}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
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