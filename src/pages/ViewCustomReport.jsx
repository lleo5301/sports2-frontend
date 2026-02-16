import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import {
  ArrowLeft,
  Download,
  Edit,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Table,
  Target,
  Share2,
  Printer,
  Settings
} from 'lucide-react';

const ViewCustomReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch report data
  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsService.getReport(id),
    enabled: !!id
  });

  const report = reportData?.data;

  // Redirect to correct view page if this is not actually a custom report
  // NOTE: This hook must be called before any early returns to follow React's rules of hooks
  useEffect(() => {
    if (report && report.type) {
      const reportType = report.type.toLowerCase().replace(' ', '-');
      if (reportType === 'performance' || reportType === 'player-performance') {
        navigate(`/reports/${id}/performance`, { replace: true });
        return;
      } else if (reportType === 'statistics' || reportType === 'team-statistics') {
        navigate(`/reports/${id}/statistics`, { replace: true });
        return;
      }
      // If it's actually a custom report or unknown type, stay on this page
    }
  }, [report, id, navigate]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-error mb-4">Report Not Found</h1>
            <p className="text-base-content/70 mb-6">
              The custom report you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <button
              onClick={() => navigate('/reports')}
              className="btn btn-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    // Generate PDF from report data
    const { pdfUtils } = require('../services/reports');
    const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    pdfUtils.generateAndDownloadReport('custom', report, filename);
  };

  const getSectionIcon = (sectionType) => {
    switch (sectionType) {
      case 'table':
        return <Table className="w-5 h-5" />;
      case 'chart':
        return <BarChart3 className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/reports')}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </button>

            <div className="flex space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="btn btn-outline btn-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-outline btn-sm"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-primary btn-sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Report
                </button>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a onClick={() => navigate(`/reports/${id}/edit-content`)}>
                      <Edit className="w-4 h-4" />
                      Edit Report Content
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate(`/reports/create-custom?edit=${id}`)}>
                      <Edit className="w-4 h-4" />
                      Edit Report Template
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                {report.title}
              </h1>
              <p className="text-base-content/70 mb-4">
                {report.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-base-content/60">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created: {new Date(report.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  By: {report.created_by_user?.first_name} {report.created_by_user?.last_name}
                </div>
                <div className={`badge ${
                  report.status === 'published' ? 'badge-success' :
                    report.status === 'draft' ? 'badge-neutral' :
                      'badge-warning'
                }`}>
                  {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-base-content/60">Report Type</div>
              <div className="badge badge-accent badge-lg">Custom Report</div>
            </div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-8">
          {report.sections && report.sections.length > 0 ? (
            report.sections.map((section, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">
                    {getSectionIcon(section.type)}
                    <span className="ml-2">{section.title}</span>
                  </h2>

                  {section.type === 'table' && section.data && section.data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        {section.headers && (
                          <thead>
                            <tr>
                              {section.headers.map((header, headerIndex) => (
                                <th key={headerIndex} className="font-semibold">{header}</th>
                              ))}
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {section.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={cellIndex === 0 ? 'font-medium' : ''}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : section.type === 'text' && section.content ? (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-base-content">
                        {section.content}
                      </div>
                    </div>
                  ) : section.type === 'chart' ? (
                    <div className="text-center py-8 text-base-content/60">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Chart visualization would be displayed here</p>
                      <p className="text-sm">Chart data: {JSON.stringify(section.data)}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/60">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No content available for this section</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Sections Available</h3>
                <p className="text-base-content/60">
                  This custom report doesn&apos;t have any sections configured yet.
                </p>
                <Link
                  to={`/reports/${id}/edit`}
                  className="btn btn-primary mt-4"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Add Sections
                </Link>
              </div>
            </div>
          )}

          {/* Report Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Sources */}
            {report.data_sources && report.data_sources.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    <Target className="w-5 h-5 mr-2" />
                    Data Sources
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {report.data_sources.map((source, index) => (
                      <div key={index} className="badge badge-outline badge-lg">
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Report Filters */}
            {report.filters && Object.keys(report.filters).length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    <Settings className="w-5 h-5 mr-2" />
                    Filters & Settings
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(report.filters).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                          <span className="text-sm text-base-content/60 capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Information */}
          {report.schedule && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  Report Schedule
                </h2>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-base-content/70">
                    This report is configured to run automatically based on the specified schedule.
                  </p>
                  <div className="mt-2">
                    <div className="badge badge-info">Scheduled Report</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-base-300">
          <div className="flex justify-between items-center">
            <div className="text-sm text-base-content/60">
              Last updated: {new Date(report.updated_at).toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigator.share?.({
                  title: report.title,
                  text: report.description,
                  url: window.location.href
                })}
                className="btn btn-ghost btn-sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <Link
                to="/reports/create-custom"
                className="btn btn-outline btn-sm"
              >
                Create Similar
              </Link>
              <Link
                to="/reports"
                className="btn btn-outline btn-sm"
              >
                View All Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomReport;
