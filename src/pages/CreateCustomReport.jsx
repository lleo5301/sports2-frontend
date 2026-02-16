import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService, pdfUtils } from '../services/reports';
import { toast } from 'react-hot-toast';
import AccessibleModal from '../components/ui/AccessibleModal';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Download,
  Eye,
  BarChart3,
  Table,
  FileText,
  Settings,
  Filter
} from 'lucide-react';

const CreateCustomReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    type: 'custom',
    data_sources: [],
    sections: [],
    filters: {},
    schedule: null
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Fetch available data sources
  const { data: dataSources = [] } = useQuery({
    queryKey: ['data-sources'],
    queryFn: () => Promise.resolve([
      { id: 'players', name: 'Players', description: 'Player performance and statistics' },
      { id: 'teams', name: 'Teams', description: 'Team statistics and information' },
      { id: 'scouting', name: 'Scouting Reports', description: 'Scouting analysis and evaluations' },
      { id: 'schedules', name: 'Schedules', description: 'Game and practice schedules' },
      { id: 'depth_charts', name: 'Depth Charts', description: 'Team depth chart information' },
      { id: 'recruitment', name: 'Recruitment Pipeline', description: 'Recruitment and prospect data' }
    ])
  });

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: reportsService.createReport,
    onSuccess: (data) => {
      toast.success('Custom report created successfully!');
      queryClient.invalidateQueries(['reports']);
      navigate('/reports');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create report');
    }
  });

  // Generate preview mutation
  const generatePreviewMutation = useMutation({
    mutationFn: async () => {
      // Simulate data fetching based on selected sources
      const mockData = {
        title: reportData.title,
        sections: reportData.sections.map(section => {
          if (section.type === 'table') {
            return {
              ...section,
              data: [
                ['John Smith', 'Pitcher', '2.45', '15', '8-3'],
                ['Mike Johnson', 'Catcher', '.285', '12', 'N/A'],
                ['David Wilson', 'First Base', '.312', '25', 'N/A']
              ]
            };
          } else if (section.type === 'chart') {
            return {
              ...section,
              data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [{
                  label: 'Performance',
                  data: [85, 88, 92, 89]
                }]
              }
            };
          }
          return section;
        })
      };
      return mockData;
    },
    onSuccess: (data) => {
      setPreviewData(data);
      setShowPreview(true);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: '',
      type: 'table',
      data_source: '',
      columns: [],
      chart_type: 'bar',
      content: ''
    };

    setReportData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId, updates) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (sectionId) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportData.title) {
      toast.error('Please enter a report title');
      return;
    }

    if (reportData.sections.length === 0) {
      toast.error('Please add at least one section to your report');
      return;
    }

    createReportMutation.mutate(reportData);
  };

  const handleDownloadPDF = () => {
    if (previewData) {
      pdfUtils.generateAndDownloadReport('custom', previewData, reportData.title);
    }
  };

  const sectionTypes = [
    { id: 'table', name: 'Data Table', icon: Table },
    { id: 'chart', name: 'Chart/Graph', icon: BarChart3 },
    { id: 'text', name: 'Text Content', icon: FileText }
  ];

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart' },
    { id: 'line', name: 'Line Chart' },
    { id: 'pie', name: 'Pie Chart' },
    { id: 'doughnut', name: 'Doughnut Chart' }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/reports')}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Custom Report
          </h1>
          <p className="text-foreground/70">
            Build a custom report with your preferred data sources and visualizations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Information
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Report Title *</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={reportData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Monthly Performance Summary"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={reportData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the report"
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Data Sources</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dataSources.map((source) => (
                    <label key={source.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={reportData.data_sources.includes(source.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReportData(prev => ({
                              ...prev,
                              data_sources: [...prev.data_sources, source.id]
                            }));
                          } else {
                            setReportData(prev => ({
                              ...prev,
                              data_sources: prev.data_sources.filter(id => id !== source.id)
                            }));
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-foreground/70">{source.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="card-title flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Report Sections
                </h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </button>
              </div>
            </div>
            <div className="card-body">
              {reportData.sections.length === 0 ? (
                <div className="text-center py-8 text-foreground/70">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                  <p>No sections added yet. Click &quot;Add Section&quot; to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reportData.sections.map((section, index) => (
                    <div key={section.id} className="card bg-content1">
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Section {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="btn btn-ghost btn-sm text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Section Title</span>
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              placeholder="e.g., Player Performance"
                              className="input input-bordered"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Section Type</span>
                            </label>
                            <select
                              value={section.type}
                              onChange={(e) => updateSection(section.id, { type: e.target.value })}
                              className="select select-bordered"
                            >
                              {sectionTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Data Source</span>
                            </label>
                            <select
                              value={section.data_source}
                              onChange={(e) => updateSection(section.id, { data_source: e.target.value })}
                              className="select select-bordered"
                            >
                              <option value="">Select data source...</option>
                              {dataSources.map(source => (
                                <option key={source.id} value={source.id}>{source.name}</option>
                              ))}
                            </select>
                          </div>

                          {section.type === 'chart' && (
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">Chart Type</span>
                              </label>
                              <select
                                value={section.chart_type}
                                onChange={(e) => updateSection(section.id, { chart_type: e.target.value })}
                                className="select select-bordered"
                              >
                                {chartTypes.map(type => (
                                  <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {section.type === 'text' && (
                          <div className="form-control mt-4">
                            <label className="label">
                              <span className="label-text">Content</span>
                            </label>
                            <textarea
                              value={section.content}
                              onChange={(e) => updateSection(section.id, { content: e.target.value })}
                              placeholder="Enter your text content..."
                              className="textarea textarea-bordered h-24"
                            />
                          </div>
                        )}

                        {section.type === 'table' && (
                          <div className="form-control mt-4">
                            <label className="label">
                              <span className="label-text">Columns (comma-separated)</span>
                            </label>
                            <input
                              type="text"
                              value={section.columns.join(', ')}
                              onChange={(e) => updateSection(section.id, {
                                columns: e.target.value.split(',').map(col => col.trim()).filter(col => col)
                              })}
                              placeholder="e.g., Name, Position, AVG, HR"
                              className="input input-bordered"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Options
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date Range</span>
                  </label>
                  <select className="select select-bordered">
                    <option value="">All Time</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="last_90_days">Last 90 Days</option>
                    <option value="this_year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Team Filter</span>
                  </label>
                  <select className="select select-bordered">
                    <option value="">All Teams</option>
                    <option value="my_team">My Team Only</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Position Filter</span>
                  </label>
                  <select className="select select-bordered">
                    <option value="">All Positions</option>
                    <option value="P">Pitchers</option>
                    <option value="C">Catchers</option>
                    <option value="IF">Infielders</option>
                    <option value="OF">Outfielders</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => generatePreviewMutation.mutate()}
              className="btn btn-outline"
              disabled={generatePreviewMutation.isLoading}
            >
              {generatePreviewMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createReportMutation.isLoading}
            >
              {createReportMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Report
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview Modal */}
        <AccessibleModal
          isOpen={showPreview && previewData !== null}
          onClose={() => setShowPreview(false)}
          title={previewData?.title || 'Report Preview'}
          size="lg"
        >
          <AccessibleModal.Header
            title={previewData?.title || 'Report Preview'}
            onClose={() => setShowPreview(false)}
          />
          <AccessibleModal.Content>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {previewData?.sections.map((section, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <h4 className="card-title">{section.title}</h4>
                  </div>
                  <div className="card-body">
                    {section.type === 'table' && section.data && (
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              {section.headers?.map((header, i) => (
                                <th key={i}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.data.map((row, i) => (
                              <tr key={i}>
                                {row.map((cell, j) => (
                                  <td key={j}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {section.type === 'chart' && (
                      <div className="h-64 bg-content1 rounded flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-foreground/50" />
                          <p className="text-foreground/70">Chart Preview</p>
                          <p className="text-sm text-foreground/50">{section.chart_type} Chart</p>
                        </div>
                      </div>
                    )}

                    {section.type === 'text' && (
                      <div className="prose max-w-none">
                        <p>{section.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="btn btn-outline"
            >
              Close
            </button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      </div>
    </div>
  );
};

export default CreateCustomReport;
