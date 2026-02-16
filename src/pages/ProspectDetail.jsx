import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  User,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Video,
  FileText,
  Trash2,
  Plus,
  ChevronRight,
  ExternalLink,
  Star,
  Info,
} from "lucide-react";
import { prospectsService } from "../services/prospects";
import toast from "react-hot-toast";

export default function ProspectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: prospectResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prospect", id],
    queryFn: () => prospectsService.getProspect(id),
    enabled: !!id,
  });

  const { data: reportsResponse } = useQuery({
    queryKey: ["prospect-reports", id],
    queryFn: () => prospectsService.getScoutingReports(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => prospectsService.deleteProspect(id),
    onSuccess: () => {
      toast.success("Prospect deleted");
      navigate("/recruiting");
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error">
        <Info className="w-5 h-5" />
        <span>Error loading prospect details</span>
      </div>
    );

  const prospect = prospectResponse?.data;
  const reports = reportsResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card bg-base-100 shadow-sm overflow-hidden">
        <div className="bg-primary/5 p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-base-100 shadow-sm">
            <User className="w-16 h-16 text-primary/40" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start w-full">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">
                    {prospect.first_name} {prospect.last_name}
                  </h1>
                  <span className="badge badge-primary badge-outline uppercase text-[10px] font-bold tracking-widest">
                    {prospect.status}
                  </span>
                </div>
                <p className="text-xl text-primary font-medium mt-1">
                  {prospect.primary_position} &bull; {prospect.school_type}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-70">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {prospect.city}, {prospect.state}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Class of {prospect.graduation_year}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/prospects/${id}/edit`)}
                  className="btn btn-outline btn-sm"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this prospect?")
                    )
                      deleteMutation.mutate();
                  }}
                  className="btn btn-error btn-outline btn-sm btn-square"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-base-100/50 p-3 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">
                  Fastball Vel
                </p>
                <p className="text-lg font-bold">
                  {prospect.fastball_velocity || "N/A"} MPH
                </p>
              </div>
              <div className="bg-base-100/50 p-3 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">
                  Exit Vel
                </p>
                <p className="text-lg font-bold">
                  {prospect.exit_velocity || "N/A"} MPH
                </p>
              </div>
              <div className="bg-base-100/50 p-3 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">
                  60yd Dash
                </p>
                <p className="text-lg font-bold">
                  {prospect.sixty_yard_dash || "N/A"}s
                </p>
              </div>
              <div className="bg-base-100/50 p-3 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">
                  GPA
                </p>
                <p className="text-lg font-bold">{prospect.gpa || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="tabs tabs-boxed bg-base-200/50 p-1 w-fit">
            <button
              className={`tab tab-md ${activeTab === "overview" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab tab-md ${activeTab === "scouting" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("scouting")}
            >
              Scouting Reports ({reports.length})
            </button>
            <button
              className={`tab tab-md ${activeTab === "media" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("media")}
            >
              Media & Video
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Personal & Academic
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-base-200 pb-2">
                      <span className="opacity-60">School</span>
                      <span className="font-medium">
                        {prospect.school_name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-base-200 pb-2">
                      <span className="opacity-60">Bats / Throws</span>
                      <span className="font-medium">
                        {prospect.bats} / {prospect.throws}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-base-200 pb-2">
                      <span className="opacity-60">Height / Weight</span>
                      <span className="font-medium">
                        {prospect.height} &bull; {prospect.weight} lbs
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-base-200 pb-2">
                      <span className="opacity-60">SAT / ACT</span>
                      <span className="font-medium">
                        {prospect.sat_score || "-"} /{" "}
                        {prospect.act_score || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs opacity-50">Email Address</p>
                        <p className="font-medium">
                          {prospect.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="items-center gap-3 flex">
                      <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs opacity-50">Phone Number</p>
                        <p className="font-medium">
                          {prospect.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    {prospect.external_profile_url && (
                      <div className="pt-2">
                        <a
                          href={prospect.external_profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-block btn-sm gap-2"
                        >
                          External Profile <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "scouting" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Scouting History</h3>
                <button
                  onClick={() =>
                    navigate("/scouting/create", {
                      state: {
                        prospect_id: id,
                        prospect_name: `${prospect.first_name} ${prospect.last_name}`,
                      },
                    })
                  }
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </button>
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-12 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300">
                  <FileText className="w-12 h-12 opacity-20 mx-auto mb-4" />
                  <p className="opacity-50">No scouting reports yet</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary/30 transition-all"
                  >
                    <div className="card-body p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">
                              {new Date(
                                report.report_date,
                              ).toLocaleDateString()}
                            </h4>
                            <span className="badge badge-sm badge-ghost uppercase">
                              {report.event_type}
                            </span>
                          </div>
                          <p className="text-sm opacity-60">
                            by {report.Creator?.first_name}{" "}
                            {report.Creator?.last_name}
                          </p>
                        </div>
                        <div className="flex gap-4 text-center">
                          <div>
                            <p className="text-[10px] uppercase opacity-50 font-bold">
                              Present
                            </p>
                            <p className="text-xl font-black text-primary">
                              {report.overall_present}
                            </p>
                          </div>
                          <div className="w-px h-10 bg-base-200"></div>
                          <div>
                            <p className="text-[10px] uppercase opacity-50 font-bold">
                              Future
                            </p>
                            <p className="text-xl font-black text-secondary">
                              {report.overall_future}
                            </p>
                          </div>
                        </div>
                      </div>
                      {report.notes && (
                        <p className="mt-3 text-sm opacity-80 line-clamp-2 italic">
                          &quot;{report.notes}&quot;
                        </p>
                      )}
                      <div className="card-actions justify-end mt-4">
                        <Link
                          to={`/scouting/${report.id}`}
                          className="btn btn-ghost btn-xs gap-1"
                        >
                          View Full Report <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Media Library</h3>
                <button className="btn btn-outline btn-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Media
                </button>
              </div>

              {prospect.media?.length === 0 ? (
                <div className="text-center py-12 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300">
                  <Video className="w-12 h-12 opacity-20 mx-auto mb-4" />
                  <p className="opacity-50">No media files uploaded</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prospect.video_url && (
                    <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden group">
                      <div className="aspect-video bg-black flex items-center justify-center relative">
                        <Video className="w-12 h-12 text-white/20" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <a
                            href={prospect.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-circle"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm truncate">
                          Primary Video Link
                        </p>
                        <p className="text-[10px] opacity-50">EXTERNAL URL</p>
                      </div>
                    </div>
                  )}
                  {prospect.media?.map((m) => (
                    <div
                      key={m.id}
                      className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
                    >
                      <div className="aspect-video bg-base-200 flex items-center justify-center">
                        {m.media_type === "video" ? (
                          <Video className="w-8 h-8 opacity-20" />
                        ) : (
                          <FileText className="w-8 h-8 opacity-20" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm truncate">
                          {m.title || "Untitled Media"}
                        </p>
                        <p className="text-[10px] opacity-50 uppercase">
                          {m.media_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h3 className="font-bold text-sm uppercase opacity-50 tracking-wider mb-4">
                Pipeline Progress
              </h3>
              <ul className="steps steps-vertical -ml-4">
                <li
                  className={`step ${["identified", "evaluating", "contacted", "visiting", "offered", "committed", "signed"].includes(prospect.status) ? "step-primary" : ""}`}
                >
                  Identified
                </li>
                <li
                  className={`step ${["evaluating", "contacted", "visiting", "offered", "committed", "signed"].includes(prospect.status) ? "step-primary" : ""}`}
                >
                  Evaluating
                </li>
                <li
                  className={`step ${["contacted", "visiting", "offered", "committed", "signed"].includes(prospect.status) ? "step-primary" : ""}`}
                >
                  Contacted
                </li>
                <li
                  className={`step ${["visiting", "offered", "committed", "signed"].includes(prospect.status) ? "step-primary" : ""}`}
                >
                  Visiting
                </li>
                <li
                  className={`step ${["offered", "committed", "signed"].includes(prospect.status) ? "step-primary" : ""}`}
                >
                  Offered
                </li>
                <li
                  className={`step ${["committed", "signed"].includes(prospect.status) ? "step-primary" : ""}`}
                >
                  Committed
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-sm border border-primary/10">
            <div className="card-body">
              <h3 className="font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-warning fill-warning" />
                Notes
              </h3>
              <p className="text-sm italic opacity-80 mt-2">
                {prospect.notes ||
                  "No general notes recorded for this prospect."}
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                  {prospect.Creator?.first_name?.[0]}
                  {prospect.Creator?.last_name?.[0]}
                </div>
                <div>
                  <p className="text-[10px] opacity-50 uppercase font-bold">
                    Added By
                  </p>
                  <p className="text-xs font-medium">
                    {prospect.Creator?.first_name} {prospect.Creator?.last_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
