import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Tab,
  Tabs,
  tabsClasses,
  Step,
  Stepper,
  StepLabel,
  ListSubheader,
  ListItem,
  List,
  ListItemText,
  Checkbox,
  InputAdornment,
  TextareaAutosize,
  Snackbar,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function AddUserModal({
  open,
  handleClose: propsHandleClose,
  onUserAdded,
  setRefreshData,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [group, setGroup] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // New state hooks for permissions
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // New state for storing selected permissions
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Fetch permissions when the modal opens or the permissions tab is active
  useEffect(() => {
    if (open && activeTab === 1) {
      const fetchPermissions = async () => {
        const response = await fetch(
          "http://localhost:8080/api/permission/list"
        );
        const data = await response.json();
        setPermissions(data);
        setFilteredPermissions(data); // Initially no filter is applied
      };
      fetchPermissions();
    }
  }, [open, activeTab]);

  // Add this useEffect to reset permissions when the modal is closed
  useEffect(() => {
    if (!open) {
      setSelectedPermissions([]);
      // Add any other state resets you need when the modal closes
    }
  }, [open]); // Only re-run the effect if 'open' changes

  useEffect(() => {
    // Fetch clients when the modal opens
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clients/list");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClients(data); // Set the clients in state
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    if (open) {
      fetchClients();
    }
  }, [open]);

  //Different Tabs
  const steps = ["Personal Information", "Permissions", "Review"];

  // Map for role options
  const roleOptions = {
    3: "External Client",
    1: "First Role",
    4: "Admin",
  };

  // Map for group options
  const groupOptions = {
    1: "RedEye",
    6: "SuperUser",
  };

  // Handle role change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
    // Logging the selected role
    const selectedRoleText = roleOptions[event.target.value];
    console.log(
      `Selected Role: ${selectedRoleText}, Value: ${event.target.value}`
    );
  };

  // Handle group change
  const handleGroupChange = (event) => {
    setGroup(event.target.value);
    // Logging the selected group
    const selectedGroupText = groupOptions[event.target.value];
    console.log(
      `Selected Group: ${selectedGroupText}, Value: ${event.target.value}`
    );
  };

  const handleClientChange = (event) => {
    const {
      target: { value },
    } = event;

    // Update selected clients
    const selected = typeof value === "string" ? value.split(",") : value;
    setSelectedClients(selected);

    // Log selected client IDs
    selected.forEach((clientId) => {
      console.log(`Selected Client ID: ${clientId}`);
    });
  };

  // Helper function to map permissions to their role IDs
  const getPermissionRoleIds = (permissions) => {
    // Assuming you have the role ID in your permission objects
    return permissions.map((p) => p.roleId);
  };

  // const handleSnackbarClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setSnackbarOpen(false);
  // };

  //console.log("Selected Permissions:", selectedPermissions);

  // Handle add user
  const handleAddUser = async () => {
    // Construct the payload
    const payload = {
      user: {
        emailAddress: email,
        firstname: firstName,
        lastname: lastName,
        roleId: role, // Assuming role is already a role ID
        userGroupId: group, // Assuming group is already a group ID
        accountStatus: "A", // Assuming account status is always "A" for new users
      },
      clientIds: selectedClients, // Assuming selectedClients is already an array of client IDs
      permissionRoleIds: selectedPermissions.map(
        (permission) => permission.permissionId
      ),
    };

    // Log the payload to console
    console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("http://localhost:8080/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        console.log("User added successfully:", result);
      } else {
        // Handle non-JSON response
        const textResult = await response.text();
        console.log("User added successfully:", textResult);
      }

      if (typeof onUserAdded === "function") {
        // setSnackbarMessage("User added successfully!");
        // setSnackbarOpen(true); // Open the snackbar
        // onUserAdded(); // Callback to refresh the user list in UsersDataTable
        setRefreshData(true);
      }
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error adding user:", error);
      // setSnackbarMessage("Failed to add user.");
      // setSnackbarOpen(true); // Open the snackbar for error message
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setActiveTab((prevActiveTab) => prevActiveTab + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setActiveTab((prevActiveTab) => prevActiveTab - 1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveStep(newValue);
  };

  // Function to handle the search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === "") {
      setFilteredPermissions(permissions);
      console.log(permissions);
    } else {
      const lowercasedFilter = event.target.value.toLowerCase();

      const filteredData = permissions.filter((item) =>
        item.permissionName.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredPermissions(filteredData);
    }
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prevSelectedPermissions) => {
      const selectedIndex = prevSelectedPermissions.findIndex(
        (selected) => selected.permissionId === permission.permissionId
      );

      if (selectedIndex === -1) {
        // Add the permission
        return [...prevSelectedPermissions, permission];
      } else {
        // Remove the permission
        return prevSelectedPermissions.filter(
          (selected) => selected.permissionId !== permission.permissionId
        );
      }
    });
  };

  const handleClose = () => {
    // Reset the state to initial values
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
    setGroup("");
    setClients([]);
    setSelectedClients([]);
    // setPermissions([]);
    // setFilteredPermissions([]);
    // setSearchTerm('');
    // setSelectedPermissions([]);
    setActiveStep(0);
    setActiveTab(0);

    // Call the passed handleClose function from props
    propsHandleClose();
  };

  {
    /*PERMISSIONS TAB CODE */
  }
  const renderPermissionsTabPanel = () => (
    <TabPanel value={activeTab} index={1}>
      <TextField
        fullWidth
        label="Search Permissions"
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <List
        sx={{
          width: "100%",
          position: "relative",
          maxHeight: 300,
          overflow: "auto",
        }}
        subheader={<ListSubheader>Permissions</ListSubheader>}
      >
        {filteredPermissions.map((permission) => (
          <ListItem key={permission.permissionId} button>
            <Checkbox
              edge="start"
              checked={selectedPermissions.some(
                (selected) => selected.permissionId === permission.permissionId
              )}
              tabIndex={-1}
              disableRipple
              onChange={() => handlePermissionChange(permission)}
            />
            <ListItemText primary={permission.permissionName} />
          </ListItem>
        ))}
      </List>
    </TabPanel>
  );

  {
    /*Review Tab */
  }

  // Function to render the Review Tab Panel
  const renderReviewTabPanel = () => (
    <TabPanel value={activeTab} index={2}>
      <Typography variant="h6">Review Information</Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          value={firstName}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          value={lastName}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Role"
          variant="outlined"
          value={roleOptions[role] || ""}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Group"
          variant="outlined"
          value={groupOptions[group] || ""}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Selected Clients"
          variant="outlined"
          value={selectedClients
            .map(
              (clientId) =>
                clients.find((client) => client.clientId === clientId)
                  ?.clientName
            )
            .join(", ")}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Selected Permissions
        </Typography>
        <TextareaAutosize
          aria-label="Selected Permissions"
          minRows={3}
          value={selectedPermissions
            .map((permission) => permission.permissionName)
            .join(", ")}
          readOnly
          style={{ width: "100%", marginTop: "8px", padding: "10px" }}
        />
      </Box>
    </TabPanel>
  );

  // const renderPersonalInfoTabPanel = () => (
  // );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New User
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          aria-label="user creation steps"
          variant="fullWidth"
        >
          {steps.map((label, index) => (
            <Tab label={label} {...a11yProps(index)} />
          ))}
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          {/* Personal Information form inputs */}
          <Stack spacing={2}>
            <TextField
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Select User Role</InputLabel>
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
              <InputLabel id="group-select-label">Select Group</InputLabel>
              <Select
                labelId="group-select-label"
                id="group-select"
                value={group}
                label="Select Group"
                onChange={handleGroupChange}
              >
                <MenuItem value={1}>RedEye</MenuItem>
                <MenuItem value={6}>SuperUser</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="client-multi-select-label">
                Select Client(s)
              </InputLabel>
              <Select
                labelId="client-multi-select-label"
                id="client-multi-select"
                multiple
                value={selectedClients}
                onChange={handleClientChange}
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label="Select Client(s)"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          clients.find((client) => client.clientId === value)
                            .clientName
                        }
                      />
                    ))}
                  </Box>
                )}
              >
                {clients.map((client) => (
                  <MenuItem key={client.clientId} value={client.clientId}>
                    {client.clientName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Include other form inputs as needed */}
          </Stack>
        </TabPanel>
        {/* Permissions TabPanel */}
        {renderPermissionsTabPanel()}
        {/* Review TabPanel */}
        {renderReviewTabPanel()}
        {/* ... (Add other TabPanels for Permissions and Review) */}

        {/* Actions */}
        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} sx={{ mr: 1 }}>
              Next
            </Button>
          ) : (
            <Button onClick={handleAddUser} color="primary" variant="contained">
              Add User
            </Button>
          )}
        </Box>
      </Box>
    </Modal>      
  );
  
}

export default AddUserModal;
