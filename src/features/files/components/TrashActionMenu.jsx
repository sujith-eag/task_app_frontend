import React, { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const TrashActionMenu = ({ onRestore, onPurge }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleClose = () => setAnchorEl(null);
  const handleAction = (action) => () => { action(); handleClose(); };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleAction(onRestore)}>
          <ListItemIcon>
            <RestoreFromTrashIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Restore</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAction(onPurge)}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          <Typography color="error">Delete Permanently</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TrashActionMenu;
