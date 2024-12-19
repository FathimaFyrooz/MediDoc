import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoIosList } from "react-icons/io";

const Navbar = () => (
  <AppBar position="static" sx={{color:"#ffccd5",backgroundColor:"#c9184a" }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Docter AI
      </Typography>
      <Box>
       <Button component={Link} to="/" color="inherit" sx={{ marginRight: 2,'&:hover': {
              backgroundColor: '#ffccd5', // Button background color on hover
              color: '#590d22', // Text color on hover
            }, }}>
          <AiOutlineHome style={{marginRight:"5px",fontSize: '1rem' }} />
          Home
        </Button>
        <Button component={Link} to="/details" color="inherit" sx={{ marginRight: 2,'&:hover': {
              backgroundColor: '#ffccd5', // Button background color on hover
              color: '#590d22', // Text color on hover
            }, }}>
          <IoNewspaperOutline style={{marginRight:"5px",fontSize: '1rem' }}/>
          New Patient
        </Button>
        <Button component={Link} to="/list_patients" color="inherit" sx={{'&:hover': {
              backgroundColor: '#ffccd5', // Button background color on hover
              color: '#590d22', // Text color on hover
            },}}>
          <IoIosList style={{marginRight:"5px",fontSize: '1rem'}}/>
          List Patients
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar;
