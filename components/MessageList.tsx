import React from "react";
import { formatDateLabel } from "@/utils/helper";

interface MessageBubbleProps {
  msg: any;
  isOwn: boolean;
  isLast: boolean;
  userName: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageBubble = ({
  msg,
  isOwn,
  isLast,
  userName,
  messagesEndRef,
}: MessageBubbleProps) => (
  <div
    className={`mb-2 flex ${isOwn ? "justify-end" : "justify-start"}`}
    ref={isLast ? messagesEndRef : null}
  >
    <div className="bg-green-100 text-green-700 p-2 rounded-tl-md rounded-br-md rounded-bl-md max-w-xs shadow">
      <div className="font-bold text-xs flex items-center gap-x-6">
        <p>{userName}</p>
        <p className="text-[0.6rem] text-slate-400 font-medium">
          +91 12345 67890
        </p>
      </div>
      <div className="text-gray-800 text-sm/4 font-medium mt-1">
        {msg.message}
      </div>
      <div className="text-[0.6rem] text-right font-medium text-slate-400">
        {new Date(msg.created_at).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  </div>
);

const DateDivider = ({ date }: { date: string }) => (
  <div className="flex justify-center">
    <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium text-[0.6rem]">
      {date}
    </div>
  </div>
);

interface MessageListProps {
  messages: any[];
  currentUser: any;
  selectedUser: any;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList = ({
  messages,
  currentUser,
  selectedUser,
  messagesEndRef,
}: MessageListProps) => {
  let lastDate: string | null = null;
  return messages.map((msg: any, index: number) => {
    const currentDate = formatDateLabel(msg.created_at);
    const showDate = currentDate !== lastDate;
    lastDate = currentDate;
    const isOwn = msg.sender_id === currentUser?.id;
    const isLast = index === messages.length - 1;
    const userName = isOwn ? currentUser?.full_name : selectedUser?.full_name;
    return (
      <React.Fragment key={msg.id}>
        {showDate && <DateDivider date={currentDate} />}
        <MessageBubble
          msg={msg}
          isOwn={isOwn}
          isLast={isLast}
          userName={userName}
          messagesEndRef={messagesEndRef}
        />
      </React.Fragment>
    );
  });
};

export default MessageList;
