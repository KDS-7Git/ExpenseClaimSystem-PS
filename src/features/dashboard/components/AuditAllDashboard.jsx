import { useState, useEffect } from 'react';
import API from '../../../shared/services/axios';
import ExpenseReportDetailModal from '../../../shared/components/ExpenseReportDetailModal';

const AuditAllDashboard = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await API.get('/expense-reports?all=true');
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Processed Reports</h1>
        <p className="text-gray-600">View all reports that have been processed by audit</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No processed reports found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {report.submitterId?.profileImage ? (
                      <img 
                        src={report.submitterId.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-lg font-medium">
                        {(report.submitterId?.name || report.facultyName || report.studentName)?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      <button
                        onClick={() => window.location.href = `/profile/${report.submitterId?._id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {report.submitterId?.name || report.facultyName || report.studentName}
                      </button>
                      {' - '}{report.purposeOfExpense}
                    </h3>
                    <p className="text-gray-600 mt-1">{report.reportType} ({report.submitterRole})</p>
                    <p className="text-sm text-gray-500">
                      Period: {new Date(report.expensePeriodStart).toLocaleDateDate()} - {new Date(report.expensePeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${report.totalAmount?.toFixed(2) || '0.00'}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.status === 'Audit Approved' ? 'bg-green-100 text-green-800' :
                    report.status === 'Finance Approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Department:</span> {report.department}
                </div>
                <div>
                  <span className="font-medium">Items:</span> {report.items?.length || 0}
                </div>
                <div>
                  <span className="font-medium">Processed:</span> {report.auditApproval?.date ? new Date(report.auditApproval.date).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDetailModal(report._id)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExpenseReportDetailModal 
        reportId={detailModal}
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
      />
    </div>
  );
};

export default AuditAllDashboard;