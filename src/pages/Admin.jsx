import useAdminAuth from '../hooks/useAdminAuth';
import LoginForm from '../components/admin/LoginForm';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardTable from '../components/admin/DashboardTable';

export default function Admin() {
  const { isAuthenticated, login, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <AdminHeader onLogout={logout} />
      <DashboardTable />
    </div>
  );
}
