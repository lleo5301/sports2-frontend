import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const reports = [
    { id: 1, title: 'Monthly Player Performance', type: 'Performance', date: '2024-01-15', author: 'John Doe', status: 'Published' },
    { id: 2, title: 'Team Statistics Summary', type: 'Statistics', date: '2024-01-14', author: 'Jane Smith', status: 'Draft' },
    { id: 3, title: 'Scouting Analysis Q4', type: 'Scouting', date: '2024-01-13', author: 'Mike Johnson', status: 'Published' },
    { id: 4, title: 'Recruitment Pipeline', type: 'Recruitment', date: '2024-01-12', author: 'John Doe', status: 'In Review' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Reports
          </h1>
          <p className="text-base-content/70">
            Generate and manage analytical reports
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/players')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Performance Report
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistics Report
          </button>
          <button 
            className="btn btn-accent"
            onClick={() => navigate('/scouting/create')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Scouting Report
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => {
              alert('Custom report functionality coming soon!');
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Custom Report
          </button>
        </div>

        {/* Reports List */}
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="font-medium">{report.title}</td>
                      <td>
                        <div className="badge badge-outline">{report.type}</div>
                      </td>
                      <td>{report.date}</td>
                      <td>{report.author}</td>
                      <td>
                        <div className={`badge ${
                          report.status === 'Published' ? 'badge-success' :
                          report.status === 'Draft' ? 'badge-neutral' :
                          'badge-warning'
                        }`}>
                          {report.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setSelectedReport(report)}
                          >
                            View
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedReport(report);
                              alert(`Editing report: ${report.title}`);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              alert(`Downloading report: ${report.title}`);
                            }}
                            title="Download Report"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{selectedReport.title}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span className="badge badge-outline">{selectedReport.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{selectedReport.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Author:</span>
                <span>{selectedReport.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`badge ${
                  selectedReport.status === 'Published' ? 'badge-success' :
                  selectedReport.status === 'Draft' ? 'badge-neutral' :
                  'badge-warning'
                }`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>
            <div className="modal-action">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  alert(`Downloading ${selectedReport.title}`);
                  setSelectedReport(null);
                }}
              >
                Download
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 