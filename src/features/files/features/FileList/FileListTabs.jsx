import React from 'react';
import { Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Renders the navigation tabs for the file list, displaying counts for each category.
 */
const FileListTabs = ({ 
    tabValue, 
    onTabChange, 
    myFilesCount, 
    sharedFilesCount, 
    mySharesCount 
}) => {
    return (
        <Tabs 
            value={tabValue} 
            onChange={onTabChange} 
            aria-label="file list tabs"
        >
            <Tab 
                label={`My Files (${myFilesCount})`}
                value="myFiles" 
            />
            <Tab
                label={`Shared With Me (${sharedFilesCount})`} 
                value="sharedWithMe" 
            />
            <Tab
                label={`My Shares (${mySharesCount})`}
                value="myShares"
            />                    
        </Tabs>
    );
};

// It's good practice to define prop types for better maintainability and error checking.
FileListTabs.propTypes = {
    /** The currently active tab's value string. */
    tabValue: PropTypes.string.isRequired,
    /** Function to call when the tab is changed. */
    onTabChange: PropTypes.func.isRequired,
    /** The number of files in the "My Files" list. */
    myFilesCount: PropTypes.number.isRequired,
    /** The number of files in the "Shared With Me" list. */
    sharedFilesCount: PropTypes.number.isRequired,
    /** The number of files in the "My Shares" list. */
    mySharesCount: PropTypes.number.isRequired,
};

export default FileListTabs;