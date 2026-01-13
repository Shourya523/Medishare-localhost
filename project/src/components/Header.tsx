"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Heart,
  Map,
  BarChart3,
  LogIn,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { RootState, persistor } from '../store';
import { login, logout } from '../store/slices/authSlice';
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "./ui/resizable-navbar"; // Adjust path based on your folder structure

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    navigate('/login');
    dispatch(login({ name: 'User' }));
  };

  const handleLogout = async () => {
    dispatch(logout());
    persistor.purge();
    persistor.flush();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: 'Donate Medicine', link: '/#donate', icon: PlusCircle },
    { name: 'Find NGOs', link: '/#ngos', icon: Map },
    { name: 'Health Insights', link: '/#insights', icon: Heart },
    { name: 'Dashboard', link: '/#dashboard', icon: BarChart3 },
  ];

  return (
    <Navbar className="fixed top-0">
      <NavBody
        visible={true} // Forcing visible style for the light-mode pill look
        className="bg-white/90 border border-neutral-200"
      >
        <div className="flex items-center gap-6 w-full">
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <span className="text-xl font-bold text-emerald-600">MediShare</span>
          </div>

          {/* Using a flex container for links to prevent collision */}
          <div className="flex-1 flex justify-center">
            <NavItems items={menuItems} />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/store"
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Store</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2 border-l pl-3 border-neutral-200">
                <span className="text-sm font-semibold text-neutral-800">{user?.name}</span>
                <button onClick={handleLogout} className="text-neutral-500 hover:text-red-500">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="text-sm font-medium text-neutral-700">Log In</button>
            )}
          </div>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl font-bold text-emerald-600">MediShare</span>
          </div>
          <MobileNavToggle isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="flex items-center space-x-2 w-full text-neutral-600 dark:text-neutral-300 py-2 border-b border-neutral-100 dark:border-neutral-800"
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 text-emerald-600" />
              <span>{item.name}</span>
            </a>
          ))}

          <a
            href="/store"
            className="flex items-center space-x-2 w-full bg-emerald-600 text-white px-4 py-3 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Visit Store</span>
          </a>

          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="flex items-center justify-center space-x-2 w-full bg-black text-white py-3 rounded-md"
            >
              <LogIn className="h-5 w-5" />
              <span>Log In</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full text-red-500 py-3"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}