import React, { useState, useEffect } from 'react';
import axios from './api/axios';
import Swal from 'sweetalert2';

const ScheduleTab = () => {
  const [schedule, setSchedule] = useState([]);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  const resetForm = () => {
    setDay('');
    setStartTime('');
    setEndTime('');
  };
  
  useEffect(() => {
    fetchSchedule();
  }, []);

  const showError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#967D6C'
    });
  };

  const showSuccess = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonColor: '#967D6C'
    });
  };

  const showDeleteConfirmation = (scheduleId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#967D6C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(scheduleId);
      }
    });
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/vets/schedule', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSchedule(response.data.schedule);
    } catch (err) {
      console.error('Fetch schedule error:', err);
      showError(err.response?.data?.message || 'Failed to load schedule. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const validateTimes = (start, end) => {
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    return startDate < endDate;
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!day || !startTime || !endTime) {
      showError('Please fill in all fields');
      return;
    }

    if (!validateTimes(startTime, endTime)) {
      showError('End time must be after start time');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        '/vets/schedule/add',
        {
          day,
          startTime,
          endTime
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSchedule(response.data.schedule);
      resetForm();
      showSuccess('Schedule added successfully');
    } catch (err) {
      console.error('Add schedule error:', err);
      showError(err.response?.data?.message || 'Failed to add schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingSchedule(entry);
    setDay(entry.day);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!day || !startTime || !endTime) {
      showError('Please fill in all fields');
      return;
    }

    if (!validateTimes(startTime, endTime)) {
      showError('End time must be after start time');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        '/vets/schedule/update',
        {
          scheduleId: editingSchedule._id,
          day,
          startTime,
          endTime
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSchedule(response.data.schedule);
      resetForm();
      showSuccess('Schedule updated successfully');
    } catch (err) {
      console.error('Update schedule error:', err);
      showError(err.response?.data?.message || 'Failed to update schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      const response = await axios.delete(`/vets/schedule/delete/${scheduleId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setSchedule(response.data.schedule);
      showSuccess('Schedule deleted successfully');
    } catch (err) {
      console.error('Delete schedule error:', err);
      showError(err.response?.data?.message || 'Failed to delete schedule. Please try again.');
    }
  };

  const formatTime = (time) => {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Time formatting error:', err);
      return time;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Manage Schedule</h2>
      
      <form onSubmit={editingSchedule ? handleUpdate : handleAddSchedule} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white"
            required
          >
            <option value="">Select Day</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded-lg p-2 w-full"
            required
            aria-label="Start Time"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded-lg p-2 w-full"
            required
            aria-label="End Time"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#967D6C] text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#876D5C] transition-colors"
          >
            {isSubmitting ? 'Processing...' : editingSchedule ? 'Update Schedule' : 'Add Schedule'}
          </button>

          {editingSchedule && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Schedule</h3>
        {schedule.length === 0 ? (
          <p className="text-gray-500">No schedule entries yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schedule.map((entry) => (
              <div
                key={entry._id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="font-medium text-lg mb-2">{entry.day}</div>
                <div className="text-gray-600 mb-3">
                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => showDeleteConfirmation(entry._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTab;