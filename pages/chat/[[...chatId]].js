import Head from "next/head";
import { useState, useEffect } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { Message } from "components/Message";
import { ChatSideBar } from "components/ChatSideBar";
import Modal from "components/Modal";
// import ChatSideBar2 from "components/ChatSideBar2/ChatSideBar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import { Brand } from "components/Brand";
import FileUpload from "components/fileUpload";
import StickyHeader from "components/StickyHeader";

export default function ChatPage({ chatId, title, messages = [] }) {
  console.log("props:", title, messages);
  const [incomingMessage, setIncomingMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [newChatId, setNewChatId] = useState(null);
  const [fullMessage, setFullMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [originalChatId, setOriginalChatId] = useState(chatId);
  const router = useRouter();

  // const routeHasChanged = chatId !== originalChatId;
  // when route changes reset state items
  useEffect(() => {
    setNewChatMessages([]);
    setNewChatId(null);
  }, [chatId]);

  // Save newly streamed message to new chat message
  useEffect(() => {
    if (!generatingResponse && fullMessage) {
      setNewChatMessages((prev) => [
        ...prev,
        {
          _id: uuid(),
          role: "assistant",
          content: fullMessage,
        },
      ]);
      setFullMessage("");
    }
  }, [generatingResponse, fullMessage]);

  // If created new chat then navigate to new chat
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingResponse(true);
    // setOriginalChatId(chatId);
    setNewChatMessages((prev) => {
      const tempNewChatMessages = [
        ...prev,
        {
          _id: uuid(),
          role: "user",
          content: messageText,
        },
      ];
      return tempNewChatMessages;
    });
    setMessageText("");

    const response = await fetch("/api/chat/sendMessage", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ chatId, message: messageText }),
    });
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    let content = "";
    await streamReader(reader, (message) => {
      console.log("MESSAGE: ", message);
      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingMessage((s) => `${s} ${message.content}`);
        content = content + message.content;
      }
    });
    setFullMessage(content);
    setIncomingMessage("");
    setGeneratingResponse(false);
  };

  const allMessages = [...messages, ...newChatMessages];

  async function handleFileUpload(event) {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }

    const files = event.target.files;
    console.log(files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", file);
    });

    // formData.append("otherData", "some data");
    console.log(formData.getAll("files"));

    await fetch("/api/file/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;boundary=None",
      },
      body: formData,
    });
  }

  return (
    <>
      <Head>
        <title>{title ? title : "New chat"}</title>
      </Head>
      <div className=" grid h-screen grid-cols-[260px_1fr]">
        <ChatSideBar chatId={chatId} />
        {/* <ChatSideBar2> CSB2*/}
        {/* <div className=" grid h-screen"> CSB2*/}

        <div className="bg-primary flex flex-col overflow-hidden ">
          <div className="scrollbar-hide flex-1 overflow-scroll text-white">
            {chatId && (
              <StickyHeader
                title={title}
                chatId={chatId}
                allMessages={allMessages}
              />
            )}
            {!allMessages.length && !incomingMessage && (
              <div className="m-auto my-10 flex items-center justify-center text-center">
                <div>
                  <Brand />
                  <h1 className="text-primary mt-2 text-4xl font-bold">
                    Ask me a question!
                  </h1>
                </div>
              </div>
            )}
            {!!allMessages.length && (
              <div className="mb-auto px-40">
                {allMessages.map((message) => (
                  <Message
                    key={message._id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {generatingResponse && (
                  <Message role="assistant" content="Generating Response..." />
                )}
                {!!incomingMessage && (
                  <Message role="assistant" content={incomingMessage} />
                )}
              </div>
            )}
          </div>
          <footer className=" text-primary p-8">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <button
                  className="side-menu-item btn hover:bg-emerald-600"
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Upload
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(false);
                  }}
                >
                  <div className=" text-primary">
                    <FileUpload />
                  </div>
                </Modal>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Message Lawfinity..."}
                  className=" bg-primary focus:bg-primary text-primary my-2 w-full resize-none rounded-md border-emerald-500 p-2 outline-none outline-emerald-500"
                />
                <button className="btn" type="submit">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
      {/* </ChatSideBar2> CSB2*/}
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.chatId?.[0] || null;
  if (chatId) {
    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const chat = await db.collection(process.env.COLLECTION_NAME).findOne({
      userId: user.sub,
      _id: new ObjectId(chatId),
    });
    if (!chat) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          _id: uuid(),
        })),
      },
    };
  }

  return {
    props: {},
  };
};
