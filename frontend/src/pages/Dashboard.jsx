// =====================================================
// DASHBOARD PAGE (for normal users)
// Shows: form to book appointment + list of user's own appointments
// Allows: create, edit, delete appointments
// =====================================================

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { logout } from "../redux/authSlice";
import {
  setAppointments,
  addAppointment,
  removeAppointment,
  updateAppointmentInList,
} from "../redux/appointmentSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current user and appointments list from Redux
  const { user } = useSelector((state) => state.auth);
  const { list: appointments } = useSelector((state) => state.appointments);

  // Form state for new/editing appointment
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [editingId, setEditingId] = useState(null); // if set, we're editing not creating

  // -----------------------------------------------------
  // FETCH appointments when component first loads
  // -----------------------------------------------------
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my");
      dispatch(setAppointments(res.data.appointments));
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  // -----------------------------------------------------
  // CREATE or UPDATE appointment (form submit)
  // -----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE existing appointment
        const res = await API.put(`/appointments/${editingId}`, {
          doctorName,
          date,
          reason,
        });
        dispatch(updateAppointmentInList(res.data.appointment));
        setEditingId(null);
      } else {
        // CREATE new appointment
        const res = await API.post("/appointments", { doctorName, date, reason });
        dispatch(addAppointment(res.data.appointment));
      }

      // Clear form
      setDoctorName("");
      setDate("");
      setReason("");
    } catch (err) {
      console.error("Failed to save appointment", err);
    }
  };

  // -----------------------------------------------------
  // DELETE appointment
  // -----------------------------------------------------
  const handleDelete = async (id) => {
    try {
      await API.delete(`/appointments/${id}`);
      dispatch(removeAppointment(id));
    } catch (err) {
      console.error("Failed to delete appointment", err);
    }
  };

  // -----------------------------------------------------
  // EDIT button - fills form with existing data
  // -----------------------------------------------------
  const handleEdit = (appt) => {
    setEditingId(appt._id);
    setDoctorName(appt.doctorName);
    // Convert ISO date to YYYY-MM-DD for input field
    setDate(appt.date.split("T")[0]);
    setReason(appt.reason);
  };

  // -----------------------------------------------------
  // LOGOUT
  // -----------------------------------------------------
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Appointment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          {editingId ? "Update Appointment" : "Book Appointment"}
        </button>
      </form>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border-t">
                <td className="p-3">{appt.doctorName}</td>
                <td className="p-3">{new Date(appt.date).toLocaleDateString()}</td>
                <td className="p-3">{appt.reason}</td>
                <td className="p-3 capitalize">{appt.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(appt)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Show message if no appointments */}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No appointments yet. Book one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
