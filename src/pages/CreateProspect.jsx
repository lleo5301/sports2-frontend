import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import { prospectsService } from "../services/prospects";

const positions = [
  "P",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "LF",
  "CF",
  "RF",
  "OF",
  "DH",
  "UTL",
];
const schoolTypes = ["HS", "JUCO", "D1", "D2", "D3", "NAIA", "Independent"];
const classYears = ["FR", "SO", "JR", "SR", "GR"];
const statusOptions = [
  "identified",
  "evaluating",
  "contacted",
  "visiting",
  "offered",
  "committed",
  "signed",
  "passed",
];
const batsThrows = ["L", "R", "S"];

const prospectSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  primary_position: z.enum(positions, {
    required_error: "Position is required",
  }),
  secondary_position: z.enum(positions).optional().or(z.literal("")),
  school_type: z.enum(schoolTypes).optional().or(z.literal("")),
  school_name: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(2).optional().or(z.literal("")),
  graduation_year: z.coerce.number().min(2020).max(2035).optional().or(z.nan()),
  class_year: z.enum(classYears).optional().or(z.literal("")),
  bats: z.enum(batsThrows).optional().or(z.literal("")),
  throws: z.enum(["L", "R"]).optional().or(z.literal("")),
  height: z.string().max(10).optional().or(z.literal("")),
  weight: z.coerce.number().min(100).max(350).optional().or(z.nan()),
  sixty_yard_dash: z.coerce.number().min(5).max(15).optional().or(z.nan()),
  fastball_velocity: z.coerce.number().min(40).max(110).optional().or(z.nan()),
  exit_velocity: z.coerce.number().min(40).max(130).optional().or(z.nan()),
  gpa: z.coerce.number().min(0).max(4.0).optional().or(z.nan()),
  sat_score: z.coerce.number().min(400).max(1600).optional().or(z.nan()),
  act_score: z.coerce.number().min(1).max(36).optional().or(z.nan()),
  status: z.enum(statusOptions).default("identified"),
  notes: z.string().max(1000).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  video_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  external_profile_url: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
});

export default function CreateProspect() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      status: "identified",
      primary_position: "SS",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await prospectsService.createProspect(data);
      toast.success("Prospect created successfully!");
      navigate("/recruiting");
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to create prospect";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Add New Prospect</h1>
          <p className="text-gray-500">
            Record a new recruiting target in the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label font-medium">First Name *</label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.first_name ? "input-error" : ""}`}
                  {...register("first_name")}
                />
                {errors.first_name && (
                  <p className="text-error text-xs mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label font-medium">Last Name *</label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.last_name ? "input-error" : ""}`}
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <p className="text-error text-xs mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label font-medium">Primary Position *</label>
                <select
                  className={`select select-bordered ${errors.primary_position ? "select-error" : ""}`}
                  {...register("primary_position")}
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label font-medium">Status</label>
                <select
                  className="select select-bordered"
                  {...register("status")}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* School & Location */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">Background & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label font-medium">School Type</label>
                <select
                  className="select select-bordered"
                  {...register("school_type")}
                >
                  <option value="">Select Type</option>
                  {schoolTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control col-span-2">
                <label className="label font-medium">School Name</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("school_name")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">City</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("city")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">State</label>
                <input
                  type="text"
                  className="input input-bordered"
                  maxLength={2}
                  {...register("state")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">Graduation Year</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("graduation_year")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Physical & Skill Data */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">Physicals & Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="form-control">
                <label className="label font-medium">Height</label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="6-1"
                  {...register("height")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">Weight (lbs)</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("weight")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">Bats</label>
                <select
                  className="select select-bordered"
                  {...register("bats")}
                >
                  <option value="">-</option>
                  {batsThrows.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label font-medium">Throws</label>
                <select
                  className="select select-bordered"
                  {...register("throws")}
                >
                  <option value="">-</option>
                  <option value="L">L</option>
                  <option value="R">R</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label font-medium">60yd Dash</label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  {...register("sixty_yard_dash")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">FB Velocity</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("fastball_velocity")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">Exit Velocity</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("exit_velocity")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Data */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">Academics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label font-medium">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered"
                  {...register("gpa")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">SAT Score</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("sat_score")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">ACT Score</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("act_score")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Links */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">Contact & Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label font-medium">Email</label>
                <input
                  type="email"
                  className="input input-bordered"
                  {...register("email")}
                />
              </div>

              <div className="form-control">
                <label className="label font-medium">Phone</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("phone")}
                />
              </div>

              <div className="form-control col-span-2">
                <label className="label font-medium">
                  Video URL (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  className="input input-bordered"
                  {...register("video_url")}
                />
              </div>

              <div className="form-control col-span-2">
                <label className="label font-medium">
                  External Profile URL
                </label>
                <input
                  type="url"
                  className="input input-bordered"
                  {...register("external_profile_url")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Prospect
          </button>
        </div>
      </form>
    </div>
  );
}
