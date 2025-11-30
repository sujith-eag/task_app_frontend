import React from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

const FileBreadcrumbs = ({ onNavigate }) => {
    const { currentFolder, breadcrumbs, isSharedContext, shareRootId } = useSelector((state) => state.files);

    // Handle navigation to root
    // For shared context: navigate to the share root folder (not null)
    // For owned context: navigate to null (My Files root)
    const handleRootClick = () => {
        if (isSharedContext && shareRootId) {
            // Navigate to the share root folder
            onNavigate(shareRootId);
        } else {
            onNavigate(null);
        }
    };

    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
        >
            <Link 
                underline="hover" 
                color="inherit" 
                href="#" 
                onClick={handleRootClick}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
                {isSharedContext ? (
                    <>
                        <FolderSharedIcon fontSize="small" />
                        Shared Folder
                    </>
                ) : (
                    'My Files'
                )}
            </Link>
            {breadcrumbs.map((crumb) => (
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    key={crumb._id}
                    onClick={() => onNavigate(crumb._id)}
                >
                    {crumb.fileName}
                </Link>
            ))}
            {currentFolder && (
                <Typography color="text.primary">{currentFolder.fileName}</Typography>
            )}
        </Breadcrumbs>
    );
};

export default FileBreadcrumbs;