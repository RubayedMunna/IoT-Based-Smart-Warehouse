import React from 'react';

function TemperatureDisplay({ value }) {
  return (
    <div className="row text-center mb-4">
      <div className="col-md-4 offset-md-4">
        <div className="card bg-light p-3 shadow">
          <h4>Temperature</h4>
          <h2 className="text-primary">{value.toFixed(1)} °C</h2>
        </div>
      </div>
    </div>
  );
}

export default TemperatureDisplay;
