import React, { useState } from "react";
import Users from "./users";
import Subscriptions from "./subscribtion";
import Bookings from "./booking";
import ContactMessages from "./contactus";
import VetApplications from "./vetappliaction";
import AddArticle from "./blog";
import VetSchedules from "./vetSchedule";
import VetMessages from "./VetMessages";
import SubscriptionStatsDashboard from "./Chart";
import { 
  Users as UsersIcon, 
  CreditCard, 
  Calendar, 
  MessageSquare, 
  FileCheck, 
  FileText, 
  Clock, 
  Mail,
  Menu,
  X
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { name: "stats", icon: <UsersIcon className="w-5 h-5" /> },
    { name: "users", icon: <UsersIcon className="w-5 h-5" /> },
    { name: "subscriptions", icon: <CreditCard className="w-5 h-5" /> },
    { name: "bookings", icon: <Calendar className="w-5 h-5" /> },
    { name: "contact", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "vet applications", icon: <FileCheck className="w-5 h-5" /> },
    { name: "Articles", icon: <FileText className="w-5 h-5" /> },
    { name: "vet schedules", icon: <Clock className="w-5 h-5" /> },
    
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full bg-gray-800 text-white p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-8">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.name
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>
                  {tab.name.split(" ").map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(" ")}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
        {activeTab === "stats" && <SubscriptionStatsDashboard />}
          {activeTab === "users" && <Users />}
          {activeTab === "subscriptions" && <Subscriptions />}
          {activeTab === "bookings" && <Bookings />}
          {activeTab === "contact" && <ContactMessages />}
          {activeTab === "vet applications" && <VetApplications />}
          {activeTab === "Articles" && <AddArticle />}
          {activeTab === "vet schedules" && <VetSchedules />}
         
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;