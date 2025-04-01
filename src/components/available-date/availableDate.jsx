import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AvailableDate = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    availableDate: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    doctor: '',
    availableDate: ''
  });
  const [selectedAvailableDateId, setSelectedAvailableDateId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchAvailableDates();
    fetchDoctors();
  }, []);

  const fetchAvailableDates = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-dates/all`)
      .then(response => {
        setAvailableDates(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchDoctors = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/doctors/all`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-dates/delete/${id}`)
        .then(response => {
          setAvailableDates(availableDates.filter(item => item.id !== id));
          noti("Available Date removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedAvailableDateId(id);
    const selectedAvailableDate = availableDates.find(item => item.id === id);
    if (selectedAvailableDate) {
      // Assume the doctor field in selectedAvailableDate is an object; extract its id.
      setUpdateFormData({
        doctor: selectedAvailableDate.doctor ? selectedAvailableDate.doctor.id : '',
        availableDate: selectedAvailableDate.availableDate
      });
      setShowUpdateForm(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If your API expects the doctor as an object, convert the id to an object:
    const submitData = {
      ...formData,
      doctor: { id: formData.doctor }
    };
    axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-dates/save`, submitData)
      .then(response => {
        fetchAvailableDates();
        setFormData({
          doctor: '',
          availableDate: ''
        });
        noti("Available Date added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...updateFormData,
      doctor: { id: updateFormData.doctor }
    };
    axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-dates/update/${selectedAvailableDateId}`, submitData)
      .then(response => {
        fetchAvailableDates();
        setUpdateFormData({  
          doctor: '',
          availableDate: ''
        });
        noti("Available Date updated successfully!", "success");
        setShowUpdateForm(false);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  const handleDoctorChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      doctor: e.target.value
    }));
  };

  return (
    <div>
      <div className="container">
        <h3 className='item-title'>Available Date Panel</h3>
        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Available Date</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {availableDates.map(item => (
              <tr key={item.id} className='item-data'>
                <td>{item.doctor ? item.doctor.name : 'Unknown Doctor'}</td>
                <td>{item.availableDate}</td>
                <td>
                  <button className='remove' onClick={() => handleDelete(item.id)}>
                    <IoIosRemoveCircle />
                  </button>
                </td>
                <td>
                  <button className='update' onClick={() => handleUpdateClick(item.id)}>
                    <FaRegEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showUpdateForm && (
          <div className='item-update'>
            <div className="notification">
              <button className='item-update-button' type="button" onClick={handleUpdateClose}>
                <IoIosCloseCircle />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className='updateForm'>
              <select name='doctor' value={updateFormData.doctor} onChange={(e) => setUpdateFormData({...updateFormData, doctor: e.target.value})}>
                <option value=''>Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
              <div className='flx'>
                <span>Available Date</span>
                <input type="date" name='availableDate' value={updateFormData.availableDate} onChange={(e) => setUpdateFormData({...updateFormData, availableDate: e.target.value})} placeholder="Available Date" />
              </div>
              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Available Date</h3>
          <form onSubmit={handleSubmit} className='saveForm'>
            <select name='doctor' onChange={handleDoctorChange} value={formData.doctor}>
              <option value=''>Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
            <div className='flx'>
              <span>Available Date</span>
              <input type="date" name='availableDate' value={formData.availableDate} onChange={handleChange} placeholder="Available Date" />
            </div>
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AvailableDate;
