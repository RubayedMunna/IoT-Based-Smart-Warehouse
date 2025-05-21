import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [sensorData, setSensorData] = useState({
    flame: null,
    mq2: null,
    mq135: null,
    temperature: null,
    humidity: null,
    pump: null,
    fan: null,
    servo: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const channelId = '2968873';
  const readApiKey = 'ID3RHY8FE9VFNGQF';
  const talkBackId = '54806';
  const talkBackApiKey = '37XIT8J7J51VN4CO';
  const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=1`;
  const talkBackQueueUrl = `https://api.thingspeak.com/talkbacks/${talkBackId}/commands.json?api_key=${talkBackApiKey}`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      const latestFeed = data.feeds[0];
      setSensorData({
        flame: parseInt(latestFeed.field1) || 0,
        mq2: parseInt(latestFeed.field2) || 0,
        mq135: parseInt(latestFeed.field3) || 0,
        temperature: parseFloat(latestFeed.field4) || 0,
        humidity: parseFloat(latestFeed.field5) || 0,
        pump: parseInt(latestFeed.field6) || 0,
        fan: parseInt(latestFeed.field7) || 0,
        servo: parseInt(latestFeed.field8) || 0,
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch data from ThingSpeak');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTalkBackQueue = async () => {
    try {
      const response = await fetch(talkBackQueueUrl);
      if (!response.ok) throw new Error(`TalkBack queue error: ${response.status}`);
      const queue = await response.json();
      console.log('TalkBack Queue:', queue);
    } catch (err) {
      console.error('Failed to fetch TalkBack queue:', err);
    }
  };

  const sendTalkBackCommand = async (command) => {
    try {
      const response = await fetch(`https://api.thingspeak.com/talkbacks/${talkBackId}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: talkBackApiKey, command_string: command, position: 1 }),
      });
      if (!response.ok) throw new Error(`TalkBack HTTP error: ${response.status}`);
      console.log(`Sent ${command} command to TalkBack`);
    } catch (err) {
      setError('Failed to send command to TalkBack');
      console.error(err);
    }
  };

  const toggleDoor = () => {
    const newCommand = sensorData.servo === 90 ? 'CLOSE' : 'OPEN';
    sendTalkBackCommand(newCommand);
  };

  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(fetchData, 15000);
    return () => clearInterval(dataInterval);
  }, []);

  useEffect(() => {
    fetchTalkBackQueue();
    const tbInterval = setInterval(fetchTalkBackQueue, 5000);
    return () => clearInterval(tbInterval);
  }, []);

  const createHorizontalChart = (label, value, max = 100) => ({
    labels: [label],
    datasets: [
      {
        label: label,
        data: [value],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">ThingSpeak IoT Monitor</h1>
      {loading && <p className="text-center">Loading data...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {!loading && !error && (
        <>
          <div className="row text-center mb-4">
            <div className="col-md-3">
              <div className="card shadow p-3">
                <h5>Flame Sensor</h5>
                <Bar data={createHorizontalChart('Flame', sensorData.flame)} options={chartOptions} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3">
                <h5>MQ2 Sensor</h5>
                <Bar data={createHorizontalChart('MQ2', sensorData.mq2)} options={chartOptions} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3">
                <h5>MQ135 Sensor</h5>
                <Bar data={createHorizontalChart('MQ135', sensorData.mq135)} options={chartOptions} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3">
                <h5>Humidity</h5>
                <Bar data={createHorizontalChart('Humidity', sensorData.humidity)} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="row text-center mb-4">
            <div className="col-md-4 offset-md-4">
              <div className="card bg-light p-3 shadow">
                <h4>Temperature</h4>
                <h2 className="text-primary">{sensorData.temperature.toFixed(1)} °C</h2>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-md-4">
              <div className={`card p-3 shadow ${sensorData.pump ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                <h5>Pump</h5>
                <p className="fs-5">{sensorData.pump ? 'ON' : 'OFF'}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card p-3 shadow ${sensorData.fan ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                <h5>Fan</h5>
                <p className="fs-5">{sensorData.fan ? 'ON' : 'OFF'}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`card p-3 shadow ${sensorData.servo === 90 ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                <h5>Door</h5>
                <p className="fs-5">{sensorData.servo === 90 ? 'OPEN (90°)' : 'CLOSED (0°)'}</p>
                <button className="btn btn-outline-light mt-2" onClick={toggleDoor}>
                  Toggle Door
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;