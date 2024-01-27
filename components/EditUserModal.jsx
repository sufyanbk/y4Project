import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function EditUserModal({ open, handleClose, onUserUpdated, userData }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [group, setGroup] = useState('');
  const [accountStatus, setAccountStatus] = useState('');

    // Map for role options
    const roleOptions = {
        3: 'External Client',
        1: 'First Role',
        4: 'Admin'
      };
    
      // Map for group options
      const groupOptions = {
        1: 'RedEye',
        6: 'SuperUser'
      };

  // Initialize form with user data when userData changes
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstname || '');
      setLastName(userData.lastname || '');
      setEmail(userData.emailAddress || '');
      setRole(userData.roleId || '');
      setGroup(userData.userGroupId || '');
      setAccountStatus(userData.accountStatus || '');
    }
  }, [userData]);

  // Handle account status change
  const handleAccountStatusChange = (event) => {
    setAccountStatus(event.target.value);
    console.log(event.target.value);
  };

    // Handle role change
    const handleRoleChange = (event) => {
        setRole(event.target.value);
         // Logging the selected role
         const selectedRoleText = roleOptions[event.target.value];
         console.log(`Selected Role: ${selectedRoleText}, Value: ${event.target.value}`);
      };
    
      // Handle group change
      const handleGroupChange = (event) => {
        setGroup(event.target.value);
         // Logging the selected group
         const selectedGroupText = groupOptions[event.target.value];
         console.log(`Selected Group: ${selectedGroupText}, Value: ${event.target.value}`);
      };

// Handle edit user
const handleEditUser = async () => {
    const userToUpdate = {
      userId: userData.userId, // Ensure this is provided in the userData prop
      roleId: role,
      userGroupId: group,
      emailAddress: email,
      firstname: firstName,
      lastname: lastName,
      accountStatus: accountStatus
    };
  
    try {
        const response = await fetch('http://localhost:8080/api/users/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userToUpdate)
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const result = await response.json();
          console.log('User updated successfully:', result);
        } else {
          // Handle non-JSON response
          const textResult = await response.text();
          console.log('User updated successfully:', textResult);
        }
    
        if (typeof onUserUpdated === 'function') {
          onUserUpdated(); // Callback to refresh the user list in UsersDataTable
        }
      } catch (error) {
        console.error('Error updating user:', error);
      } finally {
        handleClose(); // Close the modal regardless of the outcome
        console.log('Edit user modal closed');
      }
  };
  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        height: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit User
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField label="First Name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <TextField label="Last Name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
            
            {/* Similar role and group Select components as in AddUserModal */}
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value={3}>External Client</MenuItem>
                <MenuItem value={1}>First Role</MenuItem>
                <MenuItem value={4}>Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="group-select-label">Group</InputLabel>
              <Select
                labelId="group-select-label"
                id="group-select"
                value={group}
                label="Group"
                onChange={handleGroupChange}
              >
                <MenuItem value={1}>RedEye</MenuItem>
                <MenuItem value={6}>SuperUser</MenuItem>
              </Select>
            </FormControl>


            <FormControl fullWidth>
              <InputLabel id="account-status-label">Account Status</InputLabel>
              <Select
                labelId="account-status-label"
                id="account-status-select"
                value={accountStatus}
                label="Account Status"
                onChange={handleAccountStatusChange}
              >
                <MenuItem value="A">Active</MenuItem>
                <MenuItem value="N">Inactive</MenuItem>
                <MenuItem value="L">Locked</MenuItem>
                {/* Other statuses as needed */}
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleEditUser}
              sx={{ mt: 2 }}
            >
              Update User
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditUserModal;
