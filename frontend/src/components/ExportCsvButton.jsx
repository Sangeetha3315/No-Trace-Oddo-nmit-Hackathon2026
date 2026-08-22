import React from 'react';
import { Download } from 'lucide-react';

const ExportCsvButton = ({ data, filename = 'dayflow-export.csv', title = 'Export CSV' }) => {
  const exportToCSV = () => {
    if (!data || !data.length) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  };

  return (
    <button onClick={exportToCSV} className="btn btn-secondary">
      <Download size={16} /> {title}
    </button>
  );
};

export default ExportCsvButton;
