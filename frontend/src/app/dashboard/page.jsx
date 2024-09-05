import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="space-y-4">
        <div className="card">
          <div className="card-body">
            <h4>Your Profile</h4>
            <p>Your profile information will be displayed here.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h4>Account Settings</h4>
            <p>Manage your account settings and preferences here.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary">Update Settings</button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h4>Recent Activity</h4>
            <p>View your recent activity and updates.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary">View Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}
