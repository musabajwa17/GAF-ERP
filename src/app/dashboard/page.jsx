"use client"
import Sidebar from '../../components/sidebar/Sidebar';
import ProtectedPage from '../../components/contact/ProtectedPage/AuthorizedPage';
function Dashboard() {
  return (
    <ProtectedPage>
      <div className='flex'>
        <Sidebar />
      </div>
    </ProtectedPage>
  );
}

export default Dashboard;