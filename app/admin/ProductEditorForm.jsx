"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { imageAccept, imageFileError, imageMaxMb } from "../lib/catalog-image-policy.mjs";
import { saveProduct, uploadProductImage } from "./actions";
import EditorForm from "./EditorForm";

function LocalPreview({ file }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return src && <Image src={src} width={96} height={72} alt="" unoptimized />;
}

export default function ProductEditorForm({ images, children }) {
  const [entries, setEntries] = useState(() => images.map((image) => ({ key: image.id, image })));
  const [selectionError, setSelectionError] = useState("");
  const [progress, setProgress] = useState("");
  const receipts = useRef(new Map());
  const nextKey = useRef(0);

  function addImages(event) {
    const added = [];
    let error = "";
    for (const file of event.currentTarget.files) {
      const reason = imageFileError(file);
      if (reason) {
        error = `${file.name} yüklenemedi. ${reason}`;
      } else {
        added.push({ key: `new-${nextKey.current++}`, file });
      }
    }
    event.currentTarget.value = "";
    setSelectionError(error);
    setEntries((current) => [...current, ...added]);
  }

  function moveImage(from, to) {
    setEntries((current) => {
      const reordered = [...current];
      reordered.splice(to, 0, ...reordered.splice(from, 1));
      return reordered;
    });
  }

  async function submitChanges(data) {
    const ordered = [];
    try {
      for (const [index, entry] of entries.entries()) {
        if (entry.image) {
          ordered.push({ id: entry.image.id });
          continue;
        }
        let receipt = receipts.current.get(entry.key);
        if (!receipt) {
          setProgress(`Görsel yükleniyor (${index + 1}/${entries.length})…`);
          const upload = new FormData();
          upload.set("id", data.get("id"));
          upload.set("image", entry.file);
          const result = await uploadProductImage(upload);
          if (result.error) return { error: `${entry.file.name}: ${result.error}` };
          receipt = result.receipt;
          receipts.current.set(entry.key, receipt);
        }
        ordered.push({ receipt });
      }
      data.set("imageOrder", JSON.stringify({ previousIds: images.map(({ id }) => id), entries: ordered }));
      setProgress("Ürün kaydediliyor…");
      return await saveProduct(data, true);
    } finally {
      setProgress("");
    }
  }

  function clearGallery() {
    receipts.current.clear();
    setEntries([]);
    setSelectionError("");
  }

  return (
    <EditorForm id="admin-product-editor" submitChanges={submitChanges} onSaved={clearGallery}>
      {(pending) => <>
        {children}
        <fieldset className="admin-gallery" disabled={pending}>
          <legend>Ürün görselleri</legend>
          <p className="store-muted" id="admin-gallery-help">
            Listenin ilk görseli ürün kartında kapak olarak görünür. JPG, PNG veya WebP, dosya başına en fazla {imageMaxMb} MB.
          </p>
          <label>Görsel ekle
            <input type="file" accept={imageAccept} multiple onChange={addImages} aria-describedby="admin-gallery-help" />
          </label>
          {selectionError && <p className="admin-notice" role="alert">{selectionError}</p>}
          {entries.length > 0 && <ol className="admin-gallery-list">
            {entries.map(({ key, image, file }, index) => (
              <li className="admin-gallery-item" key={key}>
                {file ? <LocalPreview file={file} /> : <Image src={image.url} width={96} height={72} alt={image.alt} />}
                <div className="admin-gallery-details">
                  <strong>{index === 0 ? "1 · Kapak görseli" : `${index + 1}. görsel`}</strong>
                  {file && <small>{file.name}</small>}
                  <div className="admin-inline">
                    <button type="button" className="admin-secondary" disabled={index === 0}
                      aria-label={`${index + 1}. görseli yukarı taşı`} onClick={() => moveImage(index, index - 1)}>↑</button>
                    <button type="button" className="admin-secondary" disabled={index === entries.length - 1}
                      aria-label={`${index + 1}. görseli aşağı taşı`} onClick={() => moveImage(index, index + 1)}>↓</button>
                    {index > 0 && <button type="button" className="admin-secondary" onClick={() => moveImage(index, 0)}>Kapak yap</button>}
                    <button type="button" className="admin-danger" aria-label={`${index + 1}. görseli kaldır`} onClick={() => {
                      receipts.current.delete(key);
                      setEntries((current) => current.filter((entry) => entry.key !== key));
                    }}>Kaldır</button>
                  </div>
                </div>
              </li>
            ))}
          </ol>}
        </fieldset>
        {progress && <p className="admin-notice" role="status">{progress}</p>}
      </>}
    </EditorForm>
  );
}
