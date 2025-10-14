import React from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const FileBreadcrumbs = ({ onNavigate }) => {
    const { currentFolder, breadcrumbs } = useSelector((state) => state.files);

    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
        >
            <Link underline="hover" color="inherit" href="#" onClick={() => onNavigate(null)}>
                My Files
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