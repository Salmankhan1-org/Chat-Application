'use client';
import React, { useState } from "react";
import SideNavigation from "./side-navigation";
import UserList from "./user-list";
import ChatArea from "./chat-area";

const AppLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  const handleUserClick = (user:any) => {
    setSelectedUser(user);
    setMobileView("chat");
  };

  const handleBack = () => {
    console.log('Back button clicked');
    setMobileView("list");
  };

  return (
    <main className="d-flex overflow-hidden w-100" style={{ height: "100vh" }}>
      <SideNavigation />

      {/* User List */}
      <div
        className={`flex-shrink-0 ${mobileView === "chat" ? "d-none d-md-block" : "d-block"}`}
        style={{
          width: "100%",
          maxWidth: "450px",
          minWidth: 0,
        }}
      >
        <UserList
          selectedUser={selectedUser}
          setSelectedUser={handleUserClick}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`d-flex flex-grow-1 bg-white flex-column ${
          mobileView === "list" ? "d-none d-md-flex" : "d-flex"
        }`}
        style={{minWidth:0}}
      >
        <ChatArea selectedUser={selectedUser} onBack={handleBack} />
      </div>
    </main>
  );
};

export default AppLayout;