import api from './api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

export const reportsService = {
  // Get all reports
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  // Get a single report by ID
  getReport: async (id) => {
    const response = await api.get(`/reports/byId/${id}`);
    return response.data;
  },

  // Create a new report
  createReport: async (reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/reports', filteredData);
    return response.data;
  },

  // Update a report
  updateReport: async (id, reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/reports/byId/${id}`, filteredData);
    return response.data;
  },

  // Delete a report
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/byId/${id}`);
    return response.data;
  },

  // Get player performance data
  getPlayerPerformance: async (filters = {}) => {
    const response = await api.get('/reports/player-performance', { params: filters });
    return response.data;
  },

  // Get team statistics
  getTeamStatistics: async (filters = {}) => {
    const response = await api.get('/reports/team-statistics', { params: filters });
    return response.data;
  },

  // Get scouting reports
  getScoutingReports: async (filters = {}) => {
    const response = await api.get('/reports/scouting', { params: filters });
    return response.data;
  },

  // Get scouting analysis
  getScoutingAnalysis: async (filters = {}) => {
    const response = await api.get('/reports/scouting-analysis', { params: filters });
    return response.data;
  },

  // Get recruitment pipeline
  getRecruitmentPipeline: async (filters = {}) => {
    const response = await api.get('/reports/recruitment-pipeline', { params: filters });
    return response.data;
  },

  // Create a scouting report
  createScoutingReport: async (reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/reports/scouting', filteredData);
    return response.data;
  },

  // Get a specific scouting report
  getScoutingReport: async (id) => {
    const response = await api.get(`/reports/scouting/${id}`);
    return response.data;
  },

  // Update a scouting report
  updateScoutingReport: async (id, reportData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(reportData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/reports/scouting/${id}`, filteredData);
    return response.data;
  },

  // Generate PDF report
  generatePDF: async (reportType, data, options = {}) => {
    const response = await api.post('/reports/generate-pdf', {
      type: reportType,
      data,
      options
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export report to Excel
  exportToExcel: async (reportType, data, options = {}) => {
    const response = await api.post('/reports/export-excel', {
      type: reportType,
      data,
      options
    }, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// PDF Generation Utilities
export const pdfUtils = {
  // Generate Player Performance Report PDF
  generatePlayerPerformancePDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Player Performance Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    // Table data
    const tableData = data.players.map(player => [
      `${player.first_name} ${player.last_name}`,
      player.position,
      player.batting_avg || 'N/A',
      player.home_runs || 'N/A',
      player.rbi || 'N/A',
      player.era || 'N/A',
      player.wins || 'N/A'
    ]);

    // Create table
    doc.autoTable({
      startY: 40,
      head: [['Player', 'Position', 'AVG', 'HR', 'RBI', 'ERA', 'Wins']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });

    return doc;
  },

  // Generate Team Statistics Report PDF
  generateTeamStatisticsPDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Team Statistics Summary', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Team: ${data.team_name}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 40, { align: 'center' });
    
    // Team stats
    const teamStats = [
      ['Category', 'Value'],
      ['Total Players', data.total_players || 'N/A'],
      ['Team Batting Average', data.team_batting_average || 'N/A'],
      ['Team ERA', data.team_era || 'N/A'],
      ['Wins', data.wins || 'N/A'],
      ['Losses', data.losses || 'N/A'],
      ['Win Percentage', data.win_percentage || 'N/A']
    ];

    // Create table
    doc.autoTable({
      startY: 50,
      head: [['Category', 'Value']],
      body: teamStats.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 }
    });

    return doc;
  },

  // Generate Scouting Analysis Report PDF
  generateScoutingAnalysisPDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Scouting Analysis Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 40;
    
    // Process each scouting report
    data.reports.forEach((report, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`${report.player_name} - ${report.position}`, 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.text(`Overall Grade: ${report.overall_grade}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Hitting Grade: ${report.hitting_grade}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Pitching Grade: ${report.pitching_grade}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Fielding Grade: ${report.fielding_grade}`, 20, yPosition);
      yPosition += 7;
      
      // Notes (truncated if too long)
      const notes = report.overall_notes || 'No notes available';
      const maxWidth = pageWidth - 40;
      const lines = doc.splitTextToSize(notes, maxWidth);
      doc.text('Notes:', 20, yPosition);
      yPosition += 5;
      doc.text(lines, 20, yPosition);
      yPosition += (lines.length * 5) + 10;
    });

    return doc;
  },

  // Generate Recruitment Pipeline Report PDF
  generateRecruitmentPipelinePDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('Recruitment Pipeline Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    // Pipeline stages
    const pipelineData = data.pipeline.map(stage => [
      stage.stage_name,
      stage.player_count,
      stage.avg_grade,
      stage.next_action
    ]);

    // Create table
    doc.autoTable({
      startY: 40,
      head: [['Stage', 'Players', 'Avg Grade', 'Next Action']],
      body: pipelineData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });

    return doc;
  },

  // Generate Custom Report PDF
  generateCustomReportPDF: (data, options = {}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text(data.title || 'Custom Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    let yPosition = 40;
    
    // Process sections
    data.sections.forEach((section, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(section.title, 20, yPosition);
      yPosition += 10;
      
      if (section.type === 'table' && section.data) {
        doc.autoTable({
          startY: yPosition,
          head: section.headers || [],
          body: section.data,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 10 }
        });
        yPosition = doc.lastAutoTable.finalY + 10;
      } else if (section.type === 'text' && section.content) {
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(section.content, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += (lines.length * 5) + 10;
      }
    });

    return doc;
  },

  // Download PDF
  downloadPDF: (doc, filename) => {
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, `${filename}.pdf`);
  },

  // Generate and download report
  generateAndDownloadReport: (reportType, data, filename) => {
    let doc;
    
    switch (reportType) {
      case 'player-performance':
        doc = pdfUtils.generatePlayerPerformancePDF(data);
        break;
      case 'team-statistics':
        doc = pdfUtils.generateTeamStatisticsPDF(data);
        break;
      case 'scouting-analysis':
        doc = pdfUtils.generateScoutingAnalysisPDF(data);
        break;
      case 'recruitment-pipeline':
        doc = pdfUtils.generateRecruitmentPipelinePDF(data);
        break;
      case 'custom':
        doc = pdfUtils.generateCustomReportPDF(data);
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
    
    pdfUtils.downloadPDF(doc, filename);
  }
};

// Chart Utilities for Reports
export const chartUtils = {
  // Create performance chart data
  createPerformanceChartData: (players) => {
    return {
      labels: players.map(p => `${p.first_name} ${p.last_name}`),
      datasets: [
        {
          label: 'Batting Average',
          data: players.map(p => p.batting_average || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: 'Home Runs',
          data: players.map(p => p.home_runs || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        }
      ]
    };
  },

  // Create team statistics chart data
  createTeamStatsChartData: (stats) => {
    return {
      labels: ['Wins', 'Losses', 'Ties'],
      datasets: [{
        data: [stats.wins || 0, stats.losses || 0, stats.ties || 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(156, 163, 175, 0.5)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 1
      }]
    };
  }
}; 