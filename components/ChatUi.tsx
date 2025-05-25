"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import {
  FiClock,
  FiFile,
  FiMic,
  FiPaperclip,
  FiSmile,
  FiStar,
} from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { createClient } from "@/utils/supabase/client";
import { useMessages, User } from "@/utils/supabase/hooks";
import MessageList from "./MessageList";

interface ChatUiProps {
  selectedUser: User | null;
}

const ChatUi = ({ selectedUser }: ChatUiProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white text-black">
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
        <LuSearch />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-chat-background bg-cover min-h-[537px] max-h-[537px]">
        <div className="flex flex-col space-y-4">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            selectedUser={selectedUser}
            messagesEndRef={messagesEndRef}
          />
        </div>
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

        {/* Icons */}
        <div className="flex justify-between">
          <div className="flex space-x-2">
            {[FiPaperclip, FiSmile, FiClock, FiStar, FiFile, FiMic].map(
              (Icon, idx) => (
                <button
                  key={idx}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Icon className="text-gray-600" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;
