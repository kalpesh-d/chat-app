"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useState } from "react";

export function AddUserChat({
  onChatCreated,
}: {
  onChatCreated: (chatId: string) => void;
}) {
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .ilike("full_name", `%${search}%`);

    if (error) console.error(error);
    else setResults(data);

    setLoading(false);
  };

  const handleSelect = async (userId: string) => {
    const { data, error } = await supabase.rpc("create_direct_message_chat", {
      other_user_id: userId,
    });

    if (error) {
      console.error(error);
    } else {
      onChatCreated(data); // send chat_id to parent
    }
  };

  return (
    <div className="p-4 rounded w-full mx-auto">
      <h2 className="text-lg font-semibold mb-2">Start a User</h2>
      <div className="flex gap-2 mb-4 w-md">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded focus:outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user by name"
          required
        />
        <button
          onClick={handleSearch}
          className={`bg-green-600 text-white px-3 rounded ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <ul className="space-y-1">
          {results.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className="cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-0 w-md"
            >
              <div className="flex items-center">
                <Image
                  src={user.avatar_url}
                  alt={user.full_name}
                  width={100}
                  height={100}
                  className="h-9 w-9 rounded-full mr-2"
                />
                <article>
                  <p className="font-semibold text-sm">{user.full_name}</p>
                  <p className="font-medium text-[0.8rem] text-gray-500">
                    {user.email}
                  </p>
                </article>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
