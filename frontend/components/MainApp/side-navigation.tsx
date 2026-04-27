'use client'
import { Fragment, useState } from "react";
import './main.app.css'
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

import { 
  FiMessageCircle, 
  FiRadio, 
  FiUsers, 
  FiCpu, 
  FiUser 
} from "react-icons/fi";
import { GrChannel } from "react-icons/gr";

export default function SideNavigation() {

  const [active, setActive] = useState(0);

  const navItems = [
    { icon: <FiMessageCircle />, label: "Chats" },
    { icon: <FiRadio />, label: "Status" },
    { icon: <GrChannel />, label: "Channels" },
    { icon: <FiCpu />, label: "AI Chat" },
  ];

  return (
    <Fragment>

      
      <div
        className="d-none d-md-flex flex-column align-items-center bg-white border-end p-3"
        style={{ width: "60px", height: "100vh" }}
      >
        <div className="flex-grow-1 w-100 d-flex flex-column align-items-center">
          {navItems.map((item, i) => (
            <Tippy
              key={i}
              content={item.label}
              placement="right"
              animation="shift-away"
              theme="bluise"
              delay={[100, 0]}
            >
              <div
                onClick={() => setActive(i)}
                className={`nav-icon mb-3 ${active === i ? "active" : ""}`}
              >
                {item.icon}
              </div>
            </Tippy>
          ))}
        </div>

        {/* Profile */}
        <Tippy content="Profile" placement="right" animation="shift-away" theme="bluise">
          <div className="mt-auto nav-icon">
            <FiUser />
          </div>
        </Tippy>
      </div>

      {/* Mobile */}
      <div className="d-md-none fixed-bottom bg-white border-top d-flex justify-content-around py-2">
        {navItems.map((item, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`nav-icon ${active === i ? "active" : ""}`}
          >
            {item.icon}
          </div>
        ))}
        <div className="nav-icon">
          <FiUser />
        </div>
      </div>

    </Fragment>
  );
}