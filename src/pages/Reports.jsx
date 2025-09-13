import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService, pdfUtils } from '../services/reports';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  BarChart3,
  FileText,
  Users,
  Target,
  Calendar
} from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(null);

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

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async ({ type, filters }) => {
      let data;
      switch (type) {
        case 'player-performance':
          data = await reportsService.getPlayerPerformance(filters);
          break;
        case 'team-statistics':
          data = await reportsService.getTeamStatistics(filters);
          break;
        case 'scouting-analysis':
          data = await reportsService.getScoutingAnalysis(filters);
          break;
        case 'recruitment-pipeline':
          data = await reportsService.getRecruitmentPipeline(filters);
          break;
        default:
          throw new Error(`Unknown report type: ${type}`);
      }
      // Return the data directly, not data.data
      return { type, data: data };
    },
    onSuccess: ({ type, data }) => {
      const filename = `${type.replace('-', '_')}_${new Date().toISOString().split('T')[0]}`;
      pdfUtils.generateAndDownloadReport(type, data, filename);
      setGeneratingReport(null);
      toast.success('Report generated and downloaded successfully!');
    },
    onError: (error) => {
      setGeneratingReport(null);
      toast.error('Failed to generate report');
    }
  });

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

        {/* Generate Reports Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">
              <Download className="w-5 h-5 mr-2" />
              Generate Quick Reports
            </h2>
            <p className="text-base-content/70 mb-4">
              Generate and download reports from existing data
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                className="btn btn-outline btn-primary"
                onClick={() => {
                  setGeneratingReport('player-performance');
                  generateReportMutation.mutate({ type: 'player-performance', filters: {} });
                }}
                disabled={generatingReport === 'player-performance'}
              >
                {generatingReport === 'player-performance' ? (
                  <div className="loading loading-spinner loading-sm mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Performance
              </button>
              <button 
                className="btn btn-outline btn-secondary"
                onClick={() => {
                  setGeneratingReport('team-statistics');
                  generateReportMutation.mutate({ type: 'team-statistics', filters: {} });
                }}
                disabled={generatingReport === 'team-statistics'}
              >
                {generatingReport === 'team-statistics' ? (
                  <div className="loading loading-spinner loading-sm mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Statistics
              </button>
              <button 
                className="btn btn-outline btn-accent"
                onClick={() => {
                  setGeneratingReport('scouting-analysis');
                  generateReportMutation.mutate({ type: 'scouting-analysis', filters: {} });
                }}
                disabled={generatingReport === 'scouting-analysis'}
              >
                {generatingReport === 'scouting-analysis' ? (
                  <div className="loading loading-spinner loading-sm mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Scouting
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setGeneratingReport('recruitment-pipeline');
                  generateReportMutation.mutate({ type: 'recruitment-pipeline', filters: {} });
                }}
                disabled={generatingReport === 'recruitment-pipeline'}
              >
                {generatingReport === 'recruitment-pipeline' ? (
                  <div className="loading loading-spinner loading-sm mr-2"></div>
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Pipeline
              </button>
            </div>
          </div>
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
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              setGeneratingReport(report.type.toLowerCase());
                              generateReportMutation.mutate({ 
                                type: report.type.toLowerCase().replace(' ', '-'), 
                                filters: {} 
                              });
                            }}
                            title="Download Report"
                            disabled={generatingReport === report.type.toLowerCase()}
                          >
                            {generatingReport === report.type.toLowerCase() ? (
                              <div className="loading loading-spinner loading-xs"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
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

    </div>
  );
};

export default Reports; 