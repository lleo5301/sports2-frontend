import { Button } from '@heroui/react';

const Profile = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile
          </h1>
          <p className="text-foreground/70">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Profile" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-foreground/70">Head Scout</p>
                <div className="divider"></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Member since:</span>
                    <span>January 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reports created:</span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Players scouted:</span>
                    <span>89</span>
                  </div>
                </div>
                <div className="card-actions justify-center mt-4">
                  <Button color="primary" size="sm">Edit Photo</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Personal Information</h2>
                <p className="card-description">Update your personal details</p>
              </div>
              <div className="card-content space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input type="text" className="input input-bordered" defaultValue="John" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input type="text" className="input input-bordered" defaultValue="Doe" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input type="email" className="input input-bordered" defaultValue="john.doe@example.com" />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input type="tel" className="input input-bordered" defaultValue="+1 (555) 123-4567" />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Position</span>
                  </label>
                  <select className="select select-bordered">
                    <option>Head Scout</option>
                    <option>Assistant Scout</option>
                    <option>Recruiting Coordinator</option>
                    <option>Coach</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea className="textarea textarea-bordered h-24" placeholder="Tell us about yourself...">
Experienced baseball scout with over 10 years in collegiate recruiting. Specialized in pitcher evaluation and development.
                  </textarea>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="bordered">Cancel</Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
