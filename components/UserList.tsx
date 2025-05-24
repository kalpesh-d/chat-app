import Image from "next/image";

interface User {
  full_name: string;
  email: string;
  avatar_url: string;
}

interface UserProps {
  user: User;
}

const UserList = ({ user }: UserProps) => {
  console.log(user);

  return (
    <div className="flex flex-col bg-white overflow-hidden w-full hover:bg-gray-100">
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
