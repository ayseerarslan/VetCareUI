import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    animal: '',
    doctor: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    appointmentDate: '',
    animal: '',
    doctor: ''
  });
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const noti = (message, type) => toast(message, { type });

  useEffect(() => {
    fetchAppointments();
    fetchAnimals();
    fetchDoctors();
  }, []);

  const fetchAppointments = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointments/all`)
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const fetchAnimals = () => {
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/animals/all`)
      .then(response => {
        setAnimals(response.data);
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
      axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointments/delete/${id}`)
        .then(response => {
          setAppointments(appointments.filter(appointment => appointment.id !== id));
          noti("Appointment removed successfully!", "success");
        })
        .catch(error => {
          noti(error.response.data.message, "error");      
        });
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedAppointmentId(id);
    const selectedAppointment = appointments.find(appointment => appointment.id === id);
    if (selectedAppointment) {
      // Extract the ids from the animal and doctor objects if available.
      setUpdateFormData({
        appointmentDate: selectedAppointment.appointmentDate,
        animal: selectedAppointment.animal ? selectedAppointment.animal.id : '',
        doctor: selectedAppointment.doctor ? selectedAppointment.doctor.id : ''
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
    // Convert the selected animal and doctor ids to objects if needed.
    const submitData = {
      appointmentDate: formData.appointmentDate,
      animal: { id: formData.animal },
      doctor: { id: formData.doctor }
    };
    axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointments/save`, submitData)
      .then(response => {
        fetchAppointments();
        setFormData({
          appointmentDate: '',
          animal: '',
          doctor: ''
        });
        noti("Appointment added successfully!", "success");
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      appointmentDate: updateFormData.appointmentDate,
      animal: { id: updateFormData.animal },
      doctor: { id: updateFormData.doctor }
    };
    axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointments/update/${selectedAppointmentId}`, submitData)
      .then(response => {
        fetchAppointments();
        setUpdateFormData({
          appointmentDate: '',
          animal: '',
          doctor: ''
        });
        noti("Appointment updated successfully!", "success");
        setShowUpdateForm(false);
      })
      .catch(error => {
        noti(error.response.data.message, "error");      
      });
  };

  const handleUpdateClose = () => {
    setShowUpdateForm(false);
  };

  const handleAnimalChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      animal: e.target.value
    }));
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
        <h3 className='item-title'>Appointment Panel</h3>
        <ToastContainer />

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Animal</th>
              <th>Doctor</th>
              <th>Delete</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(item => (
              <tr key={item.id} className='item-data'>
                <td>{item.appointmentDate}</td>
                <td>{item.animal ? item.animal.name : 'Unknown animal'}</td>
                <td>{item.doctor ? item.doctor.name : 'Unknown doctor'}</td>
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
              <select
                name='animal'
                value={updateFormData.animal}
                onChange={(e) => setUpdateFormData({ ...updateFormData, animal: e.target.value })}
              >
                <option value=''>Select animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name}</option>
                ))}
              </select>

              <select
                name='doctor'
                value={updateFormData.doctor}
                onChange={(e) => setUpdateFormData({ ...updateFormData, doctor: e.target.value })}
              >
                <option value=''>Select doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>

              <div className='flx'>
                <span>Appointment Date</span>
                <input
                  type="datetime-local"
                  name='appointmentDate'
                  value={updateFormData.appointmentDate}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, appointmentDate: e.target.value })}
                />
              </div>
              <button className='item-update-button' type="submit">Update</button>
            </form>
          </div>
        )}

        <div className='item-add'>
          <h3 className='item-title'>Add Appointment</h3>
          <form onSubmit={handleSubmit} className='saveForm'>
            <div className='flx'>
              <span>Appointment Date</span>
              <input
                type="datetime-local"
                name='appointmentDate'
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </div>
            <select name='animal' onChange={handleAnimalChange} value={formData.animal}>
              <option value=''>Select animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>{animal.name}</option>
              ))}
            </select>
            <select name='doctor' onChange={handleDoctorChange} value={formData.doctor}>
              <option value=''>Select doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
            <button className='item-add-button' type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
