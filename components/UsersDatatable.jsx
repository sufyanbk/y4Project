import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'; // Import Dialog
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '../styles/custom-theme.css';
import { render } from '@testing-library/react';

export default function UsersDataTable({ refreshData, setRefreshData, onEdit, onDelete }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(null); // State for storing filtered users

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/users/filtered');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };
    
        fetchUsers();
    
        if (refreshData) {
            fetchUsers();
            setRefreshData(false);
        }
    }, [refreshData, setRefreshData]);


    const firstnameBodyTemplate = (rowData) => <span>{rowData.firstname}</span>;
    const lastnameBodyTemplate = (rowData) => <span>{rowData.lastname}</span>;
    const emailAddressBodyTemplate = (rowData) => <span>{rowData.emailAddress}</span>;

    const accountStatusBodyTemplate = (rowData) => {
        const severity = rowData.accountStatus === 'A' ? 'success' : 
                        rowData.accountStatus === 'N' ? 'danger' : 
                        rowData.accountStatus === 'L' ? 'warning' : 'secondary';
        const label = rowData.accountStatus === 'A' ? 'Active' : 
                      rowData.accountStatus === 'N' ? 'Inactive' : 
                      rowData.accountStatus === 'L' ? 'Locked' : 'Unknown';
        return <Tag severity={severity} value={label} />;
    };

    
    const confirmDelete = (rowData) => {
        setSelectedUser(rowData);
        setDeleteDialogVisible(true);
    };

    const handleDeleteUser = async () => {
        const updateData = {
            userId: selectedUser.userId, // Ensure this is the user's identifier
            accountStatus: 'L' // Setting account status to 'N'
        };
    
        try {
            const response = await fetch('http://localhost:8080/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const result = await response.json();
                console.log('User status updated successfully:', result);
            } else {
                const textResult = await response.text();
                console.log('User status updated successfully:', textResult);
            }
    
            setRefreshData(true); // Trigger a refresh of the DataTable
        } catch (error) {
            console.error('Error updating user status:', error);
        } finally {
            setDeleteDialogVisible(false); // Close the confirmation dialog
        }
    };
    

    const actionsBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-5" 
                    tooltip="Edit User" onClick={() => onEdit(rowData)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-3" 
                    tooltip="Suspend User" onClick={() => confirmDelete(rowData)} />
            {/* Other action buttons */}
        </React.Fragment>
    );

    const deleteDialogFooter = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setDeleteDialogVisible(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={handleDeleteUser} autoFocus />
        </div>
    );

        // Function to filter users based on the search input
        const handleFilterUsers = (event) => {
            const searchTerm = event.target.value.toLowerCase();
            if (searchTerm === '') {
                setFilteredUsers(users);
            } else {
                setFilteredUsers(users.filter(user => {
                    return Object.values(user).some(value =>
                        String(value).toLowerCase().includes(searchTerm)
                    );
                }));
            }
        };

    const renderHeader = () => {
        return (
            <div className="table-header">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <input
                        type="search"
                        placeholder="     Search Users"
                        className="p-inputtext p-component"
                        onChange={handleFilterUsers} // Use the handleFilterUsers function for filtering
                    />
                </span>
            </div>
        );
    };


    return (
        <div className="datatable-responsive-demo">
            {renderHeader()}
            <DataTable
                value={filteredUsers || users} // Use the filteredUsers state for displaying data
                paginator
                rows={15}
                loading={loading}
                emptyMessage="No users found."
                responsiveLayout="scroll"
            >
                <Column field="firstname" header="First Name" body={firstnameBodyTemplate} />
                <Column field="lastname" header="Last Name" body={lastnameBodyTemplate} />
                <Column field="emailAddress" header="Email Address" body={emailAddressBodyTemplate} />
                <Column field="accountStatus" header="Account Status" body={accountStatusBodyTemplate} />
                <Column header="Actions" body={actionsBodyTemplate} />
            </DataTable>
            <Dialog 
                header="Confirm Suspension" 
                visible={deleteDialogVisible} 
                onHide={() => setDeleteDialogVisible(false)}
                footer={deleteDialogFooter}>
                Are you sure you want to suspend this user?
            </Dialog>
        </div>
    );
}
