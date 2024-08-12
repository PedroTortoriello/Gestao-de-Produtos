import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaSignOutAlt } from "react-icons/fa";
import Logo from './Logo.png';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const navigate = useNavigate();

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const handleLogout = () => {
    // Remove authentication details from local storage or cookies
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/auth/signin');
  };

  return (
    <aside
      ref={sidebar}
      className={`fixed inset-y-0 left-0 z-50 flex flex-col h-screen w-64 overflow-y-hidden bg-gradient-to-b from-blue-900 to-black shadow-lg duration-300 ease-in-out dark:bg-gray-900 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between px-4 py-4">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <img src={Logo} alt="Logo" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white lg:hidden"
        >
          <FaBars size={24} />
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="flex flex-col h-full">
        <div className="no-scrollbar flex flex-col flex-grow overflow-y-auto mt-5 px-4">
          {/* Sidebar Menu */}
          <nav className="flex-grow">
            {/* Menu Group */}
            <div>
              <ul className="flex flex-col gap-6">
                {/* Menu Item Dashboard */}
                <li>
                  <NavLink
                    to="/Dashboard/Produtos"
                    className={({ isActive }) =>
                      'group flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-700 ' +
                      (isActive && 'bg-blue-700')
                    }
                  >
                    <FaHome size={20} />
                    {sidebarExpanded && <span>Dashboard</span>}
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        {/* Sidebar Footer */}
        <div className="px-4 py-4">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-red-700 w-full text-left"
          >
            <FaSignOutAlt size={20} />
            {sidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
