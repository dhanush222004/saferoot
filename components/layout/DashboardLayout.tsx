
import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useChatbot } from '../../App';
import ChatbotFab from '../common/ChatbotFab';

const getContextFromPath = (pathname: string): string => {
    if (pathname.includes('/dashboard/farmer')) return 'FarmerDashboard';
    if (pathname.includes('/dashboard/admin')) return 'AdminDashboard';
    if (pathname.includes('/dashboard/lab')) return 'LabDashboard';
    if (pathname.includes('/dashboard/factory')) return 'FactoryDashboard';
    if (pathname.includes('/dashboard/customer')) return 'CustomerDashboard';
    if (pathname.includes('/biowaste/route')) return 'BioWasteRoutingScreen';
    if (pathname.includes('/profile')) return 'UserProfileScreen';
    return 'RoleSelectionScreen';
}

const DashboardLayout: React.FC = () => {
    const { setPageContext } = useChatbot();
    const location = useLocation();

    useEffect(() => {
        const context = getContextFromPath(location.pathname);
        setPageContext(context);
    }, [location.pathname, setPageContext]);

    return (
        <div className="w-full flex items-center justify-center min-h-screen">
            <Outlet />
            <ChatbotFab />
        </div>
    );
};

export default DashboardLayout;
