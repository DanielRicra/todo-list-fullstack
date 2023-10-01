import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

import './Dashboard.scss';

const Dashboard = () => {
   const [showSidebar, setShowSidebar] = useState(false);

   const handleShowSideBar = (value: boolean) => {
      setShowSidebar(value);
   };

   return (
      <div className='dashboard'>
         <Sidebar
            showSidebar={showSidebar}
            setShowSidebar={handleShowSideBar}
         />
         <div className='dashboard__panel'>
            <Navbar setShowSidebar={handleShowSideBar} />
            <Outlet />
         </div>
      </div>
   );
};

export default Dashboard;
