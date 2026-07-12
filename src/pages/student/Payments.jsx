import { CreditCard, Download, ShieldCheck, DollarSign, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Payments.jsx'; // We'll link CSS below
import './Payments.css';

const mockPaymentsData = [
  { id: 'PAY-001', receiptNo: 'IS-REC-2026-891', program: 'Web Development', amount: 2499, date: '2026-06-01', status: 'completed', method: 'UPI' },
  { id: 'PAY-002', receiptNo: 'IS-REC-2026-765', program: 'React Crash Course (Add-on)', amount: 499, date: '2026-06-15', status: 'completed', method: 'Card' },
];

const Payments = () => {
  const { user } = useAuth();

  return (
    <div className="payments">
      <div className="payments__header animate-fadeInUp">
        <h1>Payments & Receipts</h1>
        <p>Manage your transactions, download receipts, and view payment history.</p>
      </div>

      <div className="payments__grid">
        {/* Payment Summary Cards */}
        <div className="payments__summary-cards animate-fadeInUp delay-1">
          <div className="stats-card">
            <div className="stats-card__icon stats-card__icon--blue">
              <DollarSign size={24} />
            </div>
            <div className="stats-card__info">
              <h3>₹{mockPaymentsData.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</h3>
              <p>Total Paid Amount</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card__icon stats-card__icon--green">
              <ShieldCheck size={24} />
            </div>
            <div className="stats-card__info">
              <h3>Active</h3>
              <p>Enrollment Status</p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-card__icon stats-card__icon--yellow">
              <Calendar size={24} />
            </div>
            <div className="stats-card__info">
              <h3>June 1, 2026</h3>
              <p>Next Batch Cycle</p>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="payments__history card animate-fadeInUp delay-2">
          <h3>Payment History</h3>
          <p className="table-subtitle">All transactions done on your account</p>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockPaymentsData.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>{payment.receiptNo}</strong></td>
                    <td>{new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>{payment.program}</td>
                    <td>₹{payment.amount.toLocaleString()}</td>
                    <td>
                      <span className="badge badge--success">Success</span>
                    </td>
                    <td>
                      <button className="btn btn--secondary btn--sm btn--icon" title="Download Receipt">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
