import React from 'react';

import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description'; // For Word
import SlideshowIcon from '@mui/icons-material/Slideshow'; // For PowerPoint
import GridOnIcon from '@mui/icons-material/GridOn'; // For Excel
import FolderZipIcon from '@mui/icons-material/FolderZip'; // For Archives
import CodeIcon from '@mui/icons-material/Code'; // For Code/Text
import ArticleIcon from '@mui/icons-material/Article'; // The backup icon
import PythonIcon from '@mui/icons-material/Adb';
import NotebookIcon from '@mui/icons-material/Book';
import TerminalIcon from '@mui/icons-material/Terminal';
/**
 * Returns a Material UI icon component based on the file's MIME type.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {React.ReactElement} A Material UI Icon component.
 */
export const getFileColor = (mimeType) => {
    if (!mimeType) return 'grey.200';
    if (mimeType.startsWith('image/')) return 'info.main';
    if (mimeType === 'application/pdf') return 'error.main';
    if (mimeType === 'application/x-ipynb+json' || mimeType === 'application/ipynb') return 'secondary.dark';
    if (mimeType === 'text/x-python' || mimeType === 'application/x-python' || mimeType === 'text/x-java-source' || mimeType === 'text/x-csrc' || mimeType === 'text/x-c++src') return 'purple.500';
    if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'secondary.main';
    if (mimeType === 'application/vnd.ms-powerpoint' || mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'warning.main';
    if (mimeType === 'application/vnd.ms-excel' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'success.main';
    if (mimeType === 'application/zip' || mimeType === 'application/x-rar-compressed') return 'secondary.main';
    if (mimeType.startsWith('text/') || ['text/javascript', 'text/html', 'text/css', 'application/json'].includes(mimeType)) return 'primary.main';
    return 'grey.200';
};

export const getFileIcon = (mimeType) => {
    // Use white icons so they contrast on colored avatars
    const iconProps = { sx: { color: 'common.white' } };

    if (mimeType && mimeType.startsWith('image/')) return <ImageIcon {...iconProps} />;
    
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
        case 'application/x-ipynb+json':
        case 'application/ipynb':
            return <NotebookIcon {...iconProps} />;
        case 'text/x-python':
        case 'application/x-python':
            return <PythonIcon {...iconProps} />;
        case 'application/x-sh':
            return <TerminalIcon {...iconProps} />;
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