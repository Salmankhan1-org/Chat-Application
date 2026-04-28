'use client';
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/utils/context.provider";

export default function ProfileMenu() {
  const { logout } = useAuth();

  return (
    <div className="mt-auto dropdown">
      
      {/* Trigger (no extra size, no arrow) */}
      <div
        className="nav-icon"
        // role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ cursor: "pointer" }}
      >
        <FiUser />
      </div>

      {/* Dropdown */}
      <ul className="dropdown-menu border-0 shadow-sm">
        <li>
          <button
            className="dropdown-item d-flex align-items-center text-danger"
            onClick={logout}
          >
            <FiLogOut className="me-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}