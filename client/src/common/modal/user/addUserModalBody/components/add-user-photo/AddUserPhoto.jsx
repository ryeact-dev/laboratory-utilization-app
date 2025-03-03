import { useState } from "react";

import { CameraOff, Upload } from "lucide-react";

export default function AddUserPhoto({ setUserPhoto, userPhoto, isPhoto }) {
  const imgSrc = userPhoto?.toString().includes("https://" || "http://")
    ? userPhoto
    : userPhoto?.toString().includes("uploads")
      ? import.meta.env.VITE_LOCAL_BASE_URL + userPhoto
      : null;

  const [base64Image, setBase64Image] = useState(imgSrc);

  function uploadPhoto(evt) {
    const file = evt.target.files[0];
    if (!file) return;

    setUserPhoto(file);

    // Convert image to base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
  }

  return (
    <div
      className={`relative h-[135px] w-[135px] overflow-hidden rounded-md bg-white shadow-lg`}
    >
      {base64Image ? (
        <img
          className={`h-full w-full object-center ${
            isPhoto ? "object-cover" : "object-contain"
          }`}
          src={base64Image}
          alt={isPhoto ? "photo container" : "signature container"}
        />
      ) : (
        <CameraOff
          className="mx-auto mt-7 h-20 w-20 object-cover object-center text-gray-800"
          strokeWidth={1}
        />
      )}
      <label className="hover:bg-secondary-focus absolute bottom-2 right-2 cursor-pointer rounded-full bg-secondary p-2 text-black transition duration-300 ease-in-out">
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/webp, image/png"
          multiple
          hidden
          onChange={uploadPhoto}
        />
        <Upload className="size-6 p-0.5 md:size-7" />
      </label>
    </div>
  );
}
