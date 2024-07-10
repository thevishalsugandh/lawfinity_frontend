import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export const Message = ({ role, content }) => {
  const { user } = useUser();
  return (
    <div
      className={`text-primary grid grid-cols-[30px_1fr] gap-5 p-5 ${
        role === "assistant" ? " bg-secondary " : ""
      }`}
    >
      <div>
        <Image
          src={role === "assistant" ? "/favicon2.png" : !!user && user.picture}
          width={30}
          height={30}
          alt="User Avatar"
          className="rounded-sm shadow-md shadow-black/50"
        />
      </div>
      <div className="text-primary prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
