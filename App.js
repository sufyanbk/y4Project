import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveNavBar from './components/Navbar';
import Home from './pages/Home'; 
import Permissions from './pages/Permissions';
import UsersDatatable from './components/UsersDatatable';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserModal'; // Import EditUserModal
import DatatableHomepage from './components/Datatable';

const App = () => {
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false); // State for EditUserModal
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user for editing
  const [refreshUsers, setRefreshUsers] = useState(false);

  const handleUserAdded = () => {
    setRefreshUsers(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  return (
    <Router>
      <ResponsiveNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={
          <UsersDatatable 
            refreshData={refreshUsers} 
            setRefreshData={setRefreshUsers} 
            onEdit={handleEditUser} // Pass the edit handler
          />
        } />
        <Route
          path="/users/add"
          element={
            isAddUserModalOpen ? (
              <AddUserModal
                open={isAddUserModalOpen}
                handleClose={() => setAddUserModalOpen(false)}
                onUserAdded={handleUserAdded}
                setRefreshData={setRefreshUsers}
              />
            ) : (
              <Navigate to="/users" replace />
            )
          }
        />
        <Route path="/extras" element={<Permissions />} />
        {/* ... other routes as needed */}
      </Routes>

      {isEditUserModalOpen && (
        <EditUserModal
          open={isEditUserModalOpen}
          handleClose={() => setIsEditUserModalOpen(false)}
          onUserUpdated={handleUserAdded} // Reuse handleUserAdded for refreshing the list
          userData={selectedUser}
        />
      )}

    </Router>
  );
};

export default App;
