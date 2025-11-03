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

    // Centralized mapping of MIME types (and common fallbacks) to friendly display names.
    // Keep this aligned with backend allowed mimetypes in `file.middleware.js`.
    export const FILE_TYPE_LABELS = {
        // Images
        'image/jpeg': 'JPEG image',
        'image/jpg': 'JPEG image',
        'image/png': 'PNG image',
        'image/gif': 'GIF image',
        'image/webp': 'WebP image',
        'image/svg+xml': 'SVG image',

        // Documents
        'application/pdf': 'PDF document',
        'application/msword': 'Word document (.doc)',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word document (.docx)',
        'application/vnd.ms-powerpoint': 'PowerPoint (.ppt)',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint (.pptx)',
        'application/vnd.ms-excel': 'Excel spreadsheet (.xls)',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel spreadsheet (.xlsx)',

        // Archives
        'application/zip': 'Archive (zip)',
        'application/x-rar-compressed': 'Archive (rar)',
        'application/vnd.rar': 'Archive (rar)',
        'application/x-7z-compressed': 'Archive (7z)',

        // Notebooks & code
        'application/x-ipynb+json': 'Jupyter Notebook (.ipynb)',
        'application/ipynb': 'Jupyter Notebook (.ipynb)',
        'text/x-python': 'Python script (.py)',
        'application/x-python': 'Python script (.py)',
        'application/typescript': 'TypeScript',
        'text/javascript': 'JavaScript',
        'text/x-java-source': 'Java source',
        'text/x-csrc': 'C source',
        'text/x-c++src': 'C++ source',
        'application/x-sh': 'Shell script (.sh)',

        // Text & structured
        'text/markdown': 'Markdown',
        'text/plain': 'Text file',
        'text/csv': 'CSV',
        'text/html': 'HTML',
        'text/css': 'CSS',
        'application/json': 'JSON',

        // Fallback / generic
        'application/octet-stream': 'Binary file'
    };

    // Export the canonical allowed mimetypes used by the app (mirror of backend file.middleware)
    export const ALLOWED_MIME_TYPES = [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        // Documents
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Archives
        'application/zip', 'application/x-rar-compressed', 'application/vnd.rar', 'application/x-7z-compressed',
        // Programming & notebooks
        'text/x-python', 'application/x-ipynb+json', 'application/typescript', 'text/x-java-source', 'text/x-csrc', 'text/x-c++src',
        'text/markdown', 'application/x-sh',
        // Text files
        'text/plain', 'text/csv', 'text/javascript', 'text/css', 'text/html', 'application/json',
        // Fallback
        'application/octet-stream'
    ];

    /**
     * Format bytes into a human-readable string.
     * Example: 1536 -> "1.50 KB"
     */
    export const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        if (!bytes && bytes !== 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    /**
     * Returns a friendly label for a MIME type using FILE_TYPE_LABELS as the canonical map.
     * Falls back to generic groups like 'Image' or 'Text file' when possible.
     */
    export const formatFileType = (mime) => {
        if (!mime) return '';
        const m = String(mime).toLowerCase();
        if (FILE_TYPE_LABELS[m]) return FILE_TYPE_LABELS[m];
        if (m.startsWith('image/')) return 'Image';
        if (m.startsWith('text/')) {
            if (m.includes('markdown')) return 'Markdown';
            if (m.includes('csv')) return 'CSV';
            if (m.includes('html')) return 'HTML';
            if (m.includes('css')) return 'CSS';
            if (m.includes('javascript')) return 'JavaScript';
            return 'Text file';
        }
        const parts = m.split('/');
        if (parts.length > 1 && parts[1]) return parts[1].toUpperCase();
        return m.toUpperCase();
    };

    export default {
        getFileIcon,
        getFileColor,
        FILE_TYPE_LABELS,
        ALLOWED_MIME_TYPES,
        formatBytes,
        formatFileType
    };