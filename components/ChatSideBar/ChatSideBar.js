import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Brand } from "components/Brand";
import { Message } from "components/Message";
import Modal from "components/Modal";
import UserProfileCard from "components/UserProfileCard";

export const ChatSideBar = ({ chatId }) => {
  const [chatList, setChatList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const loadChatList = async () => {
      const response = await fetch("/api/chat/getChatList", {
        method: "POST",
      });
      const json = await response.json();
      setChatList(json?.chats || []);
      console.log("CHAT LIST", json);
    };

    loadChatList();
  }, [chatId]);

  return (
    <div className="bg-secondary text-primary flex flex-col  overflow-hidden">
      <div className=" mt-2">
        <Brand />
        <Link
          href="/chat"
          className="side-menu-item text-secondary bg-emerald-500 hover:bg-emerald-600"
        >
          <FontAwesomeIcon icon={faPlus} className="text-secondary" /> New Chat
        </Link>
      </div>
      <div className=" bg-secondary flex-1 overflow-auto">
        {chatList.map((chat) => (
          <Link
            key={chat._id}
            href={chat._id}
            className={`side-menu-item ${
              chatId == chat._id ? "hover:bg-tertiary bg-tertiary" : ""
            }`}
          >
            <span
              title={chat.title}
              className="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {chat.title}
            </span>
          </Link>
        ))}
      </div>
      <div className="bg-tertiary text-primary hover:bg-quaternary m-2 rounded-md">
        <button onClick={openModal}>
          <Message role="user" content="View Profile" />
        </button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="bg-secondary text-primary">
            <UserProfileCard />
          </div>
        </Modal>
      </div>
    </div>
  );
};
