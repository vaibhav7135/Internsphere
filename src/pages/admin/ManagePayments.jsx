import { useState } from 'react';
import { DollarSign, ShieldAlert, CheckCircle, Clock, Search, Filter, Download } from 'lucide-react';
import { mockPayments } from '../../data/users';
import './ManagePayments.css';

const ManagePayments = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = p.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="manage-payments">
      <div className="manage-payments__header animate-fadeInUp">
        <div>
          <h1>Manage Payments</h1>
          <p>Track student transactions, review billing status, and export accounting logs.</p>
        </div>
        <button className="btn btn--secondary">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary Row */}
      <div className="manage-payments__summary animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green"><DollarSign size={24} /></div>
          <div className="stats-card__info">
            <h3>₹{totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue (Completed)</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow"><Clock size={24} /></div>
          <div className="stats-card__info">
            <h3>₹{pendingRevenue.toLocaleString()}</h3>
            <p>Pending Receivables</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue"><CheckCircle size={24} /></div>
          <div className="stats-card__info">
            <h3>{payments.filter(p => p.status === 'completed').length}</h3>
            <p>Successful Payments</p>
          </div>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="manage-payments__filters-bar card card--flat animate-fadeInUp delay-2">
        <div className="search-box">
          <Search size={18} className="search-box-icon" />
          <input
            type="text"
            className="form-input search-box-input"
            placeholder="Search student, invoice, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={16} />
          <select
            className="form-input form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="manage-payments__table-card card animate-fadeInUp delay-2">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Student</th>
                <th>Program</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.student}</td>
                  <td>{p.program}</td>
                  <td>₹{p.amount.toLocaleString()}</td>
                  <td>{new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>{p.method}</td>
                  <td>
                    <span className={`badge ${p.status === 'completed' ? 'badge--success' : 'badge--warning'}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="manage-payments__empty text-center">
            <Search size={48} />
            <h3>No payment logs found</h3>
            <p>Try clearing your filter inputs to see all records.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;
