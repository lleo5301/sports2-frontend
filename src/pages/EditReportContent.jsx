import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reports';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Table,
  Type
} from 'lucide-react';

const EditReportContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    sections: []
  });

  // Fetch existing report data
  const { data: existingReportData, isLoading: isLoadingReport } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsService.getReport(id),
    enabled: Boolean(id)
  });

  // Populate form with existing report data
  useEffect(() => {
    if (existingReportData?.data) {
      const report = existingReportData.data;
      setReportData({
        title: report.title || '',
        description: report.description || '',
        sections: report.sections || []
      });
    }
  }, [existingReportData]);

  // Update report content mutation
  const updateReportMutation = useMutation({
    mutationFn: async (data) => {
      const reportPayload = {
        ...existingReportData.data,
        sections: data.sections
      };
      return await reportsService.updateReport(id, reportPayload);
    },
    onSuccess: (data) => {
      toast.success('Report content updated successfully!');
      queryClient.invalidateQueries(['reports']);
      queryClient.invalidateQueries(['report', id]);
      navigate(`/reports/${id}/view`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update report content');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateReportMutation.mutate(reportData);
  };

  const handleSectionUpdate = (sectionIndex, field, value) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const handleTableDataUpdate = (sectionIndex, rowIndex, colIndex, value) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
            ...section,
            data: section.data.map((row, rIndex) =>
              rIndex === rowIndex
                ? row.map((cell, cIndex) => cIndex === colIndex ? value : cell)
                : row
            )
          }
          : section
      )
    }));
  };

  const addTableRow = (sectionIndex) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex && section.type === 'table'
          ? {
            ...section,
            data: [
              ...section.data,
              new Array(section.headers?.length || 1).fill('')
            ]
          }
          : section
      )
    }));
  };

  const removeTableRow = (sectionIndex, rowIndex) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex && section.type === 'table'
          ? {
            ...section,
            data: section.data.filter((_, rIndex) => rIndex !== rowIndex)
          }
          : section
      )
    }));
  };

  if (isLoadingReport) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/reports`)}
            className="btn btn-ghost btn-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Edit Report Content
          </h1>
          <p className="text-base-content/70">
            Edit the data values within your report sections
          </p>
          <div className="mt-4 p-4 bg-info/10 rounded-lg">
            <h3 className="font-semibold text-info mb-2">Report: {reportData.title}</h3>
            <p className="text-sm text-base-content/70">{reportData.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Report Sections */}
          <div className="space-y-6">
            {reportData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    {section.type === 'table' ? (
                      <Table className="w-5 h-5 text-primary mr-2" />
                    ) : (
                      <Type className="w-5 h-5 text-primary mr-2" />
                    )}
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>

                  {section.type === 'text' ? (
                    <div>
                      <textarea
                        className="textarea textarea-bordered w-full h-32"
                        placeholder="Enter your text content here..."
                        value={section.content || ''}
                        onChange={(e) => handleSectionUpdate(sectionIndex, 'content', e.target.value)}
                      />
                    </div>
                  ) : section.type === 'table' ? (
                    <div>
                      {/* Table Data - Headers are read-only */}
                      <div className="overflow-x-auto">
                        <table className="table table-bordered w-full">
                          <thead>
                            <tr>
                              {section.headers?.map((header, headerIndex) => (
                                <th key={headerIndex} className="bg-base-200">
                                  {header}
                                </th>
                              ))}
                              <th className="w-16">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.data?.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex}>
                                    <input
                                      type="text"
                                      className="input input-bordered input-sm w-full"
                                      value={cell}
                                      onChange={(e) => handleTableDataUpdate(sectionIndex, rowIndex, colIndex, e.target.value)}
                                    />
                                  </td>
                                ))}
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm text-error"
                                    onClick={() => removeTableRow(sectionIndex, rowIndex)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => addTableRow(sectionIndex)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Row
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(`/reports`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateReportMutation.isLoading}
            >
              {updateReportMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportContent;
