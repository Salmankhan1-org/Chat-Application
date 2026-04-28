'use client';
import { FiSearch, FiMoreVertical, FiSend, FiMessageCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import './chat.area.css';
import { Condition } from "../Conditions/Condition";
import { useAuth } from "@/utils/context.provider";
import { formatMessageTime } from "@/utils/format.message.time";
import { IoMdArrowBack } from "react-icons/io";
import { formatLastSeen } from "@/utils/format.last.seen";
import {socket} from '../../utils/socket'

export interface ChatAreaParams{
    selectedUser:any,
    onBack: ()=>void
}

export default function ChatArea({ selectedUser, onBack }:ChatAreaParams) {
    const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const {onlineUsers} = useAuth();

  
  // ✅ JOIN ROOM
  useEffect(() => {
    if (user?._id) {
      socket.emit("join_chat", { userId: user._id });
    }
  }, [user]);

 useEffect(() => {
  if (!user?._id) return;

  const handleReceive = (data: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: data.id,
        text: data.text,
        sender: data.senderId === user._id ? "me" : "other",
        status:'delivered',
        createdAt: data.createdAt,
      },
    ]);
    //  send delivery ACK
    socket.emit("message_delivered", {
      messageId: data.id,
      senderId: data.senderId,
    });

  };

   
  socket.on("receive_message", handleReceive);

  return () => {
    socket.off("receive_message", handleReceive);
  };
}, [user]);

 const handleSend = () => {
  if (!message.trim() || !selectedUser || !user) return;

  socket.emit('stop_typing',{
    senderId: user._id,
    receiverId: selectedUser._id,
  })

  const createdAt = new Date();
  const messageId = crypto.randomUUID();

  const payload = {
    id: messageId,
    text: message,
    senderId: user._id,
    receiverId: selectedUser._id,
    createdAt,
  };

  socket.emit("send_message", payload);

  setMessages((prev) => [
    ...prev,
    {
      id: messageId,
      text: message,
      sender: "me",
      status:'sent',
      createdAt,
    },
  ]);

  setMessage("");
};

useEffect(() => {
  socket.on("typing", () => {
    setIsTyping(true);
  });

  socket.on("stop_typing", () => {
    setIsTyping(false);
  });

  return () => {
    socket.off("typing");
    socket.off("stop_typing");
  };
}, []);


useEffect(() => {
  if (!selectedUser || !user || messages.length === 0) return;

  const lastMsg = messages[messages.length - 1];

  if (lastMsg.sender === "other") {
    socket.emit("message_seen", {
      messageId: lastMsg.id,
      senderId: selectedUser._id,
    });
  }
}, [messages]);

useEffect(() => {
  const handleSeen = ({ messageId }: any) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, status: "seen" }
          : msg
      )
    );
  };

  socket.on("message_seen_ack", handleSeen);

  return () => socket.off("message_seen_ack", handleSeen);
}, []);


useEffect(() => {
  if (!socket) return;

  const handleDelivered = ({ messageId }: any) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, status: "delivered" }
          : msg
      )
    );
  };

  socket.on("message_delivered_ack", handleDelivered);

  return () => socket.off("message_delivered_ack", handleDelivered);
}, [socket]);

const [now, setNow] = useState(Date.now());

    useEffect(() => {
    const interval = setInterval(() => {
        setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
    }, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <Condition>
            <Condition.When isTrue={!selectedUser}>
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center px-4">
                    <div
                        style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px"
                        }}
                    >
                        <FiMessageCircle size={36} color="#2563eb" />
                    </div>

                    <h4 className="fw-semibold mb-2">Start a Conversation</h4>
                    <p className="text-muted mb-0" style={{ maxWidth: "300px" }}>
                        Select a user from the left panel and start chatting instantly.
                    </p>
                    </div>
        </Condition.When>
        <Condition.Else>
            <div className="chat-container d-flex flex-column h-100  ">
        <div className="chat-header d-flex align-items-center justify-content-between px-4 py-3">
            <div className="d-flex align-items-center gap-3">
                <button
                className="btn p-0 d-md-none text-decoration-none"
                onClick={onBack}
            >
                <IoMdArrowBack size={20}/>
            </button>
            <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.username)}&background=random&color=fff`}
                className="chat-avatar"
                alt="user"
            />
            <div>
                <h6 className="mb-0 fw-semibold">{selectedUser?.username}</h6>
                <small className="text-success">
                {isTyping
  ? "Typing..."
  : onlineUsers.includes(selectedUser?._id)
    ? "Online"
    : selectedUser?.lastSeen
      ? `Last seen ${formatLastSeen(selectedUser.lastSeen)}`
      : "Offline"}
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
            className={`d-flex align-items-end mb-3 ${
                msg.sender === "me" ? "justify-content-end" : "justify-content-start"
            }`}
            >
            {/* Avatar (only for other user) */}
            {msg.sender !== "me" && (
                <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.username)}&background=random&color=fff`}
                className="chat-msg-avatar me-2"
                alt="user"
                />
            )}

            <div className={`chat-bubble  ${msg.sender === "me" ? "me" : "other"}`}>
                <p className="mb-1">{msg.text}</p>
                
                <div className="d-flex justify-content-end align-items-center gap-1">
                <small className="chat-time" style={{ fontSize: "10px" }}>
                    {formatMessageTime(msg.createdAt, now)}
                </small>

                {msg.sender === "me" && (
                <span style={{ fontSize: "12px" }}>
                    {msg.status === "sent" && "✓"}
                    {msg.status === "delivered" && "✓✓"}
                    {msg.status === "seen" && (
                    <span style={{ color: "#ee1f1f" }}>✓✓</span> // 🔵 BLUE
                    )}
                </span>
                )}
                </div>
            </div>

            {/* Your avatar */}
            {msg.sender === "me" && (
                <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username ?? 'Me')}&background=random&color=fff`}
                className="chat-msg-avatar ms-2"
                alt="me"
                />
            )}
            </div>
            ))}
            {isTyping && (
            <div className="d-flex align-items-end mb-3 justify-content-start">
                {/* Avatar */}
                <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser?.username)}&background=random&color=fff`}
                className="chat-msg-avatar me-2"
                alt="user"
                />

                {/* Typing bubble */}
                <div className="chat-bubble other typing-bubble">
                <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                </div>
            </div>
            )}
            <div ref={bottomRef} />
        </div>

        <div className="chat-input d-flex align-items-center px-3 py-2">
            <input
                type="text"
                className="form-control chat-text-input"
                placeholder="Type a message..."
                value={message}
                
                onChange={(e)=>{
                    setMessage(e.target.value);

                    if (!selectedUser || !user) return;

                    // 🔥 emit typing
                    socket.emit("typing", {
                        senderId: user._id,
                        receiverId: selectedUser._id,
                    });

                    // ⏱️ debounce stop typing
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }

                    typingTimeoutRef.current = setTimeout(() => {
                        socket.emit("stop_typing", {
                            senderId: user._id,
                            receiverId: selectedUser._id,
                        });
                    }, 1500);
                }}
                
            />
            <button onClick={handleSend} className="chat-send-btn ms-2">
                <FiSend  />
            </button>
        </div>
        
        </div>
        </Condition.Else>
        </Condition>
    );
}

