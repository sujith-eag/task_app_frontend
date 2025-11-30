/**
 * PromoteUserModal Component
 * 
 * Modal for promoting users to faculty roles with:
 * - React Hook Form + Yup validation
 * - Inline error messages
 * - Confirmation before action
 * - Development logging
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
  MenuItem,
  CircularProgress,
  Alert,
  Fade,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';

// Validation
import { promoteUserSchema } from '../../validation/schemas.js';

// Redux
import { promoteToFaculty } from '../../adminSlice/adminUserSlice.js';

// Logger
import { createLogger } from '../../../../utils/logger.js';

const logger = createLogger('PromoteUserModal');

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

const PromoteUserModal = ({ open, handleClose, user }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.adminUsers);

  // Form setup with validation
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(promoteUserSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'teacher',
      staffId: '',
      department: '',
    },
  });

  const selectedRole = watch('role');

  // Reset form when modal opens
  useEffect(() => {
    if (open && user) {
      logger.debug('Opening promote modal for user', { userId: user._id, userName: user.name });
      reset({
        role: 'teacher',
        staffId: '',
        department: '',
      });
    }
  }, [open, user, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    logger.form('PromoteUserForm', { userId: user._id, ...data });

    try {
      const result = await dispatch(
        promoteToFaculty({ userId: user._id, facultyData: data })
      ).unwrap();
      
      logger.success('User promoted successfully', { userId: user._id, role: data.role });
      toast.success(result.message || `${user.name} promoted to ${data.role} successfully!`);
      handleClose();
    } catch (err) {
      logger.error('Promotion failed', { error: err, userId: user._id });
      toast.error(err || 'Failed to promote user');
    }
  };

  // Handle validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      logger.validation(errors);
    }
  }, [errors]);

  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="promote-modal-title"
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
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon />
              <Typography id="promote-modal-title" variant="h6" component="h2">
                Promote to Faculty
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              disabled={isLoading}
              size="small"
              sx={{ color: 'inherit' }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Info */}
          <Box sx={{ p: 3, pb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Promoting User
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Chip label={user.email} size="small" variant="outlined" />
            </Box>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: 3 }}
          >
            {/* Role Selection */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Faculty Role"
                  fullWidth
                  margin="normal"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  disabled={isLoading}
                >
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="hod">Head of Department (HOD)</MenuItem>
                </TextField>
              )}
            />

            {/* Staff ID */}
            <Controller
              name="staffId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Staff ID"
                  fullWidth
                  margin="normal"
                  error={!!errors.staffId}
                  helperText={errors.staffId?.message}
                  disabled={isLoading}
                  placeholder="e.g., STAFF-001"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
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

            {/* Warning */}
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                This action will grant <strong>{selectedRole === 'hod' ? 'HOD' : 'Teacher'}</strong> privileges to {user.name}. 
                {user.roles?.includes('student') && (
                  <> Their student details will be cleared.</>
                )}
              </Typography>
            </Alert>

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
                onClick={handleClose}
                disabled={isLoading}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || !isValid}
                startIcon={isLoading ? <CircularProgress size={16} /> : <PersonAddIcon />}
              >
                {isLoading ? 'Promoting...' : `Promote to ${selectedRole === 'hod' ? 'HOD' : 'Teacher'}`}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PromoteUserModal;