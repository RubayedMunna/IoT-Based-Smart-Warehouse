import React, { useState, useEffect } from 'react';
import { FaWater, FaFan, FaDoorOpen } from 'react-icons/fa';

function StatusCards({ sensorData, toggleDoor }) {
  const { pump, fan, servo, flame } = sensorData; // using flame instead of gasLevel

  // State to control Alert Dialog visibility
  const [showAlert, setShowAlert] = useState(false);

  // Effect to show or hide the alert dialog based on flame level
  useEffect(() => {
    // If flame level is dangerously high (greater than 300), show the alert
    if (flame < 3000 && !showAlert) {
      setShowAlert(true);
    } else if (flame > 3000 && showAlert) {
      setShowAlert(false); // Hide alert if flame level is below or equal to threshold
    }
  }, [flame, showAlert]); // Trigger effect on flame level change

  // Close the alert dialog manually
  const closeAlert = () => {
    setShowAlert(false);
  };

  const getStatusStyle = (statusType) => {
    switch (statusType) {
      case 'ON':
        return { backgroundColor: '#cce5ff', color: '#004085' }; // light blue
      case 'OFF':
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // light red
      case 'OPEN':
        return { backgroundColor: '#d4edda', color: '#155724' }; // light green
      case 'CLOSED':
        return { backgroundColor: '#ffeeba', color: '#856404' }; // light yellow
      default:
        return { backgroundColor: '#f8f9fa', color: '#333' };
    }
  };

  const renderCard = (label, icon, cardColor, statusText) => {
    const status = statusText.includes('ON') ? 'ON'
                : statusText.includes('OFF') ? 'OFF'
                : statusText.includes('OPEN') ? 'OPEN'
                : 'CLOSED';

    const statusStyle = getStatusStyle(status);

    return (
      <div
        className="card p-5 shadow rounded-4 text-dark"
        style={{
          backgroundColor: cardColor,
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="mb-3">{icon}</div>
        <h3 className="fw-bold mb-3">{label}</h3>
        <div
          className="fw-semibold"
          style={{
            width: '160px',
            fontSize: '1.25rem',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center',
            ...statusStyle,
          }}
        >
          {statusText}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* Flame Level Alert Dialog */}
      {showAlert && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '10px',
            padding: '20px 30px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            color: '#721c24',
            width: 'auto',
            maxWidth: '600px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: 'bold' }}>⚠️ FLAME LEVEL ALERT</h4>
            <button
              onClick={closeAlert}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#721c24',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
          <p style={{ marginTop: '10px' }}>
            Flame level is dangerously high ({flame}). Please take immediate action!
          </p>
        </div>
      )}

      {/* Status Cards Row */}
      <div className="row text-center mb-5 mt-4">
        {/* Pump */}
        <div className="col-md-4 mb-4">
          {renderCard(
            'Pump',
            <FaWater size={90} />,
            '#e9f7fd', // soft neutral for pump card
            pump ? 'ON' : 'OFF'
          )}
        </div>

        {/* Fan */}
        <div className="col-md-4 mb-4">
          {renderCard(
            'Fan',
            <FaFan size={90} />,
            '#fef9e7', // soft yellow tone
            fan ? 'ON' : 'OFF'
          )}
        </div>

        {/* Door */}
        <div className="col-md-4 mb-4">
          {renderCard(
            'Door',
            <FaDoorOpen size={90} />,
            '#f3f8f4', // soft green tint
            servo === 90 ? 'OPEN (90°)' : 'CLOSED (0°)'
          )}
        </div>
      </div>

      {/* Toggle Door Button Row */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-4 text-center">
          <div
            className="card p-5 shadow rounded-4"
            style={{
              background: 'linear-gradient(145deg, #f0f4f8, #ffffff)',
              border: '1px solid #d1d9e6',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
              color: '#2c3e50',
            }}
          >
            <h4
              className="mb-4 fw-semibold"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
              }}
            >
              Door Control Panel
            </h4>
            <button
              onClick={toggleDoor}
              className="fw-semibold px-5 py-3 border-0 rounded-pill"
              style={{
                backgroundColor: servo === 90 ? '#c0392b' : '#198754', // Bootstrap green/red
                color: '#fff',
                fontSize: '1.05rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = servo === 90 ? '#a93226' : '#157347')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = servo === 90 ? '#c0392b' : '#198754')
              }
            >
              {servo === 90 ? '🔒 Close Door' : '🔓 Open Door'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusCards;
