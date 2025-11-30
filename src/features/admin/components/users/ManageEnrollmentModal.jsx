/**
 * Manage Enrollment Modal Component
 * 
 * Manage student subject enrollments with:
 * - Semester-filtered subject list
 * - Checkbox selection for subjects
 * - Form validation with react-hook-form + yup
 * - Loading states
 * - Development logging
 */

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Box, Typography, Button, FormGroup, 
        FormControlLabel, Checkbox, CircularProgress, 
        Paper, Alert, FormHelperText, Chip } from '@mui/material';
import { toast } from 'react-toastify';

import { updateStudentEnrollment } from '../../adminSlice/adminUserSlice.js';

// Validation
import { enrollmentSchema } from '../../validation/schemas.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('ManageEnrollmentModal');

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ManageEnrollmentModal = ({ open, handleClose, student }) => {
    const dispatch = useDispatch();
    const { subjects, isLoading: isSubjectsLoading } = useSelector((state) => state.adminSubjects);
    const { isLoading: isUserLoading } = useSelector((state) => state.adminUsers);
    const isLoading = isSubjectsLoading || isUserLoading;

    // Filter subjects based on student's semester
    const studentSemester = student?.studentDetails?.semester;
    const filteredSubjects = useMemo(() => {
        if (!studentSemester || !subjects.length) return [];
        return subjects.filter(s => s.semester === studentSemester);
    }, [subjects, studentSemester]);

    // Form setup with validation
    const { control, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(enrollmentSchema),
        defaultValues: {
            subjectIds: [],
        }
    });

    const selectedSubjects = watch('subjectIds');

    // Initialize form with student's current enrollments
    useEffect(() => {
        if (open && student) {
            logger.mount({ 
                studentId: student._id, 
                studentName: student.name,
                semester: studentSemester,
                availableSubjects: filteredSubjects.length
            });
            
            reset({
                subjectIds: student.studentDetails?.enrolledSubjects || [],
            });
        }
    }, [student, open, reset, studentSemester, filteredSubjects.length]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            reset({ subjectIds: [] });
        }
    }, [open, reset]);

    /**
     * Handle checkbox change for subjects
     */
    const handleSubjectChange = (subjectId, checked, currentIds) => {
        return checked 
            ? [...currentIds, subjectId] 
            : currentIds.filter(id => id !== subjectId);
    };

    /**
     * Handle form submission
     */
    const onSubmit = async (data) => {
        logger.action('Save enrollment', { 
            studentId: student._id, 
            selectedCount: data.subjectIds.length 
        });
        
        try {
            const result = await dispatch(updateStudentEnrollment({ 
                studentId: student._id, 
                subjectIds: data.subjectIds 
            })).unwrap();
            
            logger.success('Enrollment updated', { studentId: student._id });
            toast.success(result.message || 'Enrollment updated successfully');
            handleClose();
        } catch (err) {
            logger.error('Enrollment update failed', { error: err });
            toast.error(err || 'Failed to update enrollment');
        }
    };
    
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Manage Enrollment for {student?.name}
                </Typography>

                {studentSemester && (
                    <Chip 
                        label={`Semester ${studentSemester}`} 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 2 }}
                    />
                )}

                {!studentSemester ? (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Please assign a semester to this student before managing enrollment.
                    </Alert>
                ) : filteredSubjects.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No subjects found for semester {studentSemester}. Please add subjects first.
                    </Alert>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Select subjects to enroll ({selectedSubjects.length} selected)
                        </Typography>
                        <Paper 
                            variant="outlined" 
                            sx={{ 
                                p: 2, 
                                maxHeight: 300, 
                                overflowY: 'auto',
                                borderColor: errors.subjectIds ? 'error.main' : 'divider'
                            }}
                        >
                            <Controller
                                name="subjectIds"
                                control={control}
                                render={({ field }) => (
                                    <FormGroup>
                                        {filteredSubjects.map(subject => (
                                            <FormControlLabel
                                                key={subject._id}
                                                control={
                                                    <Checkbox
                                                        checked={field.value.includes(subject._id)}
                                                        onChange={(e) => {
                                                            const newValue = handleSubjectChange(
                                                                subject._id, 
                                                                e.target.checked, 
                                                                field.value
                                                            );
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {subject.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {subject.subjectCode}
                                                            {subject.isElective && ' • Elective'}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </FormGroup>
                                )}
                            />
                        </Paper>
                        {errors.subjectIds && (
                            <FormHelperText error>{errors.subjectIds.message}</FormHelperText>
                        )}
                    </>
                )}
                                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading || !studentSemester || !isDirty}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Save Enrollment'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ManageEnrollmentModal;