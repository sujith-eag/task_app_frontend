import React from 'react';

import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description'; // For Word
import SlideshowIcon from '@mui/icons-material/Slideshow'; // For PowerPoint
import GridOnIcon from '@mui/icons-material/GridOn'; // For Excel
import FolderZipIcon from '@mui/icons-material/FolderZip'; // For Archives
import CodeIcon from '@mui/icons-material/Code'; // For Code/Text
import ArticleIcon from '@mui/icons-material/Article'; // The backup icon
/**
 * Returns a Material UI icon component based on the file's MIME type.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {React.ReactElement} A Material UI Icon component.
 */
export const getFileIcon = (mimeType) => {
    // Set a consistent color for all icons
    const iconProps = { sx: { color: 'text.primary' } };

    if (mimeType.startsWith('image/')) return <ImageIcon {...iconProps} />;
    
    switch (mimeType) {
        case 'application/pdf':
            return <PictureAsPdfIcon {...iconProps} />;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return <DescriptionIcon {...iconProps} />;
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return <SlideshowIcon {...iconProps} />;
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return <GridOnIcon {...iconProps} />;
        case 'application/zip':
        case 'application/x-rar-compressed':
            return <FolderZipIcon {...iconProps} />;
        case 'text/javascript':
        case 'text/html':
        case 'text/css':
        case 'application/json':
            return <CodeIcon {...iconProps} />;
        default:
            // Backup for .txt, .csv, and any other type
            return <ArticleIcon {...iconProps} />; 
    }
};