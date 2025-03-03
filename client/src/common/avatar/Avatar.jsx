import { cn } from "@/lib/utils";
import { CameraOff } from "lucide-react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function Avatar({
  userPhoto,
  className,
  alt,
  isOnline = false,
}) {
  const imgSrc = userPhoto?.toString().includes("https://" || "http://")
    ? userPhoto
    : userPhoto?.toString().includes("uploads")
      ? import.meta.env.VITE_LOCAL_BASE_URL + userPhoto
      : null;

  return (
    <div className="relative rounded-full">
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full",
          className,
        )}
      >
        {imgSrc ? (
          <LazyLoadImage
            key={imgSrc}
            alt={alt}
            effect="blur"
            src={imgSrc}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <CameraOff
            className="h-6 w-6 object-cover object-center"
            strokeWidth={1}
          />
        )}
      </div>
      <span
        className={`absolute bottom-0 end-0 size-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-muted-foreground"}`}
      ></span>
    </div>
  );
}
