import { createClient } from "@/utils/supabase/server";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import { AiFillHome } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { IoListSharp, IoTicket } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { HiMegaphone } from "react-icons/hi2";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";
import { MdChecklist } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <main>
      <Sidebar>
        <SidebarItem
          icon={<AiFillHome size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<BsChatDotsFill size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<IoTicket size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<GoGraph size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<IoListSharp size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<HiMegaphone size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        {/* <SidebarItem
          icon={<branch size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        /> */}
        <SidebarItem
          icon={<RiContactsBookFill size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<RiFolderImageFill size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<MdChecklist size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
        <SidebarItem
          icon={<IoIosSettings size="1.5em" className="text-gray-600" />}
          text="Home"
          active
        />
      </Sidebar>
      {/* <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center">
          Hello {data?.user?.user_metadata?.full_name || "World"}!
        </h1>
      </div> */}
    </main>
  );
}
