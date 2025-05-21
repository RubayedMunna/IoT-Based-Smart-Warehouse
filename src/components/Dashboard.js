import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchThingSpeakData,
  fetchTalkBackQueue,
  sendTalkBackCommand
} from '../services/api';
import SensorCharts from './SensorCharts';
import StatusCards from './StatusCards';
import TemperatureDisplay from './TemperatureDisplay';

function Dashboard() {
  const [sensorData, setSensorData] = useState({
    flame: 0, mq2: 0, mq135: 0, temperature: 0,
    humidity: 0, pump: 0, fan: 0, servo: 0,
  });

  const [sensorHistory, setSensorHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const toggleDoor = () => {
    const command = sensorData.servo === 90 ? 'CLOSE' : 'OPEN';
    sendTalkBackCommand(command)
      .then(() => setStatusMessage(`Door command '${command}' sent`))
      .catch(() => setError('Failed to send TalkBack command'));
  };

 

  const updateThingSpeakData = useCallback(async () => {
  try {
    setLoading(true);
    const data = await fetchThingSpeakData();

    const isValid = Object.values(data).every(val => val !== null && val !== undefined && val !== '');
    if (isValid) {
      setSensorData(data);
      setSensorHistory(prev => [data, ...prev.slice(0, 9)]);
      setStatusMessage('Status updated from ThingSpeak');
    } else if (sensorHistory.length > 0) {
      setSensorData(sensorHistory[0]);
      setStatusMessage('Used last known good data due to null values');
    }

    setError(null);
  } catch {
    if (sensorHistory.length > 0) {
      setSensorData(sensorHistory[0]);
      setStatusMessage('Used last known good data due to fetch error');
    } else {
      setError('Failed to fetch data from ThingSpeak');
    }
  } finally {
    setLoading(false);
  }
}, [sensorHistory]);


 const updateTalkBackData = useCallback(async () => {
  try {
    const tbData = await fetchTalkBackQueue();
    const latestCommand = tbData?.[0]?.command_string;

    if (latestCommand === 'OPEN' || latestCommand === 'CLOSE') {
      const newServo = latestCommand === 'OPEN' ? 90 : 0;
      setSensorData(prev => ({ ...prev, servo: newServo }));
      setStatusMessage(`Door status updated: ${latestCommand}`);
    }
  } catch {
    // handle error silently
  }
}, []);


useEffect(() => {
  updateThingSpeakData();
  const tsInterval = setInterval(updateThingSpeakData, 15000);
  return () => clearInterval(tsInterval);
}, [updateThingSpeakData]);

useEffect(() => {
  updateTalkBackData();
  const tbInterval = setInterval(updateTalkBackData, 5000);
  return () => clearInterval(tbInterval);
}, [updateTalkBackData]);

  return (
    <>
      {loading && <p className="text-center">Loading data...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {statusMessage && !loading && <p className="text-center text-success">{statusMessage}</p>}

      {!loading && !error && (
        <>
          <SensorCharts sensorData={sensorData} />
          <TemperatureDisplay value={sensorData.temperature} />
          <StatusCards sensorData={sensorData} toggleDoor={toggleDoor} />
        </>
      )}
    </>
  );
}

export default Dashboard;
