import React from 'react';

function StatusCards({ sensorData, toggleDoor }) {
  const { pump, fan, servo } = sensorData;
  return (
    <div className="row text-center">
      <div className="col-md-4">
        <div className={`card p-3 shadow ${pump ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
          <h5>Pump</h5>
          <p className="fs-5">{pump ? 'ON' : 'OFF'}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card p-3 shadow ${fan ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
          <h5>Fan</h5>
          <p className="fs-5">{fan ? 'ON' : 'OFF'}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className={`card p-3 shadow ${servo === 90 ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
          <h5>Door</h5>
          <p className="fs-5">{servo === 90 ? 'OPEN (90°)' : 'CLOSED (0°)'}</p>
          <button className="btn btn-outline-light mt-2" onClick={toggleDoor}>
            Toggle Door
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusCards;
