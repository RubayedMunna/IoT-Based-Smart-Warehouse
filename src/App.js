import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">ThingSpeak IoT Monitor(s)</h1>
      <Dashboard />
    </div>
  );
}

export default App;
