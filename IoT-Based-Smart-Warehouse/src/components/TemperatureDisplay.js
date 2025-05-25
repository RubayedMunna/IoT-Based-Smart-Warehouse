import React from 'react';
import { ThermometerSun } from 'lucide-react';

function TemperatureDisplay({ value }) {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card text-white text-center shadow-lg border-0 rounded-4 p-5"
            style={{
              background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="d-flex align-items-center justify-content-center mb-3">
              <ThermometerSun size={36} className="me-2 text-warning" />
              <h4 className="mb-0 fw-semibold">Current Temperature</h4>
            </div>
            <h1 className="display-3 fw-bold">{value.toFixed(1)} °C</h1>
            <p className="mt-3 fs-5 text-light">Stay hydrated and safe!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemperatureDisplay;
