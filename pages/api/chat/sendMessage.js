import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { chatId: chatIdFromParam, message } = await req.json();
    // validate message data
    if (!message || typeof message !== "string" || message.length > 200) {
      return new Response(
        {
          message: "message is required and must be less than 200 characters",
        },
        {
          status: 422,
        }
      );
    }

    let chatId = chatIdFromParam;
    const initialChatMessage = {
      role: "system",
      content:
        "Your name is 'Lawfinity'. An incredible intelligent and quick thinking AI, that always replied with an enthusiastic and positive energy. Your response must be formatted as markdown.",
    };

    let newChatId;
    let chatMessages = [];
    if (chatId) {
      // add message to existing chat
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/addMessageToChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({ chatId, role: "user", content: message }),
        }
      );
      const json = await response.json();
      console.log("JSON response", json);
      chatMessages = json.chat.messages || [];
    } else {
      const response = await fetch(
        `${req.headers.get("origin")}/api/chat/createNewChat`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: req.headers.get("cookie"),
          },
          body: JSON.stringify({ message }),
        }
      );

      const json = await response.json();
      chatId = json._id;
      newChatId = json._id;
      chatMessages = json.messages || [];
    }

    const messagesToInclude = [];
    chatMessages.reverse();
    let usedTokens = 0;
    for (let chatMessage of chatMessages) {
      const messageTokens = chatMessage.content.length / 4;
      usedTokens = usedTokens + messageTokens;
      // maximum 2000 tokens sending as part of history of the existing conversation
      if (usedTokens <= 2000) {
        messagesToInclude.push(chatMessage);
      } else {
        break;
      }
    }

    messagesToInclude.reverse();

    const stream = await OpenAIEdgeStream(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          stream: true,
          messages: [initialChatMessage, ...messagesToInclude],
        }),
      },
      {
        onBeforeStream: ({ emit }) => {
          if (newChatId) {
            emit(chatId, "newChatId");
          }
        },
        onAfterStream: async ({ fullContent }) => {
          await fetch(
            `${req.headers.get("origin")}/api/chat/addMessageToChat`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                cookie: req.headers.get("cookie"),
              },
              body: JSON.stringify({
                chatId,
                role: "assistant",
                content: fullContent,
              }),
            }
          );
        },
      }
    );
    return new Response(stream);
  } catch (error) {
    return new Response(
      { message: "An error occurred in sendMessage" },
      {
        status: 500,
      }
    );
  }
}
