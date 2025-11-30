/**
 * Teacher Assignment Modal Component
 * 
 * Manages teacher subject assignments with:
 * - Cascading semester/subject selection
 * - Multi-section checkbox selection
 * - Current assignments display with delete
 * - Confirmation dialogs for destructive actions
 * - Form validation with react-hook-form + yup
 * - Development logging
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Box, Typography, Button, TextField, MenuItem, 
    CircularProgress, FormGroup, FormControlLabel, Checkbox,
    List, ListItem, ListItemText, IconButton, Divider, FormHelperText,
    Tooltip, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import { updateTeacherAssignments, deleteTeacherAssignment
    } from '../../adminSlice/adminTeacherSlice.js';

import { getSubjects } from '../../adminSlice/adminSubjectSlice.js';

// Components
import ConfirmationDialog from '../../../../components/ConfirmationDialog';

// Hook
import useConfirmDialog from '../../../../hooks/useConfirmDialog';

// Validation
import { teacherAssignmentSchema } from '../../validation/schemas.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('TeacherAssignmentModal');

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const availableSections = ['A', 'B'];

const TeacherAssignmentModal = ({ open, handleClose, teacher }) => {
    const dispatch = useDispatch();
    const { dialogState, showDialog } = useConfirmDialog();

    // Different name for the subjects from the store to avoid confusion
    const { subjects: allSubjects, isLoading: isSubjectsLoading } = useSelector((state) => state.adminSubjects);
    const { isLoading: isTeacherLoading } = useSelector((state) => state.adminTeachers);
    // Combining Both loading into one to handle submit button
    const isLoading = isSubjectsLoading || isTeacherLoading;

    const [filteredSubjects, setFilteredSubjects] = useState([]);

    // Form setup with validation
    const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(teacherAssignmentSchema),
        defaultValues: {
            semester: '',
            subject: '',
            batch: new Date().getFullYear(),
            sections: [],
        }
    });

    const semester = watch('semester');

    useEffect(() => {
        // Re-fetch subjects every time the modal opens to ensure fresh data
        if (open) {
            logger.mount({ teacherId: teacher?._id, teacherName: teacher?.name });
            dispatch(getSubjects());
        }
    }, [open, dispatch, teacher]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            reset({
                semester: '',
                subject: '',
                batch: new Date().getFullYear(),
                sections: [],
            });
            setFilteredSubjects([]);
        }
    }, [open, reset]);
    
    // --- CASCADING LOGIC ---
    // When the semester changes, filter the list of available subjects
    useEffect(() => {
        if (semester) {
            const filtered = allSubjects.filter(s => s.semester === parseInt(semester));
            setFilteredSubjects(filtered);
            setValue('subject', ''); // Reset selected subject when semester changes
            logger.info('Semester changed, filtered subjects', { semester, count: filtered.length });
        } else {
            setFilteredSubjects([]);
        }
    }, [semester, allSubjects, setValue]);

    /**
     * Handle section checkbox change
     */
    const handleSectionChange = (section, checked, currentSections) => {
        const newSections = checked 
            ? [...currentSections, section] 
            : currentSections.filter(s => s !== section);
        return newSections;
    };

    /**
     * Handle form submission - add assignment
     */
    const onSubmit = async (data) => {
        logger.action('Add assignment', { teacherId: teacher._id, data });
        
        const assignmentData = { 
            subject: data.subject, 
            sections: data.sections, 
            batch: data.batch, 
            semester: parseInt(data.semester)
        };
        
        try {
            await dispatch(updateTeacherAssignments({ 
                teacherId: teacher._id, 
                assignmentData 
            })).unwrap();
            
            logger.success('Assignment added', { teacherId: teacher._id });
            toast.success("Assignment added successfully!");
            handleClose();
        } catch (err) {
            logger.error('Add assignment failed', { error: err });
            toast.error(err || 'Failed to add assignment');
        }
    };

    /**
     * Handle delete assignment with confirmation
     */
    const handleDeleteAssignment = (assignment) => {
        const subjectName = assignment.subject?.name || 'this subject';
        const sectionText = assignment.sections?.join(', ') || 'unknown sections';
        
        logger.action('Delete assignment clicked', { 
            assignmentId: assignment._id, 
            subjectName 
        });
        
        showDialog({
            title: 'Remove Assignment',
            message: `Are you sure you want to remove the assignment for "${subjectName}" (Sections: ${sectionText})?`,
            variant: 'delete',
            confirmText: 'Remove Assignment',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    await dispatch(deleteTeacherAssignment({ 
                        teacherId: teacher._id, 
                        assignmentId: assignment._id 
                    })).unwrap();
                    
                    logger.success('Assignment removed', { assignmentId: assignment._id });
                    toast.success("Assignment removed successfully!");
                } catch (err) {
                    logger.error('Delete assignment failed', { error: err });
                    toast.error(err || 'Failed to remove assignment');
                    throw err; // Keep dialog open on error
                }
            }
        });
    };
    
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Manage Assignments for {teacher?.name}
                </Typography>

                {/* --- DISPLAY EXISTING ASSIGNMENTS --- */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    Current Assignments
                </Typography>
                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {teacher?.teacherDetails?.assignments?.length > 0 ? (
                        teacher.teacherDetails.assignments.map(assign => (
                            <ListItem
                                key={assign._id}
                                secondaryAction={
                                    <Tooltip title="Remove this assignment">
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete" 
                                            color="error"
                                            onClick={() => handleDeleteAssignment(assign)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemText 
                                    primary={`${assign.subject?.name || 'Unknown'} (${assign.subject?.subjectCode || 'N/A'})`}
                                    secondary={`Batch: ${assign.batch}, Semester: ${assign.semester}, Sections: ${assign.sections?.join(', ') || 'None'}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Alert severity="info" sx={{ mt: 1 }}>
                            No subjects assigned yet.
                        </Alert>
                    )}
                </List>
                
                <Divider sx={{ my: 2 }} />

                {/* --- FORM TO ADD NEW ASSIGNMENT --- */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Add New Assignment
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Select Semester First */}
                    <Controller
                        name="semester"
                        control={control}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                label="Semester" 
                                type="number"
                                inputProps={{ min: 1, max: 4 }}
                                fullWidth 
                                required 
                                margin="normal"
                                error={!!errors.semester}
                                helperText={errors.semester?.message || 'Enter semester (1-4)'}
                            />
                        )}
                    />

                    {/* Subject Dropdown is dependent on Semester */}
                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                select 
                                label="Select Subject"
                                fullWidth 
                                required 
                                margin="normal"
                                disabled={!semester || filteredSubjects.length === 0}
                                error={!!errors.subject}
                                helperText={errors.subject?.message || (
                                    !semester ? 'Select semester first' : 
                                    filteredSubjects.length === 0 ? 'No subjects for this semester' : ''
                                )}
                            >
                                {filteredSubjects.length > 0 ? (
                                    filteredSubjects.map((s) => (
                                        <MenuItem key={s._id} value={s._id}>
                                            {s.name} ({s.subjectCode})
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        No subjects found for this semester.
                                    </MenuItem>
                                )}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="batch"
                        control={control}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                label="Batch Year" 
                                type="number"
                                inputProps={{ min: 2000, max: 2100 }}
                                fullWidth 
                                required 
                                margin="normal"
                                error={!!errors.batch}
                                helperText={errors.batch?.message}
                            />
                        )}
                    />

                    {/* Sections checkboxes */}
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                        Sections *
                    </Typography>
                    <Controller
                        name="sections"
                        control={control}
                        render={({ field }) => (
                            <>
                                <FormGroup row>
                                    {availableSections.map(sec => (
                                        <FormControlLabel 
                                            key={sec} 
                                            control={
                                                <Checkbox 
                                                    checked={field.value.includes(sec)}
                                                    onChange={(e) => {
                                                        const newValue = handleSectionChange(sec, e.target.checked, field.value);
                                                        field.onChange(newValue);
                                                    }}
                                                    name={sec}
                                                />
                                            } 
                                            label={sec} 
                                        />
                                    ))}
                                </FormGroup>
                                {errors.sections && (
                                    <FormHelperText error>{errors.sections.message}</FormHelperText>
                                )}
                            </>
                        )}
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Add Assignment'}
                        </Button>
                        <Button onClick={handleClose} variant="outlined">
                            Cancel
                        </Button>
                    </Box>
                </form>
                
                {/* Confirmation Dialog */}
                <ConfirmationDialog {...dialogState} />
            </Box>
        </Modal>
    );
};

export default TeacherAssignmentModal;