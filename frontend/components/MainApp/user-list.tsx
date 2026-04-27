'use client';
import { useState } from "react";
import { FiSearch, FiArchive, FiPlus } from "react-icons/fi";
import { MdOutlineAddComment } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import "./main.app.css";

export interface UserList{
    selectedUser: any,
    setSelectedUser: (user:any)=>void
}

export default function UserList({selectedUser, setSelectedUser}:UserList) {
  const [activeFilter, setActiveFilter] = useState("All");

  const users = [
    {
      id: 1,
      name: "Salman Khan",
      message: "Hey, are we still meeting for the project update later?",
      time: "11:26 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Aman Verma",
      message: "Bro send me the files ASAP",
      time: "10:10 AM",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Priya Sharma",
      message: "Let's catch up this weekend 😊",
      time: "Yesterday",
      unread: 5,
      online: true,
    },
    {
      id: 4,
      name: "Rahul Singh",
      message: "Done! Check your mail",
      time: "Mon",
      unread: 0,
      online: false,
    },
    {
      id: 5,
      name: "Neha Kapoor",
      message: "Call me when you're free",
      time: "Sun",
      unread: 1,
      online: true,
    },
    {
      id: 6,
      name: "Rohit Mehta",
      message: "😂😂 That was hilarious!",
      time: "Sat",
      unread: 0,
      online: false,
    },
    {
      id: 7,
      name: "Anjali Gupta",
      message: "Meeting rescheduled to 4 PM",
      time: "Fri",
      unread: 3,
      online: true,
    },
    {
      id: 8,
      name: "Karan Malhotra",
      message: "Check the new design I sent",
      time: "Thu",
      unread: 0,
      online: false,
    },
    {
      id: 9,
      name: "Sneha Reddy",
      message: "Good night 🌙",
      time: "Wed",
      unread: 0,
      online: false,
    },
    {
      id: 10,
      name: "Vikram Joshi",
      message: "Let's finalize the budget tomorrow",
      time: "Tue",
      unread: 4,
      online: true,
    },
  ];

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
          {["All", "Unread", "Favorite"].map((item) => (
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
              key={user.id}
              onClick={()=>setSelectedUser(user)}
              className={`chat-item ${
                selectedUser?.id === user.id || (selectedUser === null && index === 0)
                  ? "chat-item-active"
                  : ""
              } d-flex align-items-center px-2 py-2 rounded-3 mb-1`}
              style={{cursor:'pointer'}}
            >
              {/* Avatar */}
              <div className="position-relative me-2 flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random&color=fff&bold=true`}
                  alt={user.name}
                  className="rounded-circle avatar-img"
                />
                {user.online && (
                  <span className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle online-dot"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="d-flex justify-content-between align-items-center mb-0">
                  <strong className="chat-name">{user.name}</strong>
                  <small className="chat-time">{user.time}</small>
                </div>

                <div className="d-flex justify-content-between align-items-center gap-2">
                  <small className="chat-message text-truncate">
                    {user.message}
                  </small>

                  {user.unread > 0 && (
                    <span className="badge rounded-pill unread-badge">
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}