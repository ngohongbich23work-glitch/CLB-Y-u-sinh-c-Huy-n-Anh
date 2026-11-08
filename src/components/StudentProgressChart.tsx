import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Student, MONTHS_CONFIG, MonthMeta, getStudentMonthlyAverage } from '../data/studentsData';
import { TrendingUp, BarChart2, Calendar, Award } from 'lucide-react';

// Đăng ký các module Chart.js cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudentProgressChartProps {
  student: Student;
  allStudents: Student[];
  monthsConfig?: MonthMeta[];
  compact?: boolean;
}

export const StudentProgressChart: React.FC<StudentProgressChartProps> = ({
  student,
  allStudents,
  monthsConfig = MONTHS_CONFIG,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'all_tests'>('monthly');

  // 1. Dữ liệu theo Tháng
  const monthlyData = monthsConfig.map(m => {
    const studentAvg = getStudentMonthlyAverage(student, m.id, monthsConfig);
    const classScores = allStudents
      .map(s => getStudentMonthlyAverage(s, m.id, monthsConfig))
      .filter((avg): avg is number => typeof avg === 'number' && !isNaN(avg));
    const classAvg = classScores.length > 0
      ? Number((classScores.reduce((a, b) => a + b, 0) / classScores.length).toFixed(2))
      : 7.0;

    return {
      label: m.name,
      studentScore: studentAvg !== null ? Number(studentAvg.toFixed(2)) : null,
      classAvg,
    };
  });

  // 2. Dữ liệu chi tiết từng bài thi
  const allTests = monthsConfig.flatMap(m => m.tests);
  const testData = allTests.map(t => {
    const res = student.results[t.id];
    const hasScore = res && res.score !== null && res.score !== undefined && typeof res.score === 'number' && !isNaN(res.score);
    const studentScore = hasScore ? res.score : null;
    const classScores = allStudents
      .map(s => s.results[t.id]?.score)
      .filter((s): s is number => typeof s === 'number' && !isNaN(s));
    const classAvg = classScores.length > 0
      ? Number((classScores.reduce((a, b) => a + b, 0) / classScores.length).toFixed(2))
      : 7.0;

    return {
      label: t.title,
      studentScore: studentScore !== null ? Number(studentScore.toFixed(2)) : null,
      classAvg,
      topic: t.topic,
    };
  });

  const activePoints = viewMode === 'monthly' ? monthlyData : testData;

  const chartData = {
    labels: activePoints.map(p => p.label),
    datasets: [
      {
        label: `Điểm của ${student.name}`,
        data: activePoints.map(p => p.studentScore),
        borderColor: '#132A13',
        backgroundColor: 'rgba(144, 169, 85, 0.20)',
        borderWidth: 3,
        pointBackgroundColor: '#132A13',
        pointBorderColor: '#ECF39E',
        pointBorderWidth: 2,
        pointRadius: compact ? 4 : 5.5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#31572C',
        pointHoverBorderColor: '#ffffff',
        fill: true,
        tension: 0.35,
        spanGaps: true,
      },
      {
        label: 'Trung bình lớp',
        data: activePoints.map(p => p.classAvg),
        borderColor: '#4F772D',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 4],
        pointRadius: 3,
        pointBackgroundColor: '#4F772D',
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: compact ? 10.5 : 12,
            weight: 'bold' as const,
          },
          color: '#132A13',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(19, 42, 19, 0.95)',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const val = context.parsed.y !== null ? context.parsed.y.toFixed(2).replace('.', ',') : '';
            return ` ${label}: ${val} / 10`;
          },
          afterBody: function (contexts) {
            const idx = contexts[0]?.dataIndex;
            if (viewMode === 'all_tests' && allTests[idx]) {
              return [`Chuyên đề: ${allTests[idx].topic}`];
            }
            return [];
          },
        },
      },
    },
    scales: {
      y: {
        min: 4,
        max: 10,
        ticks: {
          stepSize: 1,
          font: { size: compact ? 9.5 : 11, family: 'monospace' },
          color: '#64748b',
          callback: function (val) {
            return `${val}.0`;
          },
        },
        grid: {
          color: '#e2e8f0',
        },
      },
      x: {
        ticks: {
          font: { size: compact ? 9.5 : 11, weight: 'bold' },
          color: '#334155',
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className={compact ? "bg-slate-50/70 rounded-xl border border-slate-200 p-3" : "bg-white rounded-2xl border border-[#90A955]/30 p-5 shadow-xs"}>
      <div className={`flex flex-wrap items-center justify-between gap-3 ${compact ? 'mb-2' : 'mb-4'}`}>
        <div>
          <h3 className={`${compact ? 'text-[12px]' : 'text-sm'} font-extrabold text-[#132A13] uppercase tracking-wider flex items-center gap-1.5`}>
            <TrendingUp className="w-4 h-4 text-[#31572C]" />
            Biểu Đồ Tiến Bộ Cá Nhân Hóa (Chart.js)
          </h3>
          <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-[#4F772D] font-medium`}>
            {viewMode === 'monthly'
              ? 'Diễn biến điểm trung bình từng tháng so với trung bình lớp'
              : 'Theo dõi chi tiết điểm số từng bài luyện đề thực chiến'}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'monthly'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-slate-600 hover:text-[#132A13]'
            }`}
          >
            Theo Tháng
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all_tests')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'all_tests'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-slate-600 hover:text-[#132A13]'
            }`}
          >
            Tất Cả Bài ({allTests.length})
          </button>
        </div>
      </div>

      {/* Chart.js Canvas Container */}
      <div style={{ height: compact ? '200px' : '260px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
