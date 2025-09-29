import { subjectService } from './subjectService.js';
import { userService } from './userService.js';
import { teacherService } from './teacherService.js';
import { reportingService } from './reportingService.js';

const adminService = {
    ...subjectService,
    ...userService,
    ...teacherService,
    ...reportingService,
};

export default adminService;