import { NavLink } from "react-router-dom";
import { 
  School,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { name: "Home", path: "/home", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 11.6667H11.6666V17.5H17.5V11.6667Z" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33333 11.6667H2.5V17.5H8.33333V11.6667Z" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 2.5H11.6666V8.33333H17.5V2.5Z" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
) },

    { name: "My Classroom", path: "/classroom", icon: (<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.0053 0C19.1069 0 20 0.867353 20 1.93727V12.0627C20 12.8063 19.5687 13.452 18.9357 13.7767C18.7114 13.0842 18.552 12.599 18.4574 12.321C18.403 12.1608 18.3777 12.011 18.2979 11.8819C18.2236 11.7617 18.1006 11.6182 17.9791 11.4747L17.9521 11.4428C17.5516 10.968 17.0414 10.3553 16.609 9.82839C16.1946 9.32331 15.8524 8.89639 15.7181 8.78227C15.3989 8.51105 14.9468 8.21401 14.2686 8.21401H9.66755C9.62487 8.2067 9.53035 8.1911 9.41489 8.14943C8.91888 7.97045 7.88479 7.51948 7.36702 7.30995C6.21465 6.13586 5.35029 5.25332 4.77394 4.66235C4.72638 4.61361 4.61117 4.49397 4.42827 4.30347C4.20391 4.06978 3.83109 4.04594 3.57713 4.24907C3.32508 4.45067 3.28322 4.81013 3.48253 5.06133C5.29064 7.33994 6.21755 8.50276 6.2633 8.5498C6.37468 8.66433 6.70673 8.87699 7.11436 9.1439C7.53415 9.41875 8.03354 9.75 8.41755 10.0092C8.77511 10.2505 8.97606 10.3192 9.01596 10.655C9.10394 11.3955 9.21032 12.5105 9.33511 14H1.99468C0.893058 14 0 13.1326 0 12.0627V1.93727C0 0.867353 0.893058 0 1.99468 0H18.0053ZM15.7979 11.7915C15.9066 11.7819 16.0276 11.915 16.0771 11.9594C16.2486 12.1131 16.3003 12.1721 16.4096 12.2694C16.5691 12.4114 16.7331 12.5764 16.7553 12.6051C16.9727 12.99 17.2919 13.7639 17.4073 14L15.4654 14C15.5489 13.0617 15.6021 12.459 15.625 12.1919C15.6516 11.8819 15.6891 11.8011 15.7979 11.7915ZM12.4734 3.06088C11.1955 3.06088 10.1596 4.06699 10.1596 5.30811C10.1596 6.54922 11.1955 7.55534 12.4734 7.55534C13.7513 7.55534 14.7872 6.54922 14.7872 5.30811C14.7872 4.06699 13.7513 3.06088 12.4734 3.06088Z" fill="#5E5E5E" fill-opacity="0.8"/>
</svg>
) },

    { name: "Assignments", path: "/assignments", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 14.1667H12.5" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/>
<path d="M7.5 10.8333H12.5" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/>
<path d="M7.5 7.5H8.33333" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round"/>
<path d="M4.16663 5C4.16663 3.61929 5.28591 2.5 6.66663 2.5H10.9763C11.4183 2.5 11.8422 2.67559 12.1548 2.98816L15.3451 6.17851C15.6577 6.49107 15.8333 6.915 15.8333 7.35702V15C15.8333 16.3807 14.714 17.5 13.3333 17.5H6.66663C5.28591 17.5 4.16663 16.3807 4.16663 15V5Z" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2"/>
<path d="M10.8334 2.5V4.16667C10.8334 6.00762 12.3258 7.5 14.1667 7.5H15.8334" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2"/>
</svg>
) },

    { name: "Exams", path: "/upload", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3334 3.33334H15C15.4421 3.33334 15.866 3.50894 16.1786 3.8215C16.4911 4.13406 16.6667 4.55798 16.6667 5.00001V16.6667C16.6667 17.1087 16.4911 17.5326 16.1786 17.8452C15.866 18.1577 15.4421 18.3333 15 18.3333H5.00004C4.55801 18.3333 4.13409 18.1577 3.82153 17.8452C3.50897 17.5326 3.33337 17.1087 3.33337 16.6667V5.00001C3.33337 4.55798 3.50897 4.13406 3.82153 3.8215C4.13409 3.50894 4.55801 3.33334 5.00004 3.33334H6.66671" stroke="#303030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5 1.66666H7.49996C7.03972 1.66666 6.66663 2.03975 6.66663 2.49999V4.16666C6.66663 4.62689 7.03972 4.99999 7.49996 4.99999H12.5C12.9602 4.99999 13.3333 4.62689 13.3333 4.16666V2.49999C13.3333 2.03975 12.9602 1.66666 12.5 1.66666Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
)},

    { name: "My Library", path: "/library", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.6751 13.2417C17.1449 14.4954 16.3157 15.6002 15.2599 16.4594C14.2042 17.3187 12.954 17.9062 11.6187 18.1707C10.2835 18.4351 8.90374 18.3685 7.60017 17.9765C6.29661 17.5845 5.10891 16.8792 4.1409 15.9222C3.1729 14.9652 2.45406 13.7856 2.04725 12.4866C1.64043 11.1876 1.55802 9.80874 1.80722 8.47053C2.05641 7.13232 2.62963 5.87553 3.47676 4.81003C4.32388 3.74453 5.41912 2.90277 6.66672 2.35834" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 9.99999C18.3333 8.90564 18.1178 7.82201 17.699 6.81096C17.2802 5.79991 16.6664 4.88125 15.8926 4.10743C15.1187 3.33361 14.2001 2.71978 13.189 2.30099C12.178 1.8822 11.0943 1.66666 10 1.66666V9.99999H18.3333Z" stroke="#5E5E5E" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
)},
  ];

  return (
    <aside className={`${isCollapsed ? 'w-24' : 'w-64'} bg-white rounded-r-3xl flex flex-col h-screen py-6 px-4 shadow-sm border-r border-gray-100 shrink-0 transition-all duration-300`}>
      <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'} px-2 mb-8`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
          <svg width="40" height="40" className="shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="10" fill="#303030"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.7272 28.3583C22.7272 28.3583 23.4546 30.3003 24.1213 30.4218H15.697C13.9999 30.4218 12.4851 29.4508 11.9999 27.6299L7.09086 13.0636C7.09086 13.0636 6.66681 11.3035 6.00012 11.0001H14.6063C16.3034 11.0609 17.4549 11.6677 18.1216 13.9135L22.7272 28.3583Z" fill="white"/>
<path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M22.7272 28.3583C22.7272 28.3583 23.4546 30.3003 24.1213 30.4218H15.697C13.9999 30.4218 12.4851 29.4508 11.9999 27.6299L7.09086 13.0636C7.09086 13.0636 6.66681 11.3035 6.00012 11.0001H14.6063C16.3034 11.0609 17.4549 11.6677 18.1216 13.9135L22.7272 28.3583Z" fill="url(#paint0_linear_5856_321)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.3334 28.3585C17.3334 28.3585 16.6059 30.3005 15.9392 30.4221H24.3635C26.0606 30.4221 27.5754 29.4511 28.0607 27.6302L32.9093 13.0643C32.9093 13.0643 33.3334 11.3042 34.0001 11.0008H25.4542C23.7571 11.0008 22.6664 11.6076 21.9997 13.8535L17.3334 28.3585Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_5856_321" x1="15.0607" y1="9.34906" x2="15.0607" y2="32.1338" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="0.33" stop-color="white" stop-opacity="0"/>
<stop offset="0.76" stop-color="#0E1513"/>
<stop offset="1" stop-color="#0E1513"/>
</linearGradient>
</defs>
</svg>

          {!isCollapsed && <span className="text-xl font-bold text-gray-800 tracking-tight">Pramana</span>}
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors shrink-0">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <button className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-2 px-4'} w-full py-3 bg-[#1e1e1e] text-white rounded-xl mb-8 border border-orange-500 shadow-sm hover:bg-[#2a2a2a] transition-colors`}>
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z" fill="white"/>
</svg>
        {!isCollapsed && <span className="font-medium text-sm">AI Teacher's Toolkit</span>}
      </button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl transition-colors font-medium text-sm ${
                isActive
                  ? "bg-gray-100 text-black"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={isCollapsed ? item.name : undefined}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`mt-auto bg-gray-100 rounded-xl ${isCollapsed ? 'p-2 justify-center' : 'p-4'} flex items-center gap-3 border border-gray-100`}>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm border border-gray-200 shrink-0">
          <School size={20} />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">Springfield High</p>
            <p className="text-xs text-gray-500 truncate">Demo School</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
