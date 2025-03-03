import { CameraOff } from "lucide-react";
import { useState } from "react";

export default function AddStudentImage({ imagePath }) {
  const [imgError, setImgError] = useState(false);

  const imgSrc = imagePath?.toString().includes("https://" || "http://")
    ? imagePath
    : imagePath?.toString().includes("uploads")
      ? import.meta.env.VITE_LOCAL_BASE_URL + imagePath
      : null;

  // const [base64Image, setBase64Image] = useState(imgSrc);

  // function uploadPhoto(evt) {
  //   const file = evt.target.files[0];
  //   if (!file) return;

  //   setFile(file);

  //   // Convert image to base64 string
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setBase64Image(reader.result);
  //   };
  // }

  return (
    <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-md bg-white shadow-lg">
      {imgSrc && !imgError ? (
        <img
          className="h-full w-full object-contain object-center shadow-lg"
          src={imgSrc}
          alt="image"
          onError={() => setImgError(true)}
        />
      ) : (
        <CameraOff
          className="mx-auto h-20 w-20 object-cover object-center text-gray-900"
          strokeWidth={2}
        />
      )}
    </div>
  );
}
