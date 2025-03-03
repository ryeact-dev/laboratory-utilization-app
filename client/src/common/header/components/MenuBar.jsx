import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/common/ui/sheet";
import LeftSidebar from "@/containers/LeftSidebar";
import lumensDarkModeURL from "@/assets/lumens_final.png";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function MenuBar({ currentUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onCloseSideBar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="justify-bettween flex items-center gap-1 pl-2 pr-4">
        <label
          onClick={() => setIsSidebarOpen(true)}
          className={`p-0 hover:cursor-pointer hover:bg-transparent hover:text-secondary focus:outline-none`}
        >
          <Menu size={28} />
        </label>
        <figure className="hidden w-36 items-center justify-center lg:flex">
          <img src={lumensDarkModeURL} alt="lumens-logo" />
        </figure>
      </div>

      <SheetContent side="left" className="w-[400px] sm:w-[250px]">
        <SheetHeader className="-my-3">
          <SheetTitle>
            <figure className="-ml-2 hidden w-36 items-center justify-center lg:flex">
              <img src={lumensDarkModeURL} alt="lumens-logo" />
            </figure>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <LeftSidebar
          currentUser={currentUser}
          onCloseSideBar={onCloseSideBar}
        />
      </SheetContent>
    </Sheet>
  );
}
