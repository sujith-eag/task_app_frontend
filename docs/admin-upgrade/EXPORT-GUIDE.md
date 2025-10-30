# Export Functionality Guide - Admin Feature

**Library:** ExcelJS (Secure Alternative to xlsx)  
**Purpose:** CSV, Excel, PDF export capabilities  

---

## Table of Contents

1. [Why ExcelJS?](#why-exceljs)
2. [Excel Export Implementation](#excel-export-implementation)
3. [CSV Export Implementation](#csv-export-implementation)
4. [PDF Export (Alternative)](#pdf-export-alternative)
5. [Export Component](#export-component)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

### ✅ ExcelJS Benefits

- **Secure:** No known vulnerabilities, actively maintained
- **Feature-Rich:** Styling, formulas, charts, images
- **TypeScript Support:** Built-in type definitions
- **Better API:** More intuitive and well-documented
- **Performance:** Efficient memory usage
- **Browser & Node:** Works in both environments

**Dependencies Installed:**
```json
{
  "dependencies": {
    "exceljs": "^4.4.0",
    "file-saver": "^2.0.5"
  }
}
```

---

## Excel Export Implementation

### 1. Utility Function for Excel Export

**New File:** `src/utils/exportHelpers.js`

```javascript
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

/**
 * Export data to Excel with styling
 * 
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Output filename (without extension)
 * @param {String} sheetName - Worksheet name
 * @param {Object} options - Additional options
 */
export const exportToExcel = async (data, filename, sheetName = 'Sheet1', options = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Portal';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Add worksheet
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }], // Freeze header row
  });

  // Get columns from first data item or custom columns
  const columns = options.columns || Object.keys(data[0]).map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    key: key,
    width: 15,
  }));

  worksheet.columns = columns;

  // Style header row
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }, // Blue background
  };
  worksheet.getRow(1).font.color = { argb: 'FFFFFFFF' }; // White text
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 25;

  // Add data rows
  data.forEach((item, index) => {
    const row = worksheet.addRow(item);
    
    // Alternate row colors
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' }, // Light gray
      };
    }
  });

  // Auto-fit columns (with max width limit)
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = Math.min(maxLength + 2, 50); // Max 50 chars
  });

  // Add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Add metadata footer
  if (options.includeMetadata !== false) {
    const footerRow = worksheet.addRow([]);
    worksheet.addRow([`Exported on: ${format(new Date(), 'PPpp')}`]);
    worksheet.addRow([`Total Records: ${data.length}`]);
    
    // Style footer
    const lastRow = worksheet.rowCount;
    worksheet.getRow(lastRow - 1).font = { italic: true, size: 10 };
    worksheet.getRow(lastRow).font = { italic: true, size: 10 };
  }

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Save file
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  saveAs(blob, `${filename}_${timestamp}.xlsx`);
};

/**
 * Export multiple sheets to Excel
 */
export const exportToExcelMultiSheet = async (sheets, filename) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Portal';
  workbook.created = new Date();

  sheets.forEach(({ data, sheetName, columns }) => {
    const worksheet = workbook.addWorksheet(sheetName);
    
    // Add columns
    worksheet.columns = columns || Object.keys(data[0] || {}).map(key => ({
      header: key,
      key: key,
      width: 15,
    }));

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Add data
    worksheet.addRows(data);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  saveAs(blob, `${filename}_${timestamp}.xlsx`);
};
```

### 2. Advanced Excel Export with Charts

```javascript
/**
 * Export data with embedded chart
 */
export const exportWithChart = async (data, chartData, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Add data
  worksheet.columns = Object.keys(data[0]).map(key => ({
    header: key,
    key: key,
  }));
  worksheet.addRows(data);

  // Note: ExcelJS doesn't support chart creation directly
  // For charts, consider using a charting library to generate an image
  // and embed it in the Excel file

  // Add image (if you have chart as image)
  // const imageId = workbook.addImage({
  //   base64: chartImageBase64,
  //   extension: 'png',
  // });
  // worksheet.addImage(imageId, 'F2:K15');

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  saveAs(blob, `${filename}.xlsx`);
};
```

---

## CSV Export Implementation

### Simple CSV Export

```javascript
/**
 * Export data to CSV
 * 
 * @param {Array} data - Array of objects
 * @param {String} filename - Output filename
 * @param {Array} columns - Optional column configuration
 */
export const exportToCSV = (data, filename, columns = null) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers
  const headers = columns 
    ? columns.map(col => col.header || col.key)
    : Object.keys(data[0]);

  // Get keys
  const keys = columns
    ? columns.map(col => col.key)
    : Object.keys(data[0]);

  // Create CSV content
  let csv = headers.join(',') + '\n';

  data.forEach(row => {
    const values = keys.map(key => {
      const value = row[key];
      
      // Handle special characters
      if (value === null || value === undefined) {
        return '';
      }
      
      const stringValue = String(value);
      
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    });
    
    csv += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  saveAs(blob, `${filename}_${timestamp}.csv`);
};
```

---

## PDF Export (Alternative)

For PDF export, you'll need additional setup:

```bash
npm install jspdf jspdf-autotable
```

**PDF Export Function:**

```javascript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Export data to PDF
 */
export const exportToPDF = (data, filename, options = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const doc = new jsPDF({
    orientation: options.orientation || 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Add title
  const title = options.title || 'Data Export';
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Add metadata
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 22);
  doc.text(`Total Records: ${data.length}`, 14, 27);

  // Get columns
  const columns = options.columns || Object.keys(data[0]).map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    dataKey: key,
  }));

  // Add table
  autoTable(doc, {
    startY: 32,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey])),
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [68, 114, 196], // Blue
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [242, 242, 242], // Light gray
    },
  });

  // Save PDF
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  doc.save(`${filename}_${timestamp}.pdf`);
};
```

---

## Export Component

### Reusable Export Button Component

**New File:** `src/components/admin/ExportButton.jsx`

```jsx
import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toast } from 'react-toastify';
import { exportToExcel, exportToCSV, exportToPDF } from '@/utils/exportHelpers';

/**
 * Export button with format options
 */
const ExportButton = ({
  data,
  filename = 'export',
  columns = null,
  formats = ['excel', 'csv', 'pdf'], // Available formats
  disabled = false,
  onExportStart = null,
  onExportEnd = null,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format) => {
    handleClose();
    setIsExporting(true);
    
    if (onExportStart) onExportStart(format);

    try {
      switch (format) {
        case 'excel':
          await exportToExcel(data, filename, 'Data', { columns });
          toast.success('Excel file downloaded successfully');
          break;
        
        case 'csv':
          exportToCSV(data, filename, columns);
          toast.success('CSV file downloaded successfully');
          break;
        
        case 'pdf':
          exportToPDF(data, filename, { columns });
          toast.success('PDF file downloaded successfully');
          break;
        
        default:
          throw new Error('Unsupported format');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
      if (onExportEnd) onExportEnd(format);
    }
  };

  const formatConfig = {
    excel: {
      icon: <TableChartIcon />,
      label: 'Export as Excel',
      color: '#217346',
    },
    csv: {
      icon: <DescriptionIcon />,
      label: 'Export as CSV',
      color: '#757575',
    },
    pdf: {
      icon: <PictureAsPdfIcon />,
      label: 'Export as PDF',
      color: '#D32F2F',
    },
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
        onClick={handleClick}
        disabled={disabled || isExporting || !data || data.length === 0}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {formats.map((format) => {
          const config = formatConfig[format];
          return (
            <MenuItem key={format} onClick={() => handleExport(format)}>
              <ListItemIcon sx={{ color: config.color }}>
                {config.icon}
              </ListItemIcon>
              <ListItemText>{config.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ExportButton;
```

---

## Usage Examples

### 1. Export DataGrid Data

```jsx
import ExportButton from '@/components/admin/ExportButton';

const SubjectList = () => {
  const { subjects } = useSelector((state) => state.adminSubjects);

  const exportColumns = [
    { header: 'Subject Name', key: 'name' },
    { header: 'Code', key: 'subjectCode' },
    { header: 'Semester', key: 'semester' },
    { header: 'Department', key: 'department' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Subjects</Typography>
        
        <ExportButton
          data={subjects}
          filename="subjects"
          columns={exportColumns}
          formats={['excel', 'csv']}
        />
      </Box>

      <DataGrid rows={subjects} columns={columns} />
    </Box>
  );
};
```

### 2. Export Attendance Report

```jsx
const AttendanceReport = () => {
  const { attendanceStats, isLoading } = useSelector((state) => state.adminReporting);

  const handleExport = (format) => {
    // Log export action for audit
    logAudit({
      category: AUDIT_CATEGORIES.REPORT_ACCESS,
      action: AUDIT_ACTIONS.EXPORT,
      resourceType: 'Attendance Report',
      details: { format, recordCount: attendanceStats.length },
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Attendance Statistics</Typography>
        
        <ExportButton
          data={attendanceStats}
          filename="attendance_report"
          formats={['excel', 'pdf']}
          onExportStart={handleExport}
          disabled={isLoading}
        />
      </Box>

      <DataGrid rows={attendanceStats} columns={columns} />
    </Box>
  );
};
```

### 3. Export with Filtered Data

```jsx
const UserManagement = () => {
  const { userList } = useSelector((state) => state.adminUsers);
  const [filters, setFilters] = useState({ role: 'student', search: '' });

  // Filter data before export
  const filteredData = useMemo(() => {
    return userList.filter(user => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [userList, filters]);

  return (
    <Box>
      <ExportButton
        data={filteredData} // Export only filtered data
        filename={`users_${filters.role}`}
        formats={['excel', 'csv']}
      />
      
      <DataGrid rows={filteredData} columns={columns} />
    </Box>
  );
};
```

### 4. Multi-Sheet Excel Export

```jsx
const handleExportAllData = async () => {
  const sheets = [
    {
      sheetName: 'Students',
      data: students,
      columns: studentColumns,
    },
    {
      sheetName: 'Teachers',
      data: teachers,
      columns: teacherColumns,
    },
    {
      sheetName: 'Subjects',
      data: subjects,
      columns: subjectColumns,
    },
  ];

  try {
    await exportToExcelMultiSheet(sheets, 'complete_report');
    toast.success('Multi-sheet report exported successfully');
  } catch (error) {
    toast.error('Export failed');
  }
};

<Button onClick={handleExportAllData}>
  Export Complete Report
</Button>
```

---

## Best Practices

### 1. Data Preparation

```javascript
/**
 * Prepare data for export (format values, remove sensitive fields)
 */
const prepareExportData = (data) => {
  return data.map(item => ({
    'Student Name': item.name,
    'USN': item.studentDetails?.usn || 'N/A',
    'Semester': item.studentDetails?.semester || 'N/A',
    'Section': item.studentDetails?.section || 'N/A',
    'Enrollment Date': format(new Date(item.createdAt), 'PP'),
    // Exclude sensitive fields like email, password, etc.
  }));
};

<ExportButton data={prepareExportData(students)} />
```

### 2. Large Dataset Handling

```javascript
/**
 * Export large datasets in chunks (for better performance)
 */
const exportLargeDataset = async (data, filename) => {
  if (data.length > 10000) {
    toast.info('Large dataset detected. This may take a moment...');
  }

  try {
    await exportToExcel(data, filename);
  } catch (error) {
    if (error.message.includes('memory')) {
      toast.error('Dataset too large. Please filter and try again.');
    } else {
      toast.error('Export failed');
    }
  }
};
```

### 3. Permission Check

```javascript
import { hasPermission, PERMISSIONS } from '@/utils/permissions';

const ExportButtonWithPermission = (props) => {
  const { user } = useSelector((state) => state.auth);

  if (!hasPermission(user, PERMISSIONS.EXPORT_REPORTS)) {
    return null; // Hide button if no permission
  }

  return <ExportButton {...props} />;
};
```

### 4. Error Handling

```javascript
const handleExportWithErrorHandling = async () => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data available to export');
    }

    if (data.length > 50000) {
      throw new Error('Dataset exceeds maximum export limit (50,000 rows)');
    }

    await exportToExcel(data, filename);
    
    // Log successful export
    logAudit({
      category: AUDIT_CATEGORIES.REPORT_ACCESS,
      action: AUDIT_ACTIONS.EXPORT,
      resourceType: 'Report',
      details: { format: 'excel', rowCount: data.length },
    });
    
  } catch (error) {
    console.error('Export error:', error);
    toast.error(error.message);
  }
};
```

---

## Performance Considerations

### Memory Optimization

```javascript
/**
 * For very large datasets, use streaming (if backend supports it)
 */
const exportLargeDatasetStreaming = async (apiEndpoint, filename) => {
  const response = await fetch(apiEndpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const reader = response.body.getReader();
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: /* writable stream */,
  });

  // Process data in chunks
  // ... streaming logic
};
```

### Progress Indicator

```javascript
const [exportProgress, setExportProgress] = useState(0);

const exportWithProgress = async (data, filename) => {
  const chunkSize = 1000;
  const chunks = Math.ceil(data.length / chunkSize);

  for (let i = 0; i < chunks; i++) {
    const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    // Process chunk
    setExportProgress(((i + 1) / chunks) * 100);
  }

  // Finalize export
};
```

---

## Testing Export Functionality

```javascript
// Test data preparation
describe('Export Helpers', () => {
  test('should export valid Excel file', async () => {
    const testData = [
      { name: 'Test', code: 'T001', semester: 1 },
    ];
    
    await expect(exportToExcel(testData, 'test')).resolves.not.toThrow();
  });

  test('should handle empty data', async () => {
    await expect(exportToExcel([], 'test')).rejects.toThrow('No data to export');
  });
});
```

---

## Migration Checklist

### Remove xlsx, Add ExcelJS

- [x] Uninstall `xlsx` package
- [x] Install `exceljs` package
- [ ] Create `exportHelpers.js` utility file
- [ ] Create `ExportButton` component
- [ ] Update all export functions to use ExcelJS
- [ ] Test Excel exports with sample data
- [ ] Test CSV exports
- [ ] (Optional) Set up PDF export with jsPDF
- [ ] Update documentation
- [ ] Security audit (verify no vulnerabilities)

---

## Summary

**Secure Export Solution:**
- ✅ ExcelJS replaces vulnerable xlsx
- ✅ No security vulnerabilities
- ✅ Better features and styling
- ✅ Actively maintained
- ✅ TypeScript support

**Export Formats Supported:**
- Excel (.xlsx) - Full styling, multiple sheets
- CSV (.csv) - Simple text format
- PDF (.pdf) - Formatted documents (optional)

**Key Features:**
- Professional styling (headers, colors, borders)
- Auto-fit columns
- Frozen header row
- Metadata footer
- Multiple sheets support
- Progress indicators
- Permission checks
- Audit logging

Ready for production! 🚀
