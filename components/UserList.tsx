import Image from "next/image";
import { User } from "./MainComponent";

interface UserProps {
  user: User;
  onClick: (user: User) => void;
  unreadCount?: number; // added prop for unread messages
}

const UserList = ({ user, onClick, unreadCount = 0 }: UserProps) => {
  return (
    <div
      onClick={() => onClick(user)}
      className="flex flex-col bg-white overflow-hidden w-full hover:bg-gray-100 cursor-pointer"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10">
            <Image
              src={user.avatar_url}
              width={100}
              height={100}
              alt={`${user.full_name}-avatar`}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="ml-2">
            <p className="text-sm font-bold text-gray-900 tracking-tight">
              {user.full_name}
            </p>
            <p className="text-xs font-medium text-gray-400">
              Start a new conversation
            </p>
          </div>
        </div>

        {/* Right side: Unread badge and other info */}
        <div className="flex flex-col items-end gap-1">
          <div className="bg-green-200 text-green-600 text-xs px-1.5 py-1 rounded font-medium">
            Demo
          </div>

          {/* Show unread count badge only if unreadCount > 0 */}
          {unreadCount > 0 && (
            <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-white text-[0.70rem] font-medium">
              {unreadCount}
            </div>
          )}

          <span className="text-xs text-gray-400">Yesterday</span>
        </div>
      </div>
    </div>
  );
};

export default UserList;
