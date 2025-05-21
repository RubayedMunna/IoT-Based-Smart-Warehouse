import React from 'react';

const DoorControlCard = ({ isOpen, onToggle }) => (
  <div className={`card p-3 shadow ${isOpen ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
    <h5>Door</h5>
    <p className="fs-5">{isOpen ? 'OPEN (90°)' : 'CLOSED (0°)'}</p>
    <button className="btn btn-outline-light mt-2" onClick={onToggle}>
      Toggle Door
    </button>
  </div>
);

export default DoorControlCard;
