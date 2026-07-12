import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Award, BookOpen, Users, TrendingUp } from 'lucide-react';
import './ViewReports.css';

const enrollmentTrends = [
  { month: 'Jan', students: 120 },
  { month: 'Feb', students: 150 },
  { month: 'Mar', students: 210 },
  { month: 'Apr', students: 290 },
  { month: 'May', students: 380 },
  { month: 'Jun', students: 490 },
];

const programPopularity = [
  { name: 'Web Dev', value: 2340, color: '#2563EB' },
  { name: 'Data Science', value: 1890, color: '#7C3AED' },
  { name: 'UI/UX Design', value: 1560, color: '#EC4899' },
  { name: 'ML', value: 980, color: '#8B5CF6' },
  { name: 'App Dev', value: 1230, color: '#10B981' },
];

const completionRate = [
  { name: 'Completed', value: 72, color: '#10B981' },
  { name: 'In Progress', value: 20, color: '#F59E0B' },
  { name: 'Dropped', value: 8, color: '#EF4444' },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 250000 },
  { month: 'Feb', revenue: 310000 },
  { month: 'Mar', revenue: 420000 },
  { month: 'Apr', revenue: 580000 },
  { month: 'May', revenue: 760000 },
  { month: 'Jun', revenue: 980000 },
];

const ViewReports = () => {
  return (
    <div className="view-reports">
      <div className="view-reports__header animate-fadeInUp">
        <h1>Platform Analytics & Reports</h1>
        <p>Monitor cohort enrollment curves, category revenues, completion indices, and demographics.</p>
      </div>

      {/* Analytics widgets */}
      <div className="view-reports__widgets animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue"><TrendingUp size={22} /></div>
          <div className="stats-card__info">
            <h3>+24%</h3>
            <p>Enrollment Growth MoM</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green"><DollarSign size={22} /></div>
          <div className="stats-card__info">
            <h3>₹9.8 Lakhs</h3>
            <p>June Platform Revenue</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow"><Award size={22} /></div>
          <div className="stats-card__info">
            <h3>82%</h3>
            <p>Average Completion Ratio</p>
          </div>
        </div>
      </div>

      <div className="view-reports__charts-grid animate-fadeInUp delay-2">
        {/* Enrollment Trend */}
        <div className="card report-chart-card">
          <h3>Cohort Enrollment Curve</h3>
          <p className="chart-subtitle">Six months platform registrations index</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="card report-chart-card">
          <h3>Monthly Platform Revenue (₹)</h3>
          <p className="chart-subtitle">Gross tuition income curves</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Popularity */}
        <div className="card report-chart-card">
          <h3>Program Popularity Distribution</h3>
          <p className="chart-subtitle">Active student registrations share</p>
          <div className="flex-chart-layout">
            <div style={{ width: '50%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={programPopularity} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                    {programPopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="popularity-legends">
              {programPopularity.map((p) => (
                <div key={p.name} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: p.color }} />
                  <span className="legend-label">{p.name}</span>
                  <span className="legend-val">({p.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completion Donut */}
        <div className="card report-chart-card">
          <h3>Completion Ratio index</h3>
          <p className="chart-subtitle">Enrolled cohorts progress parameters</p>
          <div className="flex-chart-layout">
            <div style={{ width: '50%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={completionRate} innerRadius={0} outerRadius={80} dataKey="value" stroke="none">
                    {completionRate.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="popularity-legends">
              {completionRate.map((p) => (
                <div key={p.name} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: p.color }} />
                  <span className="legend-label">{p.name}</span>
                  <span className="legend-val">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
