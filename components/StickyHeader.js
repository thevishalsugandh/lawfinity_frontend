import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { useState } from "react";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";

const StickyHeader = ({ title, chatId, allMessages }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const exportToTXT = () => {
    console.log(allMessages);

    let txtData = "";

    // Iterate over each message in the conversation
    allMessages.forEach((message) => {
      // Format the message as per your requirement
      txtData += `[${message.role}]: ${message.content}\n`;
    });

    // Trigger the download of the TXT file
    const blob = new Blob([txtData], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "conversation.txt");
  };

  const exportChat = () => {
    exportToTXT();
    // TODO: Export chat functionality
  };

  const handleDelete = async () => {
    // chat delete functionality API Call
    try {
      const response = await fetch("/api/chat/deleteChat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      const data = await response.json();
      console.log(data); // Logging the response from the API
      closeModal();
      router.push("/chat");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-secondary text-primary sticky top-0 z-10 flex items-center justify-between p-4 px-10 shadow-md">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        Title : {title}
      </span>
      <div>
        <button className="btn mx-3" onClick={exportChat}>
          <FontAwesomeIcon icon={faFileArrowDown} className="mr-2" />
          Export
        </button>
        <button
          onClick={openModal}
          className="mr-2 rounded-md border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete
        </button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="bg-secondary rounded-md  p-6 ">
            <h2 className="mt-2 text-lg font-semibold text-red-500">
              Are you sure want to delete the chat ?
            </h2>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-secndary mr-2 rounded-md border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="text-primary bg-tertiary rounded-md px-4 py-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StickyHeader;
