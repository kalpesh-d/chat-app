import { User } from "@/utils/supabase/hooks";
import Image from "next/image";
import { formatDateLabel } from "@/utils/helper";

interface UserProps {
  user: User;
  onClick: (user: User) => void;
  unreadCount?: number; // added prop for unread messages
}

const UserList = ({ user, onClick, unreadCount = 0 }: UserProps) => {
  const isAI = user.id === "groq-ai";

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
            <p className="text-sm font-medium text-gray-400 tracking-tight truncate max-w-[200px]">
              {user.last_message
                ? user.last_message
                : "Start a new conversation"}
            </p>
          </div>
        </div>

        {/* Right side: Unread badge and other info */}
        <div className="flex flex-col items-end gap-1">
          {isAI ? (
            <div className="bg-purple-200 text-purple-600 text-[0.65rem] px-1 py-1 rounded font-medium">
              AI
            </div>
          ) : (
            <div className="bg-green-200 text-green-600 text-[0.65rem] px-1 py-1 rounded font-medium">
              Demo
            </div>
          )}

          {/* Show unread count badge only if unreadCount > 0 */}
          <div
            className={`flex items-center justify-center w-4 h-4 rounded-full text-white text-[0.6rem] font-medium
            ${unreadCount > 0 ? "bg-green-500 visible" : "invisible"}
          `}
          >
            {unreadCount > 0 ? unreadCount : 0}
          </div>

          <span className="text-[0.6rem] font-medium text-gray-400">
            {user.last_message_time
              ? formatDateLabel(user.last_message_time)
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserList;
