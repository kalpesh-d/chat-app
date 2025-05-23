import React from "react";

const ChatUI = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-full">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
            <span className="text-white">T</span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              Test Skope Final 5
            </div>
            <div className="text-xs text-gray-500">
              Support2: This doesn't go on Tuesday...
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Yesterday</span>
          <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white">
            <span>4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
