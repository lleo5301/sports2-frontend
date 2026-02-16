import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import {
  ArrowLeft,
  Download,
  Edit,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  FileText,
  Share2,
  Printer,
  PieChart
} from 'lucide-react';

const ViewStatisticsReport = () => {
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
            <p className="text-foreground/70 mb-6">
              The statistics report you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
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

  // Extract statistics data from sections
  const statisticsSection = report.sections?.find(s => s.title.includes('Statistics'));
  const analysisSection = report.sections?.find(s => s.title === 'Statistical Analysis');
  const recommendationsSection = report.sections?.find(s => s.title === 'Recommendations');

  const handleDownloadPDF = () => {
    // Generate PDF from report data
    const { pdfUtils } = require('../services/reports');
    const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    pdfUtils.generateAndDownloadReport('team-statistics', report, filename);
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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {report.title}
              </h1>
              <p className="text-foreground/70 mb-4">
                {report.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-foreground/60">
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
              <div className="text-sm text-foreground/60">Report Type</div>
              <div className="badge badge-secondary badge-lg">Statistics Report</div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          {/* Statistics Overview */}
          {statisticsSection && (
            <div className="card bg-background shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  {statisticsSection.title}
                </h2>

                {statisticsSection.data && statisticsSection.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          {statisticsSection.headers?.map((header, index) => (
                            <th key={index} className="font-semibold">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {statisticsSection.data.map((row, index) => (
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
                  <div className="text-center py-8 text-foreground/60">
                    <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No statistical data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Statistics Cards */}
          {statisticsSection?.data && statisticsSection.data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {statisticsSection.data.slice(0, 4).map((row, index) => (
                <div key={index} className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg">
                  <div className="card-body text-center">
                    <div className="text-3xl font-bold text-primary">
                      {row[2] || row[1]} {/* Value column */}
                    </div>
                    <div className="text-sm text-foreground/70">
                      {row[0]} {/* Label column */}
                    </div>
                    <div className="text-xs text-foreground/50">
                      {statisticsSection.headers?.[2] || 'Value'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistical Analysis */}
          {analysisSection && analysisSection.content && (
            <div className="card bg-background shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Statistical Analysis
                </h2>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">
                    {analysisSection.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendationsSection && recommendationsSection.content && (
            <div className="card bg-background shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <Target className="w-6 h-6 mr-2" />
                  Recommendations
                </h2>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">
                    {recommendationsSection.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparative Analysis */}
          {report.filters && (report.filters.previous_period || report.filters.league_average) && (
            <div className="card bg-background shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  Comparative Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.filters.previous_period && (
                    <div className="bg-content1 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Period Comparison</h3>
                      <p className="text-sm text-foreground/70">
                        Compared to previous reporting period
                      </p>
                      <div className="mt-2">
                        <div className="badge badge-info">Trend Analysis Available</div>
                      </div>
                    </div>
                  )}
                  {report.filters.league_average && (
                    <div className="bg-content1 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">League Comparison</h3>
                      <p className="text-sm text-foreground/70">
                        Compared to league averages
                      </p>
                      <div className="mt-2">
                        <div className="badge badge-success">Benchmarking Available</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Report Filters & Metadata */}
          {report.filters && Object.keys(report.filters).length > 0 && (
            <div className="card bg-background shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  Report Filters & Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(report.filters).map(([key, value]) => (
                    value && typeof value !== 'boolean' && (
                      <div key={key} className="bg-content1 p-3 rounded-lg">
                        <div className="text-sm text-foreground/60 capitalize">
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
            <div className="card bg-background shadow-xl">
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
        <div className="mt-12 pt-8 border-t border-divider">
          <div className="flex justify-between items-center">
            <div className="text-sm text-foreground/60">
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

export default ViewStatisticsReport;
