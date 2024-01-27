import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// Replace '../styles/custom-theme.css' with the actual path to your custom styles if necessary
import '../styles/custom-theme.css';

export default function DataTabs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [permissions, setPermissions] = useState([]);
    const [clients, setClients] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [loadingClients, setLoadingClients] = useState(true);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [searchTermPermissions, setSearchTermPermissions] = useState('');
    const [searchTermClients, setSearchTermClients] = useState('');
    const [searchTermRoles, setSearchTermRoles] = useState('');

    // Fetch Permissions
    useEffect(() => {
        setLoadingPermissions(true);
        fetch('http://localhost:8080/api/permission/list')
            .then(response => response.json())
            .then(data => {
                setPermissions(data);
                setLoadingPermissions(false);
            })
            .catch(error => {
                console.error('Error fetching permissions:', error);
                setLoadingPermissions(false);
            });
    }, []);

    // Fetch Clients
    useEffect(() => {
        setLoadingClients(true);
        fetch('http://localhost:8080/api/clients/list')
        .then(response => response.json())
        .then(data => {
            console.log('Clients:', data); // Add this line for debugging
            setClients(data);
            setLoadingClients(false);
        })
        .catch(error => {
            console.error('Error fetching clients:', error);
            setLoadingClients(false);
        });
    }, []);

    // Fetch Roles
    useEffect(() => {
        setLoadingRoles(true);
        fetch('http://localhost:8080/api/roles/list')
        .then(response => response.json())
        .then(data => {
            console.log('Roles:', data); // Add this line for debugging
            setRoles(data);
            setLoadingRoles(false);
        })
        .catch(error => {
            console.error('Error fetching roles:', error);
            setLoadingRoles(false);
        });
    }, []);

    const permissionNameBodyTemplate = (rowData) => <span>{rowData.permissionName}</span>;
    const permissionDescriptionBodyTemplate = (rowData) => <span>{rowData.permissionDescription}</span>;

    const clientNameBodyTemplate = (rowData) => <span>{rowData.clientName}</span>;
    const clientDbSourceBodyTemplate = (rowData) => <span>{rowData.dbSource}</span>;

    const roleNameBodyTemplate = (rowData) => <span>{rowData.roleName}</span>;
    const roleDescriptionBodyTemplate = (rowData) => <span>{rowData.roleDescription}</span>;

        // Function to filter permissions based on search term
        const filteredPermissions = permissions.filter(item => 
            item.permissionName.toLowerCase().includes(searchTermPermissions.toLowerCase()) ||
            item.permissionDescription.toLowerCase().includes(searchTermPermissions.toLowerCase())
        );
    
        // Function to filter clients based on search term
        const filteredClients = clients.filter(item => 
            item.clientName.toLowerCase().includes(searchTermClients.toLowerCase()) ||
            item.dbSource.toLowerCase().includes(searchTermClients.toLowerCase())
        );
    
        // Function to filter roles based on search term
        const filteredRoles = roles.filter(item => 
            item.roleName.toLowerCase().includes(searchTermRoles.toLowerCase()) ||
            item.roleDescription.toLowerCase().includes(searchTermRoles.toLowerCase())
        );
        
            // Custom style for the search bar to fit your app theme
    const searchStyle = {
        borderRadius: '20px', // Adjust as needed to match your theme
        border: '1px solid #d9d9d9', // Use the border color that fits your theme
        padding: '0.5em 1em', // Adjust padding to match the spacing in your app
        marginRight: '10px', // Adjust the margin as needed
        width: '250px', // Adjust the width as needed
        height: '40px', // Adjust the height to match the input elements in your app
    };


    return (
        <div className="datatable-responsive-demo">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Permissions">
                    <div className="p-inputgroup" style={{ marginBottom: '5px' }}>
                    <InputText 
                    placeholder="Search Permissions" 
                    value={searchTermPermissions} 
                    onChange={(e) => setSearchTermPermissions(e.target.value)} 
                    style={{ marginBottom: '10px' }}
                     />
                     <Button icon="pi pi-search" className="p-button-secondary" style={{height: '40px'}} />
                     </div>
                        <DataTable
                            value={filteredPermissions}
                            paginator
                            rows={10}
                            loading={loadingPermissions}
                            emptyMessage="No permissions found."
                            responsiveLayout="scroll"
                        >
                            <Column field="permissionName" header="Permission Name" body={permissionNameBodyTemplate} sortable />
                            <Column field="permissionDescription" header="Description" body={permissionDescriptionBodyTemplate} sortable />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Clients">
                <div className="p-inputgroup" style={{ marginBottom: '5px' }}>
                <InputText 
                        placeholder="Search Clients" 
                        value={searchTermClients} 
                        onChange={(e) => setSearchTermClients(e.target.value)} 
                        style={{ marginBottom: '10px' }}
                    />
                    <Button icon="pi pi-search" className="p-button-secondary" style={{height: '40px'}} />
                    </div>
                    <DataTable
                        value={filteredClients}
                        paginator
                        rows={10}
                        loading={loadingClients}
                        emptyMessage="No clients found."
                        responsiveLayout="scroll"
                    >
                        <Column field="clientId" header="Client ID" sortable />
                        <Column field="clientName" header="Client Name" body={clientNameBodyTemplate} sortable />
                        <Column field="dbSource" header="DB Source" body={clientDbSourceBodyTemplate} sortable />
                    </DataTable>
                </TabPanel>
                <TabPanel header="Roles">
                <div className="p-inputgroup" style={{ marginBottom: '5px' }}>
                <InputText 
                placeholder="Search Roles" 
                value={searchTermRoles} 
                onChange={(e) => setSearchTermRoles(e.target.value)} 
                style={{ marginBottom: '10px' }}
            />
            <Button icon="pi pi-search" className="p-button-secondary" style={{height: '40px'}} />
            </div>
                    <DataTable
                        value={filteredRoles}
                        paginator
                        rows={10}
                        loading={loadingRoles}
                        emptyMessage="No roles found."
                        responsiveLayout="scroll"
                    >
                        <Column field="roleId" header="Role ID" sortable />
                        <Column field="roleName" header="Role Name" body={roleNameBodyTemplate} sortable />
                        <Column field="roleDescription" header="Role Description" body={roleDescriptionBodyTemplate} sortable />
                    </DataTable>
                </TabPanel>
            </TabView>
        </div>
    );
}