import React from 'react';

export default function DashboardPreview() {
  return (
    <div className="relative w-full max-w-3xl">
      <div className="relative z-10">
        <img
          src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          alt="FDA Tracker Dashboard Preview"
          className="w-full rounded-xl shadow-2xl"
        />
      </div>
      <div className="absolute -bottom-6 -left-6 -right-6 -top-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 blur-2xl"></div>
    </div>
  );
}