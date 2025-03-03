import { File } from "lucide-react";

function InternalPage() {
  return (
    <div className="hero bg-base-200 h-4/5">
      <div className="hero-content text-center text-accent">
        <div className="max-w-md">
          <File className="inline-block h-48 w-48" />
          <h1 className="mt-2 text-5xl font-bold">Blank Page</h1>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
