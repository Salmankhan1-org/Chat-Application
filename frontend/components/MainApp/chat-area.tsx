'use client';
import { FiSearch, FiMoreVertical, FiSend } from "react-icons/fi";
import { useState } from "react";
import './chat.area.css';

export interface ChatAreaParams{
    selectedUser:any,
    onBack: ()=>void
}

export default function ChatArea({ selectedUser, onBack }:ChatAreaParams) {
    const [message, setMessage] = useState("");

    const messages = [
        { id: 1, text: "Hey 👋", sender: "other", time: "10:00 AM" },
        { id: 2, text: "Hi! How are you?", sender: "me", time: "10:01 AM" },
        { id: 3, text: "I'm good, working on the project.", sender: "other", time: "10:02 AM" },
    ];

    if (!selectedUser) {
        return (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center px-4">
            <h4 className="fw-semibold mb-2">Select a user to start conversation</h4>
            <p className="text-muted mb-0">
            Choose a contact from the left panel to begin chatting.
            </p>
        </div>
        );
    }

    return (
        <div className="chat-container d-flex flex-column h-100">
        <div className="chat-header d-flex align-items-center justify-content-between px-4 py-3">
            <div className="d-flex align-items-center gap-3">
                <button
                className="btn btn-secondary p-0 d-md-none text-decoration-none"
                onClick={onBack}
            >
                Back
            </button>
            <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random&color=fff`}
                className="chat-avatar"
                alt="user"
            />
            <div>
                <h6 className="mb-0 fw-semibold">{selectedUser.name}</h6>
                <small className="text-success">
                {selectedUser.online ? "Online" : "Offline"}
                </small>
            </div>
            </div>

            <div className="d-flex align-items-center gap-3">
            <FiSearch size={18} className="chat-icon" />
            <FiMoreVertical size={18} className="chat-icon" />
            </div>
        </div>

        <div className="chat-body flex-grow-1 overflow-auto px-4 py-3">
            {messages.map((msg) => (
            <div
                key={msg.id}
                className={`d-flex mb-3 ${
                msg.sender === "me" ? "justify-content-end" : "justify-content-start"
                }`}
            >
                <div className={`chat-bubble ${msg.sender === "me" ? "me" : "other"}`}>
                <p className="mb-1">{msg.text}</p>
                <small className="chat-time">{msg.time}</small>
                </div>
            </div>
            ))}
        </div>

        <div className="chat-input d-flex align-items-center px-3 py-2">
            <input
                type="text"
                className="form-control chat-text-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button className="chat-send-btn ms-2">
                <FiSend  />
            </button>
        </div>
        </div>
    );
}