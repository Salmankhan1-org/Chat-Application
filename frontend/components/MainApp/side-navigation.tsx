'use client';
import { Fragment, useState } from "react";
import './main.app.css';

import {
  FiMessageCircle,
  FiRadio,
  FiCpu,
  FiUser
} from "react-icons/fi";
import { GrChannel } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import ProfileMenu from "./sidebar-profile-menu";

export default function SideNavigation({ mobileView }: { mobileView: string }) {

  const [active, setActive] = useState(0);

  const navItems = [
    { icon: <FiMessageCircle />, label: "Chats" },
    { icon: <FiRadio />, label: "Status" },
    { icon: <GrChannel />, label: "Channels" },
    { icon: <FiCpu />, label: "AI Chat" },
  ];

  return (
    <Fragment>

      {/* Desktop */}
      <div
        className="d-none d-md-flex flex-column align-items-center bg-white border-end p-3"
        style={{ width: "60px", height: "100vh" }}
      >
        <div className="flex-grow-1 w-100 d-flex flex-column align-items-center">

          {navItems.map((item, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`nav-icon mb-3 ${active === i ? "active" : ""}`}
              data-tooltip-id={`nav-tip-${i}`}
              data-tooltip-content={item.label}
            >
              {item.icon}

              {/* Tooltip */}
              <Tooltip
                id={`nav-tip-${i}`}
                place="right"
                offset={10}
              />
            </div>
          ))}

        </div>

        {/* Profile */}
        <div
          className="mt-auto nav-icon"
          data-tooltip-id="profile-tip"
          data-tooltip-content="Profile"
        >
          <FiUser />

          <Tooltip id="profile-tip" place="right" />
        </div>
      </div>

      {/* Mobile */}
      {mobileView === 'list' && (
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

          <ProfileMenu />
        </div>
      )}

    </Fragment>
  );
}