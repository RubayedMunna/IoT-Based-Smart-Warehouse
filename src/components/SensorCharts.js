import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, type: 'linear' },
    y: { beginAtZero: true, type: 'category' }
  },
};

const createChartData = (label, value) => ({
  labels: [label],
  datasets: [
    {
      label,
      data: [value],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
});

function SensorCharts({ sensorData }) {
  return (
    <div className="row text-center mb-4">
      {['flame', 'mq2', 'mq135', 'humidity'].map((key) => (
        <div className="col-md-3" key={key}>
          <div className="card shadow p-3">
            <h5>{key.toUpperCase()}</h5>
            <Bar data={createChartData(key.toUpperCase(), sensorData[key])} options={chartOptions} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SensorCharts;
