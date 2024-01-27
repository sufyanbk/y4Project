import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag'; // Import Tag component
import 'primereact/resources/themes/saga-blue/theme.css'; // or any other theme
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '../styles/custom-theme.css';

export default function DatatableHomepage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredUsers, setFilteredUsers] = useState([]); // State for storing filtered users

    useEffect(() => {
        fetch('http://localhost:8080/api/users/filtered')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                setLoading(false);
            });
    }, []);

    const firstnameBodyTemplate = (rowData) => {
        return <span>{rowData.firstname}</span>;
    };

    const lastnameBodyTemplate = (rowData) => {
        return <span>{rowData.lastname}</span>;
    };

    const emailAddressBodyTemplate = (rowData) => {
        return <span>{rowData.emailAddress}</span>;
    };

    // Updated accountStatusBodyTemplate to use Tag for color coding
    const accountStatusBodyTemplate = (rowData) => {
        const status = rowData.accountStatus;
        let severity;
        let label;
        switch (status) {
            case 'A':
                severity = 'success';
                label = 'Active';
                break;
            case 'N':
                severity = 'danger';
                label = 'In-Active';
                break;
            case 'L':
                severity = 'warning';
                label = 'Locked';
                break;
            default:
                severity = 'secondary';
                label = status;
        }

        return <Tag severity={severity} value={label} />;
    };

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
                        placeholder="Global Search"
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
                value={filteredUsers} // Use the filteredUsers state for displaying data
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
        </DataTable>
    </div>
    );
}
