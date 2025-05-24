import Image from "next/image";
import React from "react";
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
import { User } from "./MainComponent";

interface ChatUiProps {
  selectedUser: User | null;
}

const ChatUi = ({ selectedUser }: ChatUiProps) => {
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
          <div className="flex items-center justify-center w-10 h-10">
            <Image
              src={selectedUser.avatar_url}
              width={100}
              height={100}
              alt={`${selectedUser.full_name}-avatar`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="ml-3">
            <div className="text-sm font-bold">{selectedUser.full_name}</div>
            <div className="text-xs font-medium text-gray-500">
              Roshnag Airtel, Roshnag Jlo, Bharat Kumar Ramesh, Periskope
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <LuSearch />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-chat-background bg-cover max-h-[537px]">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center">
            <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium text-[0.6rem]">
              22-01-2025
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-green-100 text-green-700 p-2 rounded-tl-md rounded-br-md rounded-bl-md max-w-xs shadow">
              <div className="font-bold text-xs flex items-center gap-x-6">
                <p>Roshnag Airtel</p>
                <p className="text-[0.6rem] text-slate-400">Roshnag Airtel</p>
              </div>
              <div className="text-black text-sm font-medium mt-1">
                Hello, South Euna!
              </div>
              <div className="text-xs text-right text-slate-400">08:01</div>
            </div>
          </div>

          <div className="flex justify-start">
            <Image
              src={selectedUser.avatar_url}
              width={100}
              height={100}
              alt="profile"
              className="w-6 h-6 rounded-full mr-2"
            />
            <div className="bg-white text-green-500 p-2 rounded-tr-md rounded-br-md rounded-bl-md max-w-xs shadow">
              <div className="font-bold text-xs flex items-center gap-x-6">
                <p>{selectedUser.full_name}</p>
                <p className="text-[0.6rem] text-slate-400">+91 12345 67890</p>
              </div>
              <div className="text-black text-sm font-medium mt-1">
                Hello, South Euna!
              </div>
              <div className="text-xs text-right text-slate-400">08:01</div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex flex-col p-3 bg-white border-t border-gray-300">
        <div className="flex mb-3 gap-5">
          <input
            type="text"
            placeholder="Message..."
            className="w-full p-2 focus:outline-none"
          />
          <button className="hover:bg-green-200 cursor-pointer px-3 py-2 rounded-md">
            <IoSend className="text-green-700" size="1.2em" />
          </button>
        </div>

        {/* Icons */}
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiPaperclip className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiSmile className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiClock className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiStar className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiFile className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiMic className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;
