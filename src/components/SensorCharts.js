import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

// Color mapping for each sensor with improved palette
const doughnutColors = {
  flame: ['#FF6F00', '#F0F0F0'],     // Deep Orange
  mq2: ['#66BB6A', '#F0F0F0'],       // Medium Green
  mq135: ['#4BC0C0', '#F0F0F0'],     // Teal
  humidity: ['#42A5F5', '#F0F0F0'],  // Sky Blue
};

// Friendly sensor labels
const sensorLabels = {
  flame: 'Flame Sensor',
  mq2: 'MQ-2 Gas Sensor',
  mq135: 'MQ-135 Air Quality',
  humidity: 'Humidity Sensor',
};

// Descriptions for each sensor
const sensorDescriptions = {
  flame: 'Detects presence of flame or fire in the environment.',
  mq2: 'Monitors combustible gases like LPG, smoke, and methane.',
  mq135: 'Measures air quality by detecting various harmful gases.',
  humidity: 'Tracks ambient humidity levels for environmental control.',
};

const createDoughnutChartData = (key, value) => ({
  labels: [sensorLabels[key], 'Remaining'],
  datasets: [
    {
      data: [value, 100 - value],
      backgroundColor: doughnutColors[key] || ['#999', '#E0E0E0'],
      borderWidth: 0,
    },
  ],
});

const doughnutOptions = {
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.label}: ${tooltipItem.raw}%`;
        }
      }
    }
  }
};

function SensorCharts({ sensorData }) {
  return (
    <div className="row text-center mb-4">
      {['flame', 'mq2', 'mq135', 'humidity'].map((key) => (
        <div className="col-md-3" key={key}>
          <div className="card border-0 shadow-lg h-100">
            <div className="card-body">
              <h5 className="card-title text-primary fw-bold">{sensorLabels[key]}</h5>
              <p className="card-text text-muted small">{sensorDescriptions[key]}</p>
              <div style={{ width: '100%', maxWidth: 200, margin: '0 auto' }}>
                <Doughnut
                  data={createDoughnutChartData(key, sensorData[key])}
                  options={doughnutOptions}
                />
              </div>
              <p className="mt-3 fw-semibold">Current Level: {sensorData[key]}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SensorCharts;
