import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail") || "Teacher";

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail)}&background=f97316&color=fff&rounded=true`;

  return (
    <header className="bg-white rounded-b-3xl px-8 py-4 flex items-center justify-between shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70711 0.292893C9.09763 0.683417 9.09763 1.31658 8.70711 1.70711L3.41421 7H19C19.5523 7 20 7.44772 20 8C20 8.55228 19.5523 9 19 9H3.41421L8.70711 14.2929C9.09763 14.6834 9.09763 15.3166 8.70711 15.7071C8.31658 16.0976 7.68342 16.0976 7.29289 15.7071L0.292893 8.70711C-0.0976311 8.31658 -0.0976311 7.68342 0.292893 7.29289L7.29289 0.292893C7.68342 -0.0976311 8.31658 -0.0976311 8.70711 0.292893Z" fill="#303030"/>
            </svg>

        </button>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3334 3.33333H15C15.4421 3.33333 15.866 3.50893 16.1786 3.82149C16.4911 4.13405 16.6667 4.55797 16.6667 5V16.6667C16.6667 17.1087 16.4911 17.5326 16.1786 17.8452C15.866 18.1577 15.4421 18.3333 15 18.3333H5.00004C4.55801 18.3333 4.13409 18.1577 3.82153 17.8452C3.50897 17.5326 3.33337 17.1087 3.33337 16.6667V5C3.33337 4.55797 3.50897 4.13405 3.82153 3.82149C4.13409 3.50893 4.55801 3.33333 5.00004 3.33333H6.66671" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.5 1.66667H7.49996C7.03972 1.66667 6.66663 2.03976 6.66663 2.5V4.16667C6.66663 4.6269 7.03972 5 7.49996 5H12.5C12.9602 5 13.3333 4.6269 13.3333 4.16667V2.5C13.3333 2.03976 12.9602 1.66667 12.5 1.66667Z" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        <h1 className="text-sm font-extralight text-gray-800">
          {location.pathname === "/upload"
            ? "Exams"
            : location.pathname === "/assignments"
              ? "Assignments"
              : location.pathname === "/classroom"
                ? "My Classroom"
                : location.pathname === "/library"
                  ? "My Library"
                  : "Home"}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="w-10 h-10 rounded-full border-0  flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="22" rx="11" stroke="#303030" stroke-width="2"/>
            <path d="M10.6108 13.5934C10.6108 11.5706 11.1694 10.7037 12.1712 9.85609L12.6528 9.43228C13.25 8.95067 13.6353 8.43053 13.6353 7.62143C13.6353 6.5041 12.9032 5.71427 11.8822 5.71427C10.7649 5.71427 9.9558 6.71601 9.898 8.29568L7.35512 7.75628C7.43217 5.13634 9.32007 3.46034 11.9208 3.46034C14.5407 3.46034 16.3901 5.07855 16.3901 7.44806C16.3901 8.9892 15.6773 9.91389 14.6563 10.6845L14.1169 11.0697C13.3078 11.7055 12.961 12.2834 12.961 13.5934H10.6108ZM11.8244 17.8123C10.8997 17.8123 10.2448 17.1765 10.2448 16.2711C10.2448 15.385 10.8997 14.7492 11.8244 14.7492C12.7299 14.7492 13.3848 15.385 13.3848 16.2711C13.3848 17.1765 12.7299 17.8123 11.8244 17.8123Z" fill="#303030"/>
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full border-0  flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full border-0  flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_5856_311)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.54441 8.66039C6.78395 7.91387 8.54132 6.15651 9.28783 3.91697L10.0344 1.67725L10.625 0L11.2203 1.67725L11.9668 3.91697C12.7133 6.15651 14.4707 7.91387 16.7102 8.66039L18.95 9.40696L20.625 10L18.95 10.5928L16.7102 11.3394C14.4707 12.0859 12.7133 13.8433 11.9668 16.0828L11.2203 18.3225L10.625 20L10.0344 18.3225L9.28783 16.0828C8.54132 13.8433 6.78395 12.0859 4.54441 11.3394L2.30469 10.5928L0 10L2.30469 9.40696L4.54441 8.66039Z" fill="#2B2B2B"/>
                </g>
                <defs>
                <filter id="filter0_i_5856_311" x="0" y="0" width="20.625" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"/>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_5856_311"/>
                </filter>
                </defs>
                </svg>

          </button>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={avatarUrl}
              alt={userEmail}
              className="w-10 h-10 rounded-full border border-gray-200"
            />

            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {userEmail}
              </p>
              <p className="text-xs text-gray-500">Teacher</p>
            </div>

            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
