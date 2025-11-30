/**
 * Admin Form Validation Schemas
 * 
 * Yup validation schemas for all admin forms.
 * Used with react-hook-form via @hookform/resolvers/yup
 * 
 * @example
 * import { useForm } from 'react-hook-form';
 * import { yupResolver } from '@hookform/resolvers/yup';
 * import { subjectSchema } from '@/features/admin/validation/schemas';
 * 
 * const { register, handleSubmit, formState: { errors } } = useForm({
 *   resolver: yupResolver(subjectSchema)
 * });
 */

import * as yup from 'yup';

// ============================================================================
// Subject Schemas
// ============================================================================

export const subjectSchema = yup.object().shape({
  name: yup
    .string()
    .required('Subject name is required')
    .min(3, 'Subject name must be at least 3 characters')
    .max(100, 'Subject name must not exceed 100 characters')
    .trim(),
  
  subjectCode: yup
    .string()
    .required('Subject code is required')
    .matches(
      /^[A-Z0-9-]+$/i,
      'Subject code can only contain letters, numbers, and hyphens'
    )
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code must not exceed 20 characters')
    .uppercase()
    .trim(),
  
  semester: yup
    .number()
    .required('Semester is required')
    .min(1, 'Semester must be between 1 and 8')
    .max(8, 'Semester must be between 1 and 8')
    .integer('Semester must be a whole number')
    .typeError('Semester must be a number'),
  
  department: yup
    .string()
    .required('Department is required')
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must not exceed 100 characters')
    .trim(),
});

// ============================================================================
// User Management Schemas
// ============================================================================

export const promoteUserSchema = yup.object().shape({
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['teacher', 'hod'], 'Role must be either Teacher or HOD'),
  
  staffId: yup
    .string()
    .required('Staff ID is required')
    .matches(
      /^[A-Z0-9-]+$/i,
      'Staff ID can only contain letters, numbers, and hyphens'
    )
    .min(3, 'Staff ID must be at least 3 characters')
    .max(20, 'Staff ID must not exceed 20 characters')
    .uppercase()
    .trim(),
  
  department: yup
    .string()
    .required('Department is required')
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must not exceed 100 characters')
    .trim(),
});

export const editStudentSchema = yup.object().shape({
  usn: yup
    .string()
    .required('USN is required')
    .matches(
      /^[A-Z0-9]+$/i,
      'USN can only contain letters and numbers'
    )
    .min(5, 'USN must be at least 5 characters')
    .max(20, 'USN must not exceed 20 characters')
    .uppercase()
    .trim(),
  
  semester: yup
    .number()
    .required('Semester is required')
    .min(1, 'Semester must be between 1 and 8')
    .max(8, 'Semester must be between 1 and 8')
    .integer('Semester must be a whole number')
    .typeError('Semester must be a number'),
  
  section: yup
    .string()
    .required('Section is required')
    .oneOf(['A', 'B'], 'Section must be A or B'),
  
  batch: yup
    .number()
    .required('Batch year is required')
    .min(2020, 'Batch year must be 2020 or later')
    .max(2030, 'Batch year must not exceed 2030')
    .integer('Batch must be a whole number')
    .typeError('Batch must be a number'),
});

// ============================================================================
// Faculty Assignment Schemas
// ============================================================================

export const teacherAssignmentSchema = yup.object().shape({
  teacherId: yup
    .string()
    .required('Teacher is required'),
  
  subjectId: yup
    .string()
    .required('Subject is required'),
  
  semester: yup
    .number()
    .required('Semester is required')
    .min(1, 'Semester must be between 1 and 8')
    .max(8, 'Semester must be between 1 and 8')
    .integer()
    .typeError('Semester must be a number'),
  
  sections: yup
    .array()
    .of(yup.string().oneOf(['A', 'B']))
    .min(1, 'At least one section is required')
    .required('Sections are required'),
  
  batch: yup
    .number()
    .required('Batch is required')
    .min(2020, 'Batch year must be 2020 or later')
    .max(2030, 'Batch year must not exceed 2030')
    .integer()
    .typeError('Batch must be a number'),
});

// ============================================================================
// Enrollment Schema
// ============================================================================

export const enrollmentSchema = yup.object().shape({
  enrolledSubjects: yup
    .array()
    .of(yup.string())
    .default([]),
});

// ============================================================================
// Search/Filter Schemas
// ============================================================================

export const searchSchema = yup.object().shape({
  query: yup
    .string()
    .max(100, 'Search query too long')
    .trim(),
  
  semester: yup
    .number()
    .nullable()
    .min(1)
    .max(8)
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    ),
  
  section: yup
    .string()
    .nullable()
    .oneOf(['A', 'B', null, '']),
  
  batch: yup
    .number()
    .nullable()
    .min(2020)
    .max(2030)
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    ),
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get field error message from react-hook-form errors object
 * @param {Object} errors - Errors object from formState
 * @param {string} fieldName - Name of the field
 * @returns {string|undefined} Error message or undefined
 */
export const getFieldError = (errors, fieldName) => {
  const parts = fieldName.split('.');
  let error = errors;
  
  for (const part of parts) {
    if (!error) return undefined;
    error = error[part];
  }
  
  return error?.message;
};

/**
 * Check if a field has an error
 * @param {Object} errors - Errors object from formState
 * @param {string} fieldName - Name of the field
 * @returns {boolean}
 */
export const hasFieldError = (errors, fieldName) => {
  return !!getFieldError(errors, fieldName);
};

export default {
  subjectSchema,
  promoteUserSchema,
  editStudentSchema,
  teacherAssignmentSchema,
  enrollmentSchema,
  searchSchema,
  getFieldError,
  hasFieldError,
};
