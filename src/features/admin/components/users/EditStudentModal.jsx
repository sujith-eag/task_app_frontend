/**
 * Edit Student Modal Component
 * 
 * Edit student details with:
 * - Form validation with react-hook-form + yup
 * - Pre-populated form on open
 * - Loading states
 * - Development logging
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Box, Typography, Button, TextField, 
    MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

import { updateStudentDetails } from '../../adminSlice/adminUserSlice.js';

// Validation
import { editStudentSchema } from '../../validation/schemas.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('EditStudentModal');

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

const sections = ['A', 'B', 'C'];

const EditStudentModal = ({ open, handleClose, student }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.adminUsers);

    // Form setup with validation
    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(editStudentSchema),
        defaultValues: {
            usn: '',
            batch: '',
            section: '',
            semester: '',
        }
    });

    // Pre-populate the form when the modal opens with a student's data
    useEffect(() => {
        if (open && student) {
            logger.mount({ studentId: student._id, studentName: student.name });
            reset({
                usn: student.studentDetails?.usn || '',
                batch: student.studentDetails?.batch || '',
                section: student.studentDetails?.section || '',
                semester: student.studentDetails?.semester || '',
            });
        }
    }, [student, open, reset]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            reset({
                usn: '',
                batch: '',
                section: '',
                semester: '',
            });
        }
    }, [open, reset]);

    /**
     * Handle form submission
     */
    const onSubmit = async (data) => {
        logger.action('Save changes', { studentId: student._id, data });
        
        try {
            const result = await dispatch(updateStudentDetails({ 
                studentId: student._id, 
                studentData: data 
            })).unwrap();
            
            logger.success('Student updated', { studentId: student._id });
            toast.success(result.message || 'Student details updated successfully');
            handleClose();
        } catch (err) {
            logger.error('Update failed', { error: err, studentId: student._id });
            toast.error(err || 'Failed to update student details');
        }
    };

    /**
     * Handle cancel with unsaved changes warning
     */
    const handleCancel = () => {
        if (isDirty) {
            logger.info('Cancel with unsaved changes');
        }
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleCancel}>
            <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Details for {student?.name}
                </Typography>
                
                <Controller
                    name="usn"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="University Seat Number (USN)"
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.usn}
                            helperText={errors.usn?.message}
                            placeholder="e.g., 4VP22CS001"
                        />
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
                            helperText={errors.semester?.message || 'Semester must be between 1-4'}
                        />
                    )}
                />
                
                <Controller
                    name="section"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Section"
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.section}
                            helperText={errors.section?.message}
                        >
                            {sections.map((sec) => (
                                <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading || !isDirty}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                    <Button onClick={handleCancel} variant="outlined">
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditStudentModal;