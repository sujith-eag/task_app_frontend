import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Typography, List, ListItem, ListItemIcon,
    ListItemText, Divider, Button, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const SessionModal = ({ session, onClose }) => {
    // Use the presence of the session object to control the dialog's open state
    if (!session) return null;

    return (
        <Dialog 
            open={!!session} 
            onClose={onClose} 
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0, p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box>
                    <Typography variant="h6" component="div">
                        {session.subjectTitle}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        {session.subjectCode} ({session.componentType})
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <List dense>
                    <ListItem>
                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                        <ListItemText primary={session.facultyName} secondary="Faculty" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><GroupIcon /></ListItemIcon>
                        <ListItemText primary={session.studentGroupId} secondary="Group / Section" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><MeetingRoomIcon /></ListItemIcon>
                        <ListItemText primary={session.roomId} secondary="Room" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><ScheduleIcon /></ListItemIcon>
                        <ListItemText primary={`${session.day}, ${session.startTime} - ${session.endTime}`} secondary="Time" />
                    </ListItem>
                    {session.supportingStaff && session.supportingStaff.length > 0 && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <ListItem>
                                <ListItemIcon><SupportAgentIcon /></ListItemIcon>
                                <ListItemText 
                                    primary={session.supportingStaff.map(staff => staff.staffName).join(', ')} 
                                    secondary="Supporting Staff" 
                                />
                            </ListItem>
                        </>
                    )}
                </List>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionModal;