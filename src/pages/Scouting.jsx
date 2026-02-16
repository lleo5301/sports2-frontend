import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScoutingReports } from '../hooks/useReports';
import { Spinner, Chip, Button } from '@heroui/react';

const Scouting = () => {
  const [page, setPage] = useState(1);

  // Use React Query hook for fetching scouting reports
  const {
    data: scoutingReports,
    isLoading,
    error,
    pagination,
    stats
  } = useScoutingReports({
    page,
    limit: 20
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'badge-neutral';
    const gradeValue = grade.replace(/[+-]/g, '');
    if (gradeValue === 'A') return 'badge-success';
    if (gradeValue === 'B') return 'badge-warning';
    if (gradeValue === 'C') return 'badge-info';
    return 'badge-error';
  };

  if (isLoading && scoutingReports.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Scouting Reports
          </h1>
          <p className="text-foreground/70">
            Manage and view scouting reports
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error?.message || 'Failed to load scouting reports'}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-primary">Total Reports</h2>
              <p className="text-3xl font-bold">{stats.totalReports}</p>
              <div className="text-sm text-success">All time reports</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-secondary">In Progress</h2>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
              <div className="text-sm text-warning">Needs attention</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-accent">Average Rating</h2>
              <p className="text-3xl font-bold">{stats.averageRating}</p>
              <div className="text-sm text-info">Out of 10</div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Player / Prospect</th>
                    <th>Scout</th>
                    <th>Date</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scoutingReports.map((report) => (
                    <tr key={report.id}>
                      <td className="font-medium">
                        {report.Player ? (
                          `${report.Player.first_name} ${report.Player.last_name}`
                        ) : report.Prospect ? (
                          `${report.Prospect.first_name} ${report.Prospect.last_name} (R)`
                        ) : (
                          <span className="text-foreground/50">Unknown</span>
                        )}
                      </td>
                      <td>
                        {report.Creator ? (
                          `${report.Creator.first_name} ${report.Creator.last_name}`
                        ) : report.User ? (
                          `${report.User.first_name} ${report.User.last_name}`
                        ) : (
                          <span className="text-foreground/50">Unknown</span>
                        )}
                      </td>
                      <td>
                        {new Date(
                          report.report_date || report.created_at
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          {report.overall_grade && (
                            <div
                              className={`badge badge-sm ${getGradeColor(report.overall_grade)}`}
                            >
                              Old: {report.overall_grade}
                            </div>
                          )}
                          {report.overall_present && (
                            <Chip color="primary" size="sm">
                              P: {report.overall_present}
                            </Chip>
                          )}
                          {report.overall_future && (
                            <Chip color="secondary" size="sm">
                              F: {report.overall_future}
                            </Chip>
                          )}
                          {!report.overall_grade && !report.overall_present && (
                            <span className="text-foreground/50">-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge ${
                            report.status === 'completed'
                              ? 'badge-success'
                              : report.status === 'in_progress'
                                ? 'badge-warning'
                                : 'badge-neutral'
                          }`}
                        >
                          {report.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <Button to={`/scouting/${report.id}`} size="sm" variant="bordered" as={Link}>
                            View
                          </Button>
                          <Button to={`/scouting/${report.id}/edit`} color="primary" size="sm" as={Link}>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <Button className="join-item"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}>
                    &laquo;
                  </Button>
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`join-item btn ${pagination.page === pageNum ? 'btn-active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <Button className="join-item"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}>
                    &raquo;
                  </Button>
                </div>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-4 text-sm text-foreground/70">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
              of {pagination.total} reports
            </div>
          </div>
        </div>

        {/* Add Report Button */}
        <div className="mt-8 text-center">
          <Button to="/scouting/create" color="primary" as={Link}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scouting;
