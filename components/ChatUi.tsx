"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FiClock, FiPaperclip, FiSmile } from "react-icons/fi";
import { IoArrowDownOutline, IoSend } from "react-icons/io5";
import { LuChevronsUpDown, LuSearch } from "react-icons/lu";
import { createClient } from "@/utils/supabase/client";
import { useMessages, User } from "@/utils/supabase/hooks";
import MessageList from "./MessageList";
import { HiSparkles } from "react-icons/hi2";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import { BsFillMicFill } from "react-icons/bs";
import { FaBars } from "react-icons/fa";

interface ChatUiProps {
  selectedUser: User | null;
}

const ChatUi = ({ selectedUser }: ChatUiProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Fetch current logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          full_name: String(
            user.user_metadata?.full_name || user.email || "User"
          ),
          email: String(user.email || ""),
          avatar_url: String(
            user.user_metadata?.avatar_url || "/default-avatar.png"
          ),
        });
      }
    };
    fetchCurrentUser();
  }, []);

  // Use the custom hook for messages
  const { messages, sendMessage } = useMessages(currentUser, selectedUser);

  // Auto scroll to last message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll events to show/hide scroll button
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // Show button if user has scrolled up more than 100px from bottom
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
      console.log("Scroll position:", {
        scrollTop,
        scrollHeight,
        clientHeight,
        isScrolledUp,
      });
      setShowScrollButton(isScrolledUp);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShowScrollButton(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center min-h-[91vh]">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-around h-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white text-black border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={selectedUser.avatar_url}
              width={100}
              height={100}
              alt={`${selectedUser.full_name}-avatar`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold">{selectedUser.full_name}</p>
            <p className="text-xs font-medium text-gray-500">
              {selectedUser.email}
            </p>
          </div>
        </div>
        <div className="flex gap-x-4 mr-3">
          <HiSparkles className="rotate-180 cursor-pointer" />
          <LuSearch className="cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto bg-chat-background bg-cover min-h-[537px] max-h-[537px] relative"
      >
        <div className="flex flex-col space-y-4">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            selectedUser={selectedUser}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <div className="sticky bottom-0 left-0 right-0 flex justify-center">
            <button
              onClick={scrollToBottom}
              className="bg-white px-2 py-1 text-gray-500 rounded shadow hover:bg-slate-100 transition-colors duration-200"
            >
              <IoArrowDownOutline size="1em" />
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col p-3 bg-white border-t border-gray-300">
        <form className="flex mb-3 gap-5" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="hover:bg-green-200 cursor-pointer px-3 py-2 rounded-md">
            <IoSend className="text-green-700" size="1.2em" />
          </button>
        </form>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            {[
              FiPaperclip,
              FiSmile,
              FiClock,
              AiOutlineHistory,
              HiOutlineSparkles,
              BsFillMicFill,
              FaBars,
            ].map((Icon, idx) => (
              <button
                key={idx}
                className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
              >
                <Icon className="text-gray-800" />
              </button>
            ))}
          </div>

          <div className="border border-gray-200 px-2 py-1 rounded-md flex items-center cursor-pointer hover:bg-gray-100">
            <Image
              src="/periskope.svg"
              alt="logo "
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-xs font-semibold">Periskope</span>
            <LuChevronsUpDown className="ml-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;
