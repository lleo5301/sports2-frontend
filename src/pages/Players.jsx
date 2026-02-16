import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playersService } from "../services/players";
import { reportsService } from "../services/reports";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Settings2,
  Columns,
  Maximize2,
  Minimize2,
  UserPlus,
  Trash2,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerReports, setSelectedPlayerReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    position: "",
    status: "",
    school_type: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [density, setDensity] = useState("normal"); // 'compact', 'normal', 'comfortable'
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const queryClient = useQueryClient();

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Only add non-empty filter values
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params[key] = value;
        }
      });

      const response = await playersService.getPlayers(params);
      setPlayers(response.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      }));
    } catch (err) {
      // console.error('Error fetching players:', err);
      setError("Failed to load players");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: () => playersService.bulkDeletePlayers(selectedIds),
    onSuccess: (data) => {
      const count = data.data?.deletedCount || selectedIds.length;
      toast.success(
        `Successfully deleted ${count} player${count !== 1 ? "s" : ""}!`,
      );
      queryClient.invalidateQueries(["players"]);
      setSelectedIds([]);
      setShowDeleteConfirm(false);
      fetchPlayers();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete players");
    },
  });

  useEffect(() => {
    fetchPlayers();
    setSelectedIds([]); // Clear selection when filters or page changes
  }, [fetchPlayers]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(players.map((player) => player.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (playerId) => {
    setSelectedIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const isAllSelected =
    players.length > 0 && selectedIds.length === players.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < players.length;

  const fetchPlayerReports = async (playerId) => {
    try {
      setReportsLoading(true);
      const response = await reportsService.getScoutingReports({
        player_id: playerId,
      });

      if (response.success) {
        setSelectedPlayerReports(response.data);
      }
    } catch (error) {
      // console.error('Error fetching player reports:', error);
      setSelectedPlayerReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setSelectedPlayerReports([]);
    setSelectedReport(null);
    fetchPlayerReports(player.id);
  };

  const handleReportSelect = async (reportId) => {
    try {
      const response = await reportsService.getScoutingReport(reportId);
      if (response.success) {
        setSelectedReport(response.data);
      }
    } catch (error) {
      // console.error('Error fetching report details:', error);
    }
  };

  const formatReportDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getToolGrades = (report) => {
    const grades = [];
    if (report.overall_grade) grades.push(`Overall: ${report.overall_grade}`);
    if (report.hitting_grade) grades.push(`Hitting: ${report.hitting_grade}`);
    if (report.pitching_grade)
      grades.push(`Pitching: ${report.pitching_grade}`);
    if (report.fielding_grade)
      grades.push(`Fielding: ${report.fielding_grade}`);
    if (report.speed_grade) grades.push(`Speed: ${report.speed_grade}`);
    return grades;
  };

  if (loading && players.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-ui-primary tracking-tight mb-2">
                Players
              </h1>
              <p className="text-base-content/50 font-medium">
                Manage and analyze your team&apos;s player roster
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <button
                  className="btn btn-error btn-sm h-11 px-6 rounded-xl shadow-lg shadow-error/20"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedIds.length})
                </button>
              )}
              <button
                className="btn btn-primary btn-sm h-11 px-6 rounded-xl shadow-lg shadow-primary/20"
                onClick={() => navigate("/players/create")}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Player
              </button>
            </div>
          </div>
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
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search players..."
                  className="input input-bordered"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.position}
                  onChange={(e) =>
                    handleFilterChange("position", e.target.value)
                  }
                >
                  <option value="">All Positions</option>
                  <option value="P">Pitcher</option>
                  <option value="C">Catcher</option>
                  <option value="1B">First Base</option>
                  <option value="2B">Second Base</option>
                  <option value="3B">Third Base</option>
                  <option value="SS">Shortstop</option>
                  <option value="LF">Left Field</option>
                  <option value="CF">Center Field</option>
                  <option value="RF">Right Field</option>
                  <option value="OF">Outfield</option>
                  <option value="DH">Designated Hitter</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">School Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.school_type}
                  onChange={(e) =>
                    handleFilterChange("school_type", e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  <option value="HS">High School</option>
                  <option value="COLL">College</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Players Table Section */}
        <div className="space-y-4">
          {/* Table Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-200/50 p-4 rounded-2xl border border-ui-border backdrop-blur-md">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-secondary opacity-50" />
                <input
                  type="text"
                  placeholder="Search players by name, school..."
                  className="input input-bordered w-full pl-12 h-11 bg-base-100 border-ui-border focus:border-primary/50 rounded-xl"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`btn btn-sm h-11 px-4 rounded-xl border-ui-border bg-base-100 hover:bg-primary/10 transition-all ${filters.position || filters.status || filters.school_type ? "border-primary text-primary" : ""}`}
                  onClick={() => {
                    /* Toggle filters panel if we had one */
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="join bg-base-100 rounded-xl border border-ui-border overflow-hidden">
                <button
                  className={`join-item btn btn-sm h-11 px-4 border-0 hover:bg-primary/10 ${density === "compact" ? "bg-primary/20 text-primary" : "bg-transparent"}`}
                  onClick={() => setDensity("compact")}
                  title="Compact View"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  className={`join-item btn btn-sm h-11 px-4 border-0 hover:bg-primary/10 ${density === "normal" ? "bg-primary/20 text-primary" : "bg-transparent"}`}
                  onClick={() => setDensity("normal")}
                  title="Normal View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <button
                  className={`btn btn-sm h-11 px-4 rounded-xl border-ui-border bg-base-100 hover:bg-primary/10 ${showColumnSettings ? "text-primary" : ""}`}
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                >
                  <Columns className="w-4 h-4 mr-2" />
                  Columns
                </button>

                {showColumnSettings && (
                  <div className="absolute right-0 mt-2 w-56 bg-base-200 border border-ui-border rounded-2xl shadow-2xl z-50 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-ui-secondary mb-3">
                      Visible Columns
                    </h4>
                    <div className="space-y-2">
                      {["Name", "Position", "School", "Location", "Status"].map(
                        (col) => (
                          <label
                            key={col}
                            className="flex items-center justify-between cursor-pointer hover:bg-base-300/50 p-2 rounded-lg transition-colors"
                          >
                            <span className="text-sm">{col}</span>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary toggle-sm"
                              defaultChecked
                            />
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-sm h-11 px-4 rounded-xl border-ui-border bg-base-100 hover:bg-primary/10">
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* New Modern Table */}
          <div className="table-container">
            <table
              className={`table-modern ${density === "compact" ? "table-compact" : density === "comfortable" ? "table-comfortable" : ""}`}
            >
              <thead>
                <tr>
                  <th className="w-12 text-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary rounded-md"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      disabled={players.length === 0}
                    />
                  </th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>School</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.length > 0 ? (
                  players.map((player) => (
                    <tr key={player.id} className="group">
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-primary rounded-md"
                          checked={selectedIds.includes(player.id)}
                          onChange={() => handleSelectOne(player.id)}
                        />
                      </td>
                      <td className="font-bold text-ui-primary">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                            {player.first_name?.[0] || "?"}
                            {player.last_name?.[0] || "?"}
                          </div>
                          <div>
                            <p>
                              {player.first_name} {player.last_name}
                            </p>
                            <p className="text-[10px] text-ui-secondary opacity-50 uppercase font-black tracking-tighter">
                              ID: #{player.id?.toString().slice(0, 8) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline border-ui-border text-[10px] font-bold uppercase tracking-wider h-6">
                          {player.position}
                        </div>
                      </td>
                      <td className="text-ui-secondary">{player.school}</td>
                      <td className="text-ui-secondary text-xs">
                        {player.city}, {player.state}
                      </td>
                      <td>
                        <div
                          className={`badge h-6 text-[10px] font-black uppercase tracking-widest ${
                            player.status === "active"
                              ? "bg-success/20 text-success border-success/30"
                              : player.status === "inactive"
                                ? "bg-base-100 text-ui-secondary border-ui-border"
                                : player.status === "graduated"
                                  ? "bg-info/20 text-info border-info/30"
                                  : "bg-warning/20 text-warning border-warning/30"
                          }`}
                        >
                          {player.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                            onClick={() => navigate(`/players/${player.id}`)}
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                            onClick={() =>
                              navigate(`/players/${player.id}/edit`)
                            }
                            title="Edit Player"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <div className="dropdown dropdown-end">
                            <label
                              tabIndex={0}
                              className="btn btn-square btn-ghost btn-sm"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-200 rounded-xl border border-ui-border w-44"
                            >
                              <li>
                                <button
                                  onClick={() => handlePlayerSelect(player)}
                                >
                                  Quick View
                                </button>
                              </li>
                              <li>
                                <button className="text-error">
                                  Delete Player
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <Search className="w-12 h-12 mb-4" />
                        <p className="text-lg font-bold">No players found</p>
                        <p className="text-sm">
                          Try adjusting your filters or search terms
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Modern */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-xs font-medium text-ui-secondary opacity-60">
              Showing{" "}
              <span className="text-ui-primary font-bold">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="text-ui-primary font-bold">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="text-ui-primary font-bold">
                {pagination.total}
              </span>{" "}
              players
            </p>

            {pagination.pages > 1 && (
              <div className="join bg-base-200/30 rounded-xl border border-ui-border">
                <button
                  className="join-item btn btn-sm h-10 px-4 border-0 hover:bg-primary/10"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`join-item btn btn-sm h-10 px-4 border-0 ${pagination.page === pageNum ? "bg-primary text-primary-content shadow-lg shadow-primary/30" : "bg-transparent hover:bg-primary/10"}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}
                <button
                  className="join-item btn btn-sm h-10 px-4 border-0 hover:bg-primary/10"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Quick View Modal */}
      {selectedPlayer && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">
              Quick View - {selectedPlayer.first_name}{" "}
              {selectedPlayer.last_name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Position:</span>
                  <span className="badge badge-outline">
                    {selectedPlayer.position}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">School:</span>
                  <span>{selectedPlayer.school}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>
                    {selectedPlayer.city}, {selectedPlayer.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`badge ${
                      selectedPlayer.status === "active"
                        ? "badge-success"
                        : selectedPlayer.status === "inactive"
                          ? "badge-neutral"
                          : selectedPlayer.status === "graduated"
                            ? "badge-info"
                            : "badge-warning"
                    }`}
                  >
                    {selectedPlayer.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Height:</span>
                  <span>{selectedPlayer.height || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Weight:</span>
                  <span>
                    {selectedPlayer.weight
                      ? `${selectedPlayer.weight} lbs`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Graduation Year:</span>
                  <span>{selectedPlayer.graduation_year || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">School Type:</span>
                  <span className="badge badge-outline">
                    {selectedPlayer.school_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3">Performance Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {selectedPlayer.batting_avg || "N/A"}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Batting Avg
                  </div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {selectedPlayer.home_runs || "0"}
                  </div>
                  <div className="text-sm text-base-content/70">Home Runs</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {selectedPlayer.rbi || "0"}
                  </div>
                  <div className="text-sm text-base-content/70">RBI</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-info">
                    {selectedPlayer.stolen_bases || "0"}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Stolen Bases
                  </div>
                </div>
              </div>
            </div>

            {/* Scouting Reports Section */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3">Scouting Reports</h4>
              {reportsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : selectedPlayerReports.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedPlayerReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex justify-between items-center p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
                      onClick={() => handleReportSelect(report.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          Report Date: {formatReportDate(report.report_date)}
                        </div>
                        {report.game_date && (
                          <div className="text-sm text-base-content/70">
                            Game Date: {formatReportDate(report.game_date)}
                          </div>
                        )}
                        {report.opponent && (
                          <div className="text-sm text-base-content/70">
                            vs {report.opponent}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end text-right">
                        {getToolGrades(report)
                          .slice(0, 2)
                          .map((grade, index) => (
                            <div
                              key={index}
                              className="text-sm badge badge-outline mb-1"
                            >
                              {grade}
                            </div>
                          ))}
                        {getToolGrades(report).length > 2 && (
                          <div className="text-xs text-base-content/50">
                            +{getToolGrades(report).length - 2} more grades
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-base-content/50">
                  No scouting reports available for this player
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-info"
                onClick={() => navigate(`/players/${selectedPlayer.id}`)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Full Profile
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/players/${selectedPlayer.id}/edit`)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Player
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setSelectedPlayer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scouting Report Detail Modal */}
      {selectedReport && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl max-h-screen overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">
              Scouting Report - {selectedReport.Player?.first_name}{" "}
              {selectedReport.Player?.last_name}
            </h3>

            {/* Report Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div>
                  <strong>Report Date:</strong>{" "}
                  {formatReportDate(selectedReport.report_date)}
                </div>
                {selectedReport.game_date && (
                  <div>
                    <strong>Game Date:</strong>{" "}
                    {formatReportDate(selectedReport.game_date)}
                  </div>
                )}
                {selectedReport.opponent && (
                  <div>
                    <strong>Opponent:</strong> {selectedReport.opponent}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Scout:</strong> {selectedReport.User?.first_name}{" "}
                  {selectedReport.User?.last_name}
                </div>
                <div>
                  <strong>Position:</strong> {selectedReport.Player?.position}
                </div>
                <div>
                  <strong>School:</strong> {selectedReport.Player?.school}
                </div>
              </div>
            </div>

            {/* Tool Grades Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {selectedReport.overall_grade && (
                <div className="bg-base-200 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-primary">
                    {selectedReport.overall_grade}
                  </div>
                  <div className="text-sm">Overall Grade</div>
                </div>
              )}
              {selectedReport.hitting_grade && (
                <div className="bg-base-200 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-secondary">
                    {selectedReport.hitting_grade}
                  </div>
                  <div className="text-sm">Hitting Grade</div>
                </div>
              )}
              {selectedReport.pitching_grade && (
                <div className="bg-base-200 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-accent">
                    {selectedReport.pitching_grade}
                  </div>
                  <div className="text-sm">Pitching Grade</div>
                </div>
              )}
              {selectedReport.fielding_grade && (
                <div className="bg-base-200 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-info">
                    {selectedReport.fielding_grade}
                  </div>
                  <div className="text-sm">Fielding Grade</div>
                </div>
              )}
              {selectedReport.speed_grade && (
                <div className="bg-base-200 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-warning">
                    {selectedReport.speed_grade}
                  </div>
                  <div className="text-sm">Speed Grade</div>
                </div>
              )}
              {selectedReport.intangibles_grade && (
                <div className="bg-base-200 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-success">
                    {selectedReport.intangibles_grade}
                  </div>
                  <div className="text-sm">Intangibles Grade</div>
                </div>
              )}
            </div>

            {/* Tool Details */}
            <div className="space-y-4 mb-6">
              {/* Hitting Details */}
              {(selectedReport.bat_speed ||
                selectedReport.power_potential ||
                selectedReport.plate_discipline ||
                selectedReport.hitting_notes) && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Hitting Assessment</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {selectedReport.bat_speed && (
                      <div>
                        <strong>Bat Speed:</strong> {selectedReport.bat_speed}
                      </div>
                    )}
                    {selectedReport.power_potential && (
                      <div>
                        <strong>Power:</strong> {selectedReport.power_potential}
                      </div>
                    )}
                    {selectedReport.plate_discipline && (
                      <div>
                        <strong>Plate Discipline:</strong>{" "}
                        {selectedReport.plate_discipline}
                      </div>
                    )}
                  </div>
                  {selectedReport.hitting_notes && (
                    <div>
                      <strong>Notes:</strong> {selectedReport.hitting_notes}
                    </div>
                  )}
                </div>
              )}

              {/* Pitching Details */}
              {(selectedReport.fastball_velocity ||
                selectedReport.fastball_grade ||
                selectedReport.breaking_ball_grade ||
                selectedReport.command ||
                selectedReport.pitching_notes) && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Pitching Assessment</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {selectedReport.fastball_velocity && (
                      <div>
                        <strong>Fastball Velocity:</strong>{" "}
                        {selectedReport.fastball_velocity} mph
                      </div>
                    )}
                    {selectedReport.fastball_grade && (
                      <div>
                        <strong>Fastball Grade:</strong>{" "}
                        {selectedReport.fastball_grade}
                      </div>
                    )}
                    {selectedReport.breaking_ball_grade && (
                      <div>
                        <strong>Breaking Ball:</strong>{" "}
                        {selectedReport.breaking_ball_grade}
                      </div>
                    )}
                    {selectedReport.command && (
                      <div>
                        <strong>Command:</strong> {selectedReport.command}
                      </div>
                    )}
                  </div>
                  {selectedReport.pitching_notes && (
                    <div>
                      <strong>Notes:</strong> {selectedReport.pitching_notes}
                    </div>
                  )}
                </div>
              )}

              {/* Fielding Details */}
              {(selectedReport.arm_strength ||
                selectedReport.arm_accuracy ||
                selectedReport.range ||
                selectedReport.fielding_notes) && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Fielding Assessment</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {selectedReport.arm_strength && (
                      <div>
                        <strong>Arm Strength:</strong>{" "}
                        {selectedReport.arm_strength}
                      </div>
                    )}
                    {selectedReport.arm_accuracy && (
                      <div>
                        <strong>Arm Accuracy:</strong>{" "}
                        {selectedReport.arm_accuracy}
                      </div>
                    )}
                    {selectedReport.range && (
                      <div>
                        <strong>Range:</strong> {selectedReport.range}
                      </div>
                    )}
                  </div>
                  {selectedReport.fielding_notes && (
                    <div>
                      <strong>Notes:</strong> {selectedReport.fielding_notes}
                    </div>
                  )}
                </div>
              )}

              {/* Speed Details */}
              {(selectedReport.home_to_first || selectedReport.speed_notes) && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Speed Assessment</h5>
                  {selectedReport.home_to_first && (
                    <div className="mb-3">
                      <strong>Home to First:</strong>{" "}
                      {selectedReport.home_to_first} seconds
                    </div>
                  )}
                  {selectedReport.speed_notes && (
                    <div>
                      <strong>Notes:</strong> {selectedReport.speed_notes}
                    </div>
                  )}
                </div>
              )}

              {/* Overall Notes */}
              {selectedReport.overall_notes && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Overall Assessment</h5>
                  <div>{selectedReport.overall_notes}</div>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Selected Players</h3>
            <p className="py-4">
              Are you sure you want to delete {selectedIds.length} player
              {selectedIds.length !== 1 ? "s" : ""}? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
                disabled={bulkDeleteMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => bulkDeleteMutation.mutate()}
                className="btn btn-error"
                disabled={bulkDeleteMutation.isLoading}
              >
                {bulkDeleteMutation.isLoading ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    Delete {selectedIds.length} Player
                    {selectedIds.length !== 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;
