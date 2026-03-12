import { Chip, Button } from '@heroui/react';
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
      // console.error('Error fetching reports:', error);
    }
  });

  const reports = reportsData?.data || [
    {
      id: 1,
      title: 'Monthly Player Performance',
      type: 'Performance',
      date: '2024-01-15',
      author: 'John Doe',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Team Statistics Summary',
      type: 'Statistics',
      date: '2024-01-14',
      author: 'Jane Smith',
      status: 'Draft'
    },
    {
      id: 3,
      title: 'Scouting Analysis Q4',
      type: 'Scouting',
      date: '2024-01-13',
      author: 'Mike Johnson',
      status: 'Published'
    },
    {
      id: 4,
      title: 'Recruitment Pipeline',
      type: 'Recruitment',
      date: '2024-01-12',
      author: 'John Doe',
      status: 'In Review'
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-foreground/70">
            Generate and manage analytical reports
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="dropdown dropdown-bottom">
            <Button tabIndex={0} role="button"  as="div" color="primary">
              <Users className="w-5 h-5 mr-2" />
              Performance Report
            </Button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-background rounded-box z-[1] w-64 p-2 shadow"
            >
              <li>
                <button
                  onClick={() => navigate('/performance/entry')}
                  className="text-left"
                >
                  <Plus className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Add Performance Data</div>
                    <div className="text-xs text-foreground/60">
                      Enter game statistics
                    </div>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/reports/create-performance')}
                  className="text-left"
                >
                  <FileText className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Create Report Template</div>
                    <div className="text-xs text-foreground/60">
                      Generate analysis report
                    </div>
                  </div>
                </button>
              </li>
            </ul>
          </div>
          <Button onClick={() => navigate('/reports/create-statistics')} color="secondary">
            <BarChart3 className="w-5 h-5 mr-2" />
            Statistics Report
          </Button>
          <Button className="-accent"
            onClick={() => navigate('/scouting/create')}>
            <Target className="w-5 h-5 mr-2" />
            Scouting Report
          </Button>
          <Button onClick={() => navigate('/reports/create-custom')} variant="bordered">
            <Plus className="w-5 h-5 mr-2" />
            Custom Report
          </Button>
        </div>

        {/* Reports List */}
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Author</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="group">
                  <td className="font-bold text-ui-primary">{report.title}</td>
                  <td>
                    <Chip className="border-ui-border text-[10px] font-bold uppercase tracking-wider h-6" variant="bordered">
                      {report.type}
                    </Chip>
                  </td>
                  <td className="text-ui-secondary">{report.date}</td>
                  <td className="text-ui-secondary">{report.author}</td>
                  <td>
                    <div
                      className={`badge h-6 text-[10px] font-black uppercase tracking-widest ${
                        report.status === 'Published'
                          ? 'bg-success/20 text-success border-success/30'
                          : report.status === 'Draft'
                            ? 'bg-background text-ui-secondary border-ui-border'
                            : 'bg-warning/20 text-warning border-warning/30'
                      }`}
                    >
                      {report.status}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button className="text-info hover:bg-info/10" onClick={() => { const reportType = report.type .toLowerCase() .replace(' ', '-'); if ( reportType === 'performance' || reportType === 'player-performance' ) { navigate(`/reports/${report.id}/performance`); } else if ( reportType === 'statistics' || reportType === 'team-statistics' ) { navigate(`/reports/${report.id}/statistics`); } else if (reportType === 'scouting') { navigate(`/scouting/${report.id}`); } else { navigate(`/reports/${report.id}/view`); } }} title="View Report" size="sm" variant="light" isIconOnly>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {report.type.toLowerCase() === 'custom' ? (
                        <div className="dropdown dropdown-end">
                          <Button
                            tabIndex={0}
                            className="text-primary hover:bg-primary/10"
                            variant="light" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow-2xl bg-content1 rounded-xl border border-ui-border w-52"
                          >
                            <li>
                              <button
                                onClick={() =>
                                  navigate(`/reports/${report.id}/edit-content`)
                                }
                              >
                                <Edit className="w-4 h-4" />
                                Edit Report Content
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/reports/create-custom?edit=${report.id}`
                                  )
                                }
                              >
                                <Edit className="w-4 h-4" />
                                Edit Report Template
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <Button className="text-primary hover:bg-primary/10" onClick={() => navigate(`/reports/${report.id}/edit-content`) } title="Edit Report" size="sm" variant="light" isIconOnly>
                          <Edit className="w-4 h-4" />
                        </Button>
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
  );
};

export default Reports;
