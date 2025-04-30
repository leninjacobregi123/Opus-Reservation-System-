// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

const BACKEND_URL = 'http://localhost:5000/api';

function App() {
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userName, setUserName] = useState('');

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/seats`);
      setSeats(response.data.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching seats:", error);
      setMessage("Error fetching seats.");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/reservations`);
      setReservations(response.data.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setMessage("Error fetching reservations.");
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchSeats(), fetchReservations()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleReserve = (seat) => {
    if (seat.status !== 'available') {
      setMessage("Seat already reserved!");
      return;
    }
    setSelectedSeat(seat);
  };

  const confirmReservation = async () => {
    if (!userName || !selectedSeat) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/reserve`, {
        seat_id: selectedSeat.id,
        user_name: userName,
      });
      setMessage(response.data.message);
      setSelectedSeat(null);
      setUserName('');
      refreshData();
    } catch (error) {
      console.error("Reservation error:", error);
      setMessage("Reservation failed: " + (error?.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🎟️ Book My Seat</h1>
        {message && <p className="message">{message}</p>}
      </header>

      {loading ? (
        <p className="loading-text">Loading seats...</p>
      ) : (
        <>
          <div className="seat-grid">
            {seats.map((seat) => (
              <motion.div
                key={seat.id}
                className={`seat-card ${seat.status}`}
                whileHover={{ scale: seat.status === 'available' ? 1.05 : 1 }}
                onClick={() => handleReserve(seat)}
              >
                <h2>Seat {seat.seat_number}</h2>
                <p>Status: {seat.status}</p>
              </motion.div>
            ))}
          </div>

          <div className="reservation-list">
            <h2>📋 Reservation History</h2>
            {reservations.length === 0 ? (
              <p>No reservations yet.</p>
            ) : (
              <ul>
                {reservations.map((res) => (
                  <li key={res.reservation_id}>
                    <strong>{res.user_name}</strong> reserved Seat <strong>{res.seat_number}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {selectedSeat && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reserve Seat {selectedSeat.seat_number}</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedSeat(null);
                  setUserName('');
                }}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmReservation}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
