// Component type color configurations for consistent theming

/**
 * Color palette for different component types
 * Used across TimetableGrid and SessionModal
 */
export const componentColors = {
  theory: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText'
  },
  practical: {
    bgcolor: 'error.dark',
    color: 'error.contrastText'
  },
  tutorial: {
    bgcolor: 'success.dark',
    color: 'success.contrastText'
  }
};

/**
 * Get color configuration for a component type
 * @param {string} componentType - Type of component (theory, practical, tutorial)
 * @returns {object} Color configuration object
 */
export const getComponentColor = (componentType) => {
  const type = componentType?.toLowerCase();
  return componentColors[type] || componentColors.theory;
};
