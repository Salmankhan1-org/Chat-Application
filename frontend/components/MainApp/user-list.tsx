'use client';
import { useState } from "react";
import { FiSearch, FiArchive, FiPlus } from "react-icons/fi";
import { MdOutlineAddComment } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import "./main.app.css";
import { useAuth } from "@/utils/context.provider";

export interface UserList{
    users:any[],
    selectedUser: any,
    setSelectedUser: (user:any)=>void
}

export default function UserList({users,selectedUser, setSelectedUser}:UserList) {
  const [activeFilter, setActiveFilter] = useState("All");
  const {onlineUsers} = useAuth();

  console.log(onlineUsers);



  return (
    <div className="userlist-container d-flex flex-column h-100 border-end">
      <div className="userlist-inner d-flex flex-column h-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="userlist-title mb-0">ChitChat</h4>

          <button className="new-chat-btn" aria-label="New Chat">
            <MdOutlineAddComment size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="input-group mb-3 search-box">
          <span className="input-group-text bg-transparent border-0 ps-3">
            <FiSearch color="#94a3b8" />
          </span>
          <input
            type="text"
            placeholder="Search Friends"
            className="form-control bg-transparent border-0 shadow-none search-input"
          />
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {["All", "Unread", "Favorite", "Requests"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`btn btn-sm rounded-pill px-3  filter-btn ${
                activeFilter === item ? "filter-active" : "filter-inactive"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Archived */}
        <div className="archived-box d-flex align-items-center p-2 mb-2">
          <IoArchiveOutline className="me-4" color="#64748b" size={17} />
          <span className="me-2">Archived</span>
          <span className=" ">
            (12)
          </span>
        </div>

        {/* Chat List */}
        <div
          className="flex-grow-1 overflow-auto pe-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          {users.map((user, index) => (
            <div
              key={user._id}
              onClick={()=>setSelectedUser(user)}
              className={`chat-item ${
                selectedUser?._id === user._id || (selectedUser === null && index === 0)
                  ? "chat-item-active"
                  : ""
              } d-flex align-items-center px-2 py-2 rounded-3 mb-1`}
              style={{cursor:'pointer'}}
            >
              {/* Avatar */}
              <div className="position-relative me-2 flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.username
                  )}&background=random&color=fff&bold=true`}
                  alt={user?.username}
                  className="rounded-circle avatar-img"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle online-dot"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="d-flex justify-content-between align-items-center mb-0">
                  <strong className="chat-name">{user?.username}</strong>
                  {/* <small className="chat-time">{user.time}</small> */}
                </div>

                {/* <div className="d-flex justify-content-between align-items-center gap-2">
                  <small className="chat-message text-truncate">
                    {user.message}
                  </small>

                  {user.unread > 0 && (
                    <span className="badge rounded-pill unread-badge">
                      {user.unread}
                    </span>
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}