// ADMIN PANEL
// Shows ALL appointments from ALL users (admin-only access)
// This covers "admin panel with role-based permissions" from QPP project

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { logout } from "../redux/authSlice";

function AdminPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Local state to hold ALL appointments (admin view)
  const [allAppointments, setAllAppointments] = useState([]);

  // Fetch all appointments when page loads
  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      // GET /api/appointments/all - only works if role === admin (checked by backend middleware)
      const res = await API.get("/appointments/all");
      setAllAppointments(res.data.appointments);
    } catch (err) {
      console.error("Failed to fetch all appointments", err);
    }
  };

  // Update appointment status (e.g. pending -> confirmed)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/appointments/${id}`, { status: newStatus });
      // Refresh list after update
      fetchAllAppointments();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Panel - Welcome, {user?.name}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <p className="mb-4 text-gray-600">
        Showing ALL appointments from ALL users (admin-only view)
      </p>

      {/* All Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {allAppointments.map((appt) => (
              <tr key={appt._id} className="border-t">
                {/* userId is populated with {name, email} from backend */}
                <td className="p-3">{appt.userId?.name}</td>
                <td className="p-3">{appt.userId?.email}</td>
                <td className="p-3">{appt.doctorName}</td>
                <td className="p-3">{new Date(appt.date).toLocaleDateString()}</td>
                <td className="p-3">{appt.reason}</td>
                <td className="p-3">
                  {/* Dropdown to change status directly from admin panel */}
                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}

            {allAppointments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No appointments in the system yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
