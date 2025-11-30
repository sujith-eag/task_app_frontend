/**
 * SubjectModal Component
 * 
 * Modal for creating and editing subjects with:
 * - React Hook Form + Yup validation
 * - Inline error messages
 * - Loading states
 * - Development logging
 * 
 * @example
 * <SubjectModal
 *   open={isOpen}
 *   handleClose={() => setIsOpen(false)}
 *   subject={selectedSubject} // null for create, object for edit
 * />
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Fade,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

// Validation
import { subjectSchema } from '../../validation/schemas.js';

// Redux
import { createSubject, updateSubject } from '../../adminSlice/adminSubjectSlice.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('SubjectModal');

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 500 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  overflow: 'hidden',
};

const SubjectModal = ({ open, handleClose, subject }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.adminSubjects);
  const isEditMode = Boolean(subject);

  // Form setup with validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(subjectSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      name: '',
      subjectCode: '',
      semester: '',
      department: '',
    },
  });

  // Reset form when modal opens/closes or subject changes
  useEffect(() => {
    if (open) {
      if (subject) {
        logger.debug('Opening in edit mode', { subjectId: subject._id });
        reset({
          name: subject.name || '',
          subjectCode: subject.subjectCode || '',
          semester: subject.semester || '',
          department: subject.department || '',
        });
      } else {
        logger.debug('Opening in create mode');
        reset({
          name: '',
          subjectCode: '',
          semester: '',
          department: '',
        });
      }
    }
  }, [open, subject, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    logger.form('SubjectForm', { mode: isEditMode ? 'edit' : 'create', data });

    try {
      if (isEditMode) {
        await dispatch(
          updateSubject({ id: subject._id, ...data })
        ).unwrap();
        logger.success('Subject updated', { id: subject._id });
        toast.success('Subject updated successfully!');
      } else {
        await dispatch(createSubject(data)).unwrap();
        logger.success('Subject created', { subjectCode: data.subjectCode });
        toast.success('Subject created successfully!');
      }
      handleClose();
    } catch (err) {
      logger.error('Form submission failed', { error: err });
      toast.error(err || `Failed to ${isEditMode ? 'update' : 'create'} subject`);
    }
  };

  // Handle validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      logger.validation(errors);
    }
  }, [errors]);

  // Handle close with unsaved changes warning
  const handleModalClose = () => {
    if (isDirty && !isLoading) {
      // Could show a confirmation dialog here
      logger.debug('Closing modal with unsaved changes');
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      closeAfterTransition
      aria-labelledby="subject-modal-title"
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography id="subject-modal-title" variant="h6" component="h2">
              {isEditMode ? 'Edit Subject' : 'Create New Subject'}
            </Typography>
            <IconButton
              onClick={handleModalClose}
              disabled={isLoading}
              size="small"
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: 3 }}
          >
            {/* Subject Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  placeholder="e.g., Data Structures and Algorithms"
                  autoFocus
                />
              )}
            />

            {/* Subject Code */}
            <Controller
              name="subjectCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject Code"
                  fullWidth
                  margin="normal"
                  error={!!errors.subjectCode}
                  helperText={errors.subjectCode?.message}
                  disabled={isLoading || isEditMode} // Don't allow editing code
                  placeholder="e.g., CS201"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              )}
            />

            {/* Semester */}
            <Controller
              name="semester"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Semester"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.semester}
                  helperText={errors.semester?.message || 'Enter semester (1-8)'}
                  disabled={isLoading}
                  inputProps={{ min: 1, max: 8 }}
                />
              )}
            />

            {/* Department */}
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Department"
                  fullWidth
                  margin="normal"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  disabled={isLoading}
                  placeholder="e.g., Computer Science"
                />
              )}
            />

            {/* Edit mode warning */}
            {isEditMode && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Changing semester will remove all existing teacher assignments and
                student enrollments for this subject.
              </Alert>
            )}

            {/* Actions */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                onClick={handleModalClose}
                disabled={isLoading}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !isDirty}
                startIcon={isLoading && <CircularProgress size={16} />}
              >
                {isLoading
                  ? 'Saving...'
                  : isEditMode
                  ? 'Save Changes'
                  : 'Create Subject'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SubjectModal;