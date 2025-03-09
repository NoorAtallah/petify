import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Navbar, Dropdown } from "flowbite-react";
import logo from '../images/logo/2.png';
import { AuthContext } from '../context/AuthContext';

export function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar fluid rounded className="bg-customGray top-0 z-50 h-30">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="mr-3 h-8 sm:h-20 transition-transform duration-200 hover:scale-105 " alt="Petify Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-black">Petify</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="text-black border-black px-3 py-2 rounded-md hover:bg-light ml-4">Profile</Link>
            <Button className="text-black border-black bg-trans hover:bg-light ml-4" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button className="text-black border-black bg-trans hover:bg-light mr-4">Connect with a vet</Button>
            </Link>
            <Link to="/login" className="text-black border-black px-3 py-2 rounded-md hover:bg-light">Login</Link>
          </>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/help" className='transition-transform duration-200 hover:scale-105 text-l'>Call a Vet</Navbar.Link>
       <div className="relative hover: bg-transperant"> {/* Ensure the dropdown is positioned relative to its container */}
          <Dropdown label="Adopt" inline={true} className="transition-transform duration-200  ">
            <Dropdown.Item as={Link} to="/post" className='w-32'>
              Post a Pet
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/view">
              Adopt a Pet
            </Dropdown.Item>
          </Dropdown>
        </div> 
                <Navbar.Link as={Link} to="/trans" className='transition-transform duration-200 hover:scale-105 text-black'>Help Delivered</Navbar.Link>
               <Navbar.Link as={Link} to="/blog" className='transition-transform duration-200 hover:scale-105 text-black'>Blog</Navbar.Link>
        <Navbar.Link as={Link} to="/CatInfo" className='transition-transform duration-200 hover:scale-105 text-black'>Whiskers & Wags</Navbar.Link>
        <Navbar.Link as={Link} to="/contactus" className='transition-transform duration-200 hover:scale-105 text-l'>Petify Support</Navbar.Link>
        <Navbar.Link as={Link} to="/about" className='transition-transform duration-200 hover:scale-105 text-l text-black'>Meet Petify</Navbar.Link>

      </Navbar.Collapse>
    </Navbar>
  );
}