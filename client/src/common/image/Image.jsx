import { useState, useEffect } from "react";

export function Image({ src, ...rest }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    let objectUrl;
    if (!src) return;

    if (src.toString().includes("uploads")) {
      setImgSrc(process.env.REACT_APP_LOCAL_BASE_URL + src);
    } else {
      objectUrl = URL.createObjectURL(src);
      setImgSrc(objectUrl);
    }

    // Revoke the object URL after the image has finished loading
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return <img {...rest} src={imgSrc} alt={""} loading="lazy" />;
}
