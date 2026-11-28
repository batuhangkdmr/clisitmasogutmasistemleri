"use client";

import Image from "next/image";
import { useState } from "react";

const positions = ["Büyük görsel", "Sağ üst görsel", "Sağ alt görsel"];

export default function GalleryIntroFields({ photos, initialIds }) {
  const [selection, setSelection] = useState(initialIds);
  return (
    <div className="admin-gallery-intro-slots">
      {selection.map((id, index) => {
        const photo = photos.find((item) => item.id === id);
        return <div className="admin-gallery-intro-slot" key={positions[index]}>
          {photo && <div className="admin-gallery-intro-preview">
            <Image src={photo.src} alt="" fill sizes="(max-width: 620px) 85vw, 310px" />
          </div>}
          <label>{positions[index]}
            <select name={`introPhoto${index + 1}`} value={id} required onChange={(event) => {
              const value = event.target.value;
              setSelection((current) => current.map((selected, position) => index === position ? value : selected));
            }}>
              {photos.map((item) => <option key={item.id} value={item.id}>{item.title} · {item.number}</option>)}
            </select>
          </label>
        </div>;
      })}
    </div>
  );
}
