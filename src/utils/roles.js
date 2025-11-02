// Utility helpers for normalizing and checking user roles on the frontend
// Exported functions are intentionally tiny and dependency-free so they can
// be imported anywhere in the app without side effects.

export function getUserRoles(user) {
  if (!user) return [];
  if (Array.isArray(user.roles)) return user.roles;
  if (user.role) return [user.role];
  return [];
}

export function hasRole(user, role) {
  const roles = getUserRoles(user);
  return roles.includes(role);
}

export default getUserRoles;
