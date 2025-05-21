import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
        <div className="container mt-5">
      <div
        className="text-center mb-4 p-4 rounded-4 shadow"
        style={{
          background: 'linear-gradient(135deg, #4e54c8, #8f94fb)', // professional purple-blue gradient
          color: 'white',
          fontWeight: '700',
          fontSize: '1.8rem',
          userSelect: 'none',
        }}
      >
        Live Monitoring of Smart Warehouse
      </div>
      <Dashboard />
    </div>

  );
}

export default App;
