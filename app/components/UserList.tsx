import React from "react";

const UserList = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden w-full hover:bg-gray-100">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
            <span className="text-white">T</span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-bold text-gray-900">
              Test Skope Final 5
            </div>
            <div className="text-xs font-medium text-gray-500">
              Support2: This doesn't go on Tuesday...
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-green-200 text-green-600 text-xs px-1.5 py-1 rounded font-medium">
            Demo
          </div>
          <div className="flex items-center justify-center w-4 h-4 bg-green-500 rounded-full text-white">
            <span className="text-[0.70rem] font-medium">4</span>
          </div>
          <span className="text-xs text-gray-400">Yesterday</span>
        </div>
      </div>
    </div>
  );
};

export default UserList;
