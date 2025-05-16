import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import Card from './Card';
import { ChartData } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  data: ChartData;
  type: ChartType;
  height?: number;
  action?: React.ReactNode;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  data,
  type,
  height = 300,
  action,
  className = '',
}) => {
  const renderChart = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          align: 'end' as const,
          labels: {
            boxWidth: 12,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#111827',
          bodyColor: '#111827',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
        },
      },
      scales: type === 'bar' || type === 'line' ? {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6',
          },
        },
      } : undefined,
    };

    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} height={height} />;
      case 'line':
        return <Line data={data} options={options} height={height} />;
      case 'pie':
        return <Pie data={data} options={options} height={height} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} height={height} />;
      default:
        return <Bar data={data} options={options} height={height} />;
    }
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={action}
      className={`${className}`}
    >
      <div style={{ height: `${height}px` }} className="mt-2">
        {renderChart()}
      </div>
    </Card>
  );
};

export default ChartContainer;