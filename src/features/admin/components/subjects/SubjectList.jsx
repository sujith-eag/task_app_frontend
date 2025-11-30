/**
 * Subject List Component
 * 
 * Displays and manages subjects with:
 * - Server-side pagination and search
 * - DataGrid with enhanced UX
 * - Delete confirmation with proper UX
 * - Loading states and skeleton loaders
 * - Empty state handling
 * - Edit and delete actions
 * - Development logging
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Chip, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import RefreshIcon from '@mui/icons-material/Refresh';

// Components
import { EnhancedDataGrid, SearchInput } from '../../../../components/common';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';

// Redux
import { 
    getSubjects, 
    deleteSubject, 
    setSubjectSearchTerm, 
    setSubjectFilters,
    clearSubjects 
} from '../../adminSlice/adminSubjectSlice.js';

// Hook
import useConfirmDialog from '../../../../hooks/useConfirmDialog';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('SubjectList');

const SubjectList = ({ onEdit }) => {
    const dispatch = useDispatch();
    const { 
        subjects, 
        pagination, 
        searchTerm, 
        filterSemester,
        filterDepartment,
        isLoading, 
        isError, 
        message 
    } = useSelector((state) => state.adminSubjects);
    const { dialogState, showDialog } = useConfirmDialog();

    // Local pagination state for DataGrid
    const [paginationModel, setPaginationModel] = useState({
        page: 0, // DataGrid uses 0-indexed pages
        pageSize: 20,
    });

    // Fetch subjects on mount and when pagination/search/filters change
    useEffect(() => {
        logger.mount({ subjectsCount: subjects.length });
        fetchSubjects();
    }, [paginationModel.page, paginationModel.pageSize, searchTerm, filterSemester, filterDepartment]);

    const fetchSubjects = useCallback(() => {
        const params = {
            page: paginationModel.page + 1, // API uses 1-indexed pages
            limit: paginationModel.pageSize,
            search: searchTerm,
        };
        if (filterSemester) params.semester = filterSemester;
        if (filterDepartment) params.department = filterDepartment;
        
        dispatch(getSubjects(params));
    }, [dispatch, paginationModel.page, paginationModel.pageSize, searchTerm, filterSemester, filterDepartment]);

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
        dispatch(setSubjectSearchTerm(value));
        // Reset to first page when searching
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    }, [dispatch]);

    /**
     * Handle semester filter change
     */
    const handleSemesterChange = useCallback((event) => {
        const value = event.target.value;
        logger.action('Semester filter changed', { semester: value });
        dispatch(setSubjectFilters({ semester: value || null }));
        // Reset to first page when filtering
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    }, [dispatch]);

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
                    // Refresh list after delete
                    fetchSubjects();
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
        fetchSubjects();
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by name or code..."
                        isLoading={isLoading}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="semester-filter-label">Semester</InputLabel>
                        <Select
                            labelId="semester-filter-label"
                            value={filterSemester || ''}
                            label="Semester"
                            onChange={handleSemesterChange}
                        >
                            <MenuItem value="">All</MenuItem>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
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
                // Server-side pagination
                serverPagination
                rowCount={pagination.total}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                emptyStateProps={{
                    icon: SchoolIcon,
                    title: (searchTerm || filterSemester) ? 'No matching subjects' : 'No subjects found',
                    description: (searchTerm || filterSemester)
                        ? 'No subjects match your search criteria. Try different filters.'
                        : 'Get started by adding your first subject to the system',
                    actionLabel: (!searchTerm && !filterSemester) ? 'Add Subject' : undefined,
                    onAction: (!searchTerm && !filterSemester) ? () => {
                        // This will be handled by parent component
                        // which should open the add subject modal
                    } : undefined
                }}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog {...dialogState} />
        </Box>
    );
};

export default SubjectList;