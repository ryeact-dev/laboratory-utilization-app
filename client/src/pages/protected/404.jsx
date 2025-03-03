import { useEffect } from "react";
import { headerStore } from "@/store";
import { Frown } from "lucide-react";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "" });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
      <div className="space-y-4 text-center text-accent">
        <Frown className="inline-block h-48 w-48" />
        <h1 className="text-5xl font-semibold">404 - Not Found</h1>
      </div>
    </div>
  );
}

export default InternalPage;
