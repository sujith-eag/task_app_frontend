/**
 * Debounced Search Input Component
 * 
 * A reusable search input with:
 * - Debounced onChange to reduce API calls
 * - Clear button
 * - Loading indicator
 * - Consistent styling
 * 
 * Used for server-side search functionality in data grids.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Debounced search input for server-side filtering
 * 
 * @param {string} value - Current search value (controlled)
 * @param {Function} onChange - Callback when search value changes (debounced)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 300)
 * @param {string} placeholder - Input placeholder text
 * @param {boolean} isLoading - Shows loading spinner when true
 * @param {Object} sx - Additional MUI sx props
 * 
 * @example
 * ```jsx
 * const [searchTerm, setSearchTerm] = useState('');
 * 
 * <SearchInput
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search users..."
 *   isLoading={isLoading}
 * />
 * ```
 */
const SearchInput = ({
  value = '',
  onChange,
  debounceMs = 300,
  placeholder = 'Search...',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  size = 'small',
  sx = {},
  ...textFieldProps
}) => {
  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced callback
  useEffect(() => {
    // Skip if values are the same
    if (localValue === value) return;

    const handler = setTimeout(() => {
      onChange?.(localValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, debounceMs, onChange, value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange?.('');
  }, [onChange]);

  return (
    <TextField
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={20} />
              ) : localValue ? (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  disabled={disabled}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        }
      }}
      sx={{
        minWidth: 200,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      {...textFieldProps}
    />
  );
};

export default SearchInput;
