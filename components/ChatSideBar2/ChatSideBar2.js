// components/Layout.tsx
import classNames from "classnames";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

const ChatSideBar2 = (props) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  return (
    <div
      className={classNames({
        // 👇 use grid layout
        "grid min-h-screen": true,
        // 👇 toggle the width of the sidebar depending on the state
        "grid-cols-sidebar": !collapsed,
        "grid-cols-sidebar-collapsed": collapsed,
        // 👇 transition animation classes
        "transition-[grid-template-columns] duration-300 ease-in-out": true,
      })}
    >
      {/* sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      {/* content */}
      <div className="">{props.children}</div>
    </div>
  );
};
export default ChatSideBar2;
