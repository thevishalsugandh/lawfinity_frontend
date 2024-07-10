// components/Sidebar.tsx
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { useEffect, useState } from "react";
import { defaultNavItems } from "./defaultNavItems";
import {
  faChevronRight,
  faChevronLeft,
  faRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 👇 props to get and set the collapsed state from parent component

const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}) => {
  // 👇 use the correct icon depending on the state.
  const Icon = collapsed ? faChevronRight : faChevronLeft;
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const loadChatList = async () => {
      const response = await fetch("api/chat/getChatList", {
        method: "POST",
      });
      const json = await response.json();
      setChatList(json?.chats || []);
      console.log("CHAT LIST", json);
    };

    loadChatList();
  }, []);

  return (
    <div
      className={cn({
        "fixed z-20 bg-gray-900 text-white md:static md:translate-x-0": true,
        "transition-all duration-300 ease-in-out": true,
        "w-[250px]": !collapsed,
        "w-16": collapsed,
        "-translate-x-full": !shown,
      })}
    >
      <div
        className={cn({
          "sticky inset-0 flex h-screen flex-col justify-between overflow-hidden md:h-full": true,
        })}
      >
        {/* logo, name and collapse button */}
        <div
          className={cn({
            "flex items-center bg-gray-800": true,
            "justify-between p-4 pb-0": !collapsed,
            "justify-center p-4 pb-0": collapsed,
          })}
        >
          {!collapsed && (
            <div className="flex">
              <span className="whitespace-nowrap ">
                <Image
                  src={"/LawfinityLogo.png"}
                  alt="logo image"
                  width={50}
                  height={50}
                  priority="true"
                />
              </span>
              <h1 className="mx-4 p-2 text-xl">Lawfinity</h1>
            </div>
          )}
          <button
            className={cn({
              "grid place-content-center": true, // position
              "hover:bg-gray-800 ": true, // colors
              "h-10 w-10 rounded-full": true, // shape
            })}
            // 👇 set the collapsed state on click
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon className="h-5 w-5" icon={Icon} />
          </button>
        </div>
        {/* New Chat Button */}
        <div
          className={cn({
            "grid place-content-stretch bg-gray-800 p-2 ": true,
          })}
        >
          <div className="flex h-11 items-center gap-2 overflow-hidden rounded-md bg-emerald-500 hover:bg-emerald-600">
            <div className=" flex flex-col ">
              <Link href="/chat" className="m-3 flex gap-2">
                <FontAwesomeIcon className=" h-6 w-6" icon={faPlus} />
                <span>{!collapsed && "New Chat"}</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Chats List */}
        <div className="sticky flex-1 overflow-auto">
          <nav>
            <ul
              className={cn({
                "my-2 flex flex-col items-stretch gap-2": true,
              })}
            >
              {navItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={cn({
                      "flex text-indigo-100 hover:bg-gray-800": true, //colors
                      "transition-colors duration-300": true, //animation
                      "mx-3 h-9 gap-3 rounded-md p-1.5": !collapsed,
                      // "mx-3 h-10 w-10 rounded-full p-2": collapsed,
                    })}
                  >
                    {!collapsed && (
                      <Link href={item.href} className="flex gap-2">
                        {/* {item.icon}  */}
                        <span>{!collapsed && item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Logout Section */}
        <div
          className={cn({
            " flex place-content-stretch bg-gray-800 p-2 ": true,
          })}
        >
          <div className="flex h-11 items-center gap-4 overflow-hidden">
            <div className="flex flex-col ">
              <Link href="/api/auth/logout" className="flex gap-2">
                <FontAwesomeIcon
                  className="h-6 w-6"
                  icon={faRightFromBracket}
                />
                <span>{!collapsed && "Logout"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
