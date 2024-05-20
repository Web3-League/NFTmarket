import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          NFT-Market
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/about">
          About
        </Button>
        <Button color="inherit" component={RouterLink} to="/contact">
          Contact
        </Button>
        <Button color="inherit" component={RouterLink} to="/mynfts">
          My NFTs
        </Button>
        <Button color="inherit" component={RouterLink} to="/Market">
          Market
        </Button>
        <Button color="inherit" component={RouterLink} to="/sellnft">
          Sell NFT
        </Button>
        <Button color="inherit" component={RouterLink} to="/ManageOffers">
          Manage Offers
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

