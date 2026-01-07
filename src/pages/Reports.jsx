import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import {
  Download,
  Eye,
  Edit,
  Plus,
  BarChart3,
  FileText,
  Users,
  Target
} from 'lucide-react';
import { GenericPageSkeleton } from '../components/skeletons';

const Reports = () => {
  const navigate = useNavigate();

  // Fetch reports
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: reportsService.getAllReports,
    onError: (error) => {
      console.error('Error fetching reports:', error);
    }
  });

  const reports = reportsData?.data || [
    { id: 1, title: 'Monthly Player Performance', type: 'Performance', date: '2024-01-15', author: 'John Doe', status: 'Published' },
    { id: 2, title: 'Team Statistics Summary', type: 'Statistics', date: '2024-01-14', author: 'Jane Smith', status: 'Draft' },
    { id: 3, title: 'Scouting Analysis Q4', type: 'Scouting', date: '2024-01-13', author: 'Mike Johnson', status: 'Published' },
    { id: 4, title: 'Recruitment Pipeline', type: 'Recruitment', date: '2024-01-12', author: 'John Doe', status: 'In Review' },
  ];


  if (isLoading) {
    return (
      <GenericPageSkeleton
        contentType="table"
        showHeader={true}
        showDescription={true}
        itemCount={6}
        columns={6}
      />
    );
  }

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
          <div className="dropdown dropdown-bottom">
            <div tabIndex={0} role="button" className="btn btn-primary">
              <Users className="w-5 h-5 mr-2" />
              Performance Report
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow">
              <li>
                <button onClick={() => navigate('/performance/entry')} className="text-left">
                  <Plus className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Add Performance Data</div>
                    <div className="text-xs text-base-content/60">Enter game statistics</div>
                  </div>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/reports/create-performance')} className="text-left">
                  <FileText className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Create Report Template</div>
                    <div className="text-xs text-base-content/60">Generate analysis report</div>
                  </div>
                </button>
              </li>
            </ul>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/reports/create-statistics')}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Statistics Report
          </button>
          <button 
            className="btn btn-accent"
            onClick={() => navigate('/scouting/create')}
          >
            <Target className="w-5 h-5 mr-2" />
            Scouting Report
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/reports/create-custom')}
          >
            <Plus className="w-5 h-5 mr-2" />
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
                            onClick={() => {
                              const reportType = report.type.toLowerCase().replace(' ', '-');
                              if (reportType === 'performance' || reportType === 'player-performance') {
                                navigate(`/reports/${report.id}/performance`);
                              } else if (reportType === 'statistics' || reportType === 'team-statistics') {
                                navigate(`/reports/${report.id}/statistics`);
                              } else if (reportType === 'scouting') {
                                navigate(`/scouting/${report.id}`);
                              } else {
                                navigate(`/reports/${report.id}/view`);
                              }
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          {report.type.toLowerCase() === 'custom' ? (
                            <div className="dropdown dropdown-end">
                              <button tabIndex={0} className="btn btn-sm btn-primary">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                  <a onClick={() => navigate(`/reports/${report.id}/edit-content`)}>
                                    <Edit className="w-4 h-4" />
                                    Edit Report Content
                                  </a>
                                </li>
                                <li>
                                  <a onClick={() => navigate(`/reports/create-custom?edit=${report.id}`)}>
                                    <Edit className="w-4 h-4" />
                                    Edit Report Template
                                  </a>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => navigate(`/reports/${report.id}/edit-content`)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                          )}
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

    </div>
  );
};

export default Reports; 