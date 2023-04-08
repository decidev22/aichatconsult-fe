import styles from "@/styles/Home.module.css";
import getConsult from "./getConsult";
import { useRef, useEffect, useState, KeyboardEvent } from "react";

interface Messages {
  messages: string;
}

const ChatBox = () => {
  const handlekeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const chat_box = document.querySelector(".chat-box")!;

    let userMessages: string[] = [];
    let assistantMessages: Messages[] = [];

    const chatInput = document.querySelector(
      ".chat-input input"
    )! as HTMLInputElement;

    const chatMessage = document.createElement("p");
    chatMessage.classList.add("chat-message");
    chatMessage.style.cssText =
      "color: white; background-color: black; padding:0.5rem; border-radius:1rem; margin-bottom: 0.5rem; margin-top: 0.5rem; display: inline-block; padding: 0.5rem;";
    chatMessage.textContent = chatInput.value;

    chat_box.appendChild(chatMessage);

    userMessages.push(chatInput.value);

    chatInput.value = "";

    const response = await fetch("AWS Lambda API", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }),
    });

    const data = await response.json();
    document.getElementById("loader")!.style.display = "none";
    assistantMessages.push(data.assistant);
    const consultMessage = document.createElement("p");
    consultMessage.classList.add("chat-message");
    consultMessage.style.cssText =
      "color: white; background-color: rgba(31,11,101,1); padding:0.5rem; border-radius:1rem; margin-bottom: 0.5rem; margin-top: 0.5rem; display: inline-block; padding: 0.5rem;";
    consultMessage.textContent = data.assistant;
    chat_box.appendChild(consultMessage);
  };

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    chatBox!.scrollTop = chatBox!.scrollHeight;
  }, [chatBoxRef.current?.innerHTML]);

  const loaderfunc = () => {
    document.getElementById("loader")!.style.display = "block";
  };

  return (
    <div className="bg-black">
      <div
        className={`${styles.chatwrapbox}
`}
      >
        <div className="relative flex flex-col w-full ">
          <div className="overflow-auto" ref={chatBoxRef}>
            <div className="p-2 chat-box">
              <div className="chat-message bg-blue-900 rounded-lg px-2">
                Ask me about your life issues.
              </div>
            </div>
            <div id="loader" className="loader display-none"></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gray-900">
        <div className="flex flex-row chat-input">
          <input
            type="text"
            placeholder="Type your message here..."
            className="w-full"
            onKeyDown={handlekeyDown}
          />
          <button
            className="ml-1 bg-indigo-800 text-white rounded-lg px-2 font-poppins"
            onClick={() => {
              sendMessage();
              chatBoxRef.current?.scrollTo({
                top: chatBoxRef.current?.scrollHeight,
                behavior: "smooth",
              });
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
