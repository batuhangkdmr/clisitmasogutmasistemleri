"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { imageAccept, imageFileError, imageMaxMb } from "../lib/catalog-image-policy.mjs";

export default function ImagePicker({ label, name = "image", required = false, help }) {
  const input = useRef(null);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    const element = input.current;
    const form = element.form;
    function clearPreview() {
      element.setCustomValidity("");
      setFile(null);
      setError("");
    }
    form?.addEventListener("reset", clearPreview);
    return () => form?.removeEventListener("reset", clearPreview);
  }, []);

  function select(event) {
    const element = event.currentTarget;
    const selected = element.files[0];
    const message = selected ? imageFileError(selected) : "";
    element.setCustomValidity(message);
    setError(message);
    setFile(message ? null : selected ?? null);
  }

  return (
    <div className="admin-image-picker">
      <label>{label}
        <input ref={input} type="file" name={name} accept={imageAccept} required={required} onChange={select} />
        <small>JPG, PNG veya WebP · En fazla {imageMaxMb} MB. {help}</small>
      </label>
      {error && <p className="admin-notice" role="alert">{error}</p>}
      {file && url && <figure className="admin-image-preview">
        <Image unoptimized src={url} alt="Seçilen görselin önizlemesi" width={280} height={180} />
        <figcaption>{file.name} · {(file.size / 1024 / 1024).toLocaleString("tr", { maximumSignificantDigits: 3 })} MB</figcaption>
      </figure>}
    </div>
  );
}
