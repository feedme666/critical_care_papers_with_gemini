import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ChartJSの登録は、このコンポーネントが使われる際に一度だけ実行される
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SafeBarChart = ({ options, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;

    // コンポーネントがアンマウントされる際にチャートを確実に破棄する
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []); // 依存配列を空にして、マウント時とアンマウント時にのみ実行

  if (!data) {
    return null;
  }

  // 毎回新しいコンポーネントが作られるので、ユニークなIDは不要になる
  return <Bar ref={chartRef} options={options} data={data} />;
};

export default SafeBarChart;