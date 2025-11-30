import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, CircularProgress, Box, Typography, Breadcrumbs, Link, IconButton } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useGetFiles } from '../../useFileQueries.js';

const MoveModal = ({ open, onClose, onMove, itemToMove }) => {
    const [currentMoveParentId, setCurrentMoveParentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [moveError, setMoveError] = useState(null);
    const [selectedDestinationId, setSelectedDestinationId] = useState(null);
    const [selectedDestinationIsRoot, setSelectedDestinationIsRoot] = useState(false);

    const { data, isLoading: isQueryLoading } = useGetFiles(currentMoveParentId);

    useEffect(() => {
        if (!open) {
            setCurrentMoveParentId(null);
            setMoveError(null);
            setIsLoading(false);
            setSelectedDestinationId(null);
            setSelectedDestinationIsRoot(false);
        } else {
            // Support single item or bulk items (array). If bulk, pick the parentId of the first item.
            let parentId = null;
            if (Array.isArray(itemToMove)) {
                parentId = itemToMove.length > 0 && Object.prototype.hasOwnProperty.call(itemToMove[0], 'parentId') ? itemToMove[0].parentId : null;
            } else {
                parentId = (itemToMove && Object.prototype.hasOwnProperty.call(itemToMove, 'parentId')) ? itemToMove.parentId : null;
            }
            setCurrentMoveParentId(parentId);
            if (parentId === null) {
                setSelectedDestinationId(null);
                setSelectedDestinationIsRoot(true);
            } else {
                setSelectedDestinationId(parentId);
                setSelectedDestinationIsRoot(false);
            }
        }
    }, [open, itemToMove]);

    const handleMove = async () => {
        setIsLoading(true);
        setMoveError(null);
        // If selectedDestinationIsRoot is true, explicitly send null to the API (root)
        const destination = selectedDestinationIsRoot ? null : (selectedDestinationId ?? currentMoveParentId ?? null);
        try {
            // For bulk moves, pass the full item objects so caller can preserve old parentIds.
            if (Array.isArray(itemToMove)) {
                await onMove(itemToMove, destination);
            } else {
                await onMove(itemToMove._id, destination);
            }
            onClose();
        } catch (err) {
            // Better error parsing for axios-like errors
            const msg = err?.response?.data?.message || err?.message || 'Could not move item.';
            setMoveError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbs = data?.breadcrumbs || [];
    // Fallback: if breadcrumbs are empty but we have a currentFolder (non-root), show its name
    // FIXED: Normalize property names - backend uses 'fileName', we map to 'name' for consistency
    const breadcrumbNodes = (breadcrumbs && breadcrumbs.length > 0)
        ? breadcrumbs.map(b => ({ ...b, name: b.fileName || b.name }))
        : (data?.currentFolder && currentMoveParentId != null)
            ? [{ _id: data.currentFolder._id || data.currentFolder.id, name: data.currentFolder.fileName || data.currentFolder.name }]
            : [];
    const folderList = (data?.files || []).filter(i => i.isFolder);

    const effectiveDestination = selectedDestinationIsRoot ? null : (selectedDestinationId ?? currentMoveParentId ?? null);
    // Handle parent comparison for single item or array of items.
    let disableMove = false;
    if (Array.isArray(itemToMove)) {
        const parents = itemToMove.map(i => (i && Object.prototype.hasOwnProperty.call(i, 'parentId')) ? i.parentId : null);
        // if every selected item already in the destination, disable
        disableMove = parents.length > 0 && parents.every(p => String(p || '') === String(effectiveDestination || ''));
    } else {
        const itemParentId = Object.prototype.hasOwnProperty.call(itemToMove || {}, 'parentId') ? itemToMove.parentId : null;
        disableMove = (itemParentId === null && effectiveDestination === null) || String(itemParentId || '') === String(effectiveDestination || '');
    }

    return (
        <Dialog open={open} onClose={isLoading ? null : onClose} fullWidth maxWidth="sm">
            <DialogTitle>Move Item</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Browse folders to choose destination</Typography>
                    <Box sx={{ mt: 1 }}>
                        {isQueryLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <>
                                <Breadcrumbs aria-label="breadcrumb">
                                <Link
                                    component="button"
                                    underline="hover"
                                    color={currentMoveParentId == null ? 'text.primary' : 'inherit'}
                                    onClick={() => { setCurrentMoveParentId(null); setSelectedDestinationId(null); setSelectedDestinationIsRoot(true); }}
                                >
                                    Root
                                </Link>
                                {breadcrumbNodes.map((b) => (
                                    <Link
                                        key={b._id || b.id || b.name}
                                        component="button"
                                        underline="hover"
                                        color={String(currentMoveParentId) === String(b._id || b.id) ? 'text.primary' : 'inherit'}
                                        onClick={() => { const id = b._id || b.id; setCurrentMoveParentId(id); setSelectedDestinationIsRoot(false); setSelectedDestinationId(id); }}
                                    >
                                        {b.name}
                                    </Link>
                                ))}
                                </Breadcrumbs>
                                <Typography variant="caption" color="text.secondary">Click a folder to select it as the destination. Use the folder icon to open (enter) a folder.</Typography>
                            </>
                        )}
                    </Box>
                </Box>

                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List>
                        {/* Show a "Go up" entry when current folder has a parent */}
                        {data?.currentFolder && (data.currentFolder.parentId !== undefined) && (
                            <ListItem
                                button
                                onClick={() => {
                                    const pid = data.currentFolder.parentId ?? null;
                                    setCurrentMoveParentId(pid);
                                    if (pid === null) {
                                        setSelectedDestinationIsRoot(true);
                                        setSelectedDestinationId(null);
                                    } else {
                                        setSelectedDestinationIsRoot(false);
                                        setSelectedDestinationId(pid);
                                    }
                                }}
                            >
                                <ListItemText primary={'.. (Parent)'} secondary={'Go up one level'} />
                            </ListItem>
                        )}

                        {/* Explicit "Root" selector so user can choose root as destination */}
                        <ListItem
                            key="__root_selector"
                            button
                            selected={selectedDestinationIsRoot}
                            onClick={() => { setSelectedDestinationIsRoot(true); setSelectedDestinationId(null); }}
                        >
                            <ListItemText primary={'Root'} secondary={'Select root as destination'} />
                        </ListItem>

                        {folderList.map(folder => (
                            <ListItem
                                key={folder._id}
                                button
                                selected={!selectedDestinationIsRoot && String(folder._id) === String(selectedDestinationId)}
                                onClick={() => { setSelectedDestinationIsRoot(false); setSelectedDestinationId(folder._id); }}
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <ListItemText primary={folder.fileName} secondary={folder._id === itemToMove?._id ? 'Cannot move into itself' : ''} />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // navigate into this folder
                                            setCurrentMoveParentId(folder._id);
                                        }}
                                        aria-label={`Open ${folder.fileName}`}
                                    >
                                        <FolderOpenIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {moveError && <Typography color="error" variant="body2">{moveError}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button onClick={handleMove} disabled={isLoading || disableMove} variant="contained">
                    {isLoading ? <CircularProgress size={24} /> : 'Move Here'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MoveModal;
