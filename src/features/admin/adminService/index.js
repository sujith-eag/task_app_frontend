import { subjectService } from './subjectService.js';
import { userService } from './userService.js';
import { teacherService } from './teacherService.js';
import { reportingService } from './reportingService.js';
import { dashboardService } from './dashboardService.js';

const adminService = {
    ...subjectService,
    ...userService,
    ...teacherService,
    ...reportingService,
    ...dashboardService,
};

export default adminService;