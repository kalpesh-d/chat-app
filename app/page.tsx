import Header from "@/components/Header";
import SidebarItems from "@/components/SidebarItems";
import MainComponent from "@/components/MainComponent";

export default function Home() {
  return (
    <section className="flex">
      <SidebarItems />
      <div className="w-full">
        <Header />
        <MainComponent />
      </div>
    </section>
  );
}
