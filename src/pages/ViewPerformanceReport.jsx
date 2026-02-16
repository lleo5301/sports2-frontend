import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import {
  ArrowLeft,
  Download,
  Edit,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  FileText,
  Share2,
  Printer
} from 'lucide-react';

const ViewPerformanceReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch report data
  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsService.getReport(id),
    enabled: !!id
  });

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

  if (error || !reportData?.data) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-error mb-4">Report Not Found</h1>
            <p className="text-base-content/70 mb-6">
              The performance report you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
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

  const report = reportData.data;

  // Extract performance data from sections
  const performanceSection = report.sections?.find(s => s.title === 'Performance Metrics');
  const analysisSection = report.sections?.find(s => s.title === 'Analysis');
  const recommendationsSection = report.sections?.find(s => s.title === 'Recommendations');

  const handleDownloadPDF = () => {
    // Generate PDF from report data
    const { pdfUtils } = require('../services/reports');
    const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    pdfUtils.generateAndDownloadReport('player-performance', report, filename);
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
              <button
                onClick={() => navigate(`/reports/${id}/edit-content`)}
                className="btn btn-primary btn-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Report
              </button>
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
              <div className="badge badge-primary badge-lg">Performance Report</div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          {/* Performance Metrics */}
          {performanceSection && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Performance Metrics
                </h2>

                {performanceSection.data && performanceSection.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          {performanceSection.headers?.map((header, index) => (
                            <th key={index} className="font-semibold">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {performanceSection.data.map((row, index) => (
                          <tr key={index}>
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
                ) : (
                  <div className="text-center py-8 text-base-content/60">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No performance data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Section */}
          {analysisSection && analysisSection.content && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <Target className="w-6 h-6 mr-2" />
                  Performance Analysis
                </h2>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-base-content">
                    {analysisSection.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendationsSection && recommendationsSection.content && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <FileText className="w-6 h-6 mr-2" />
                  Recommendations
                </h2>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-base-content">
                    {recommendationsSection.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report Filters & Metadata */}
          {report.filters && Object.keys(report.filters).length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  Report Filters & Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(report.filters).map(([key, value]) => (
                    value && (
                      <div key={key} className="bg-base-200 p-3 rounded-lg">
                        <div className="text-sm text-base-content/60 capitalize">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="font-medium">{value}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Data Sources */}
          {report.data_sources && report.data_sources.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
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

export default ViewPerformanceReport;
