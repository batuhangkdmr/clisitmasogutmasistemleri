"use client";

import { useId, useRef } from "react";
import { useFormStatus } from "react-dom";

function ConfirmDeleteButtons({ close, label }) {
  const { pending } = useFormStatus();
  return (
    <div className="admin-inline">
      <button type="button" className="admin-secondary" onClick={close} disabled={pending}>Vazgeç</button>
      <button type="submit" className="admin-danger" name="confirmation" value="delete" disabled={pending}>
        {pending ? "Siliniyor…" : `Evet, ${label} sil`}
      </button>
    </div>
  );
}

export default function DeleteProduct({ id, name, action, label = "ürünü", location = "katalogdan" }) {
  const dialog = useRef(null);
  const titleId = useId();

  return (
    <div className="admin-delete">
      <button type="button" className="admin-danger" aria-haspopup="dialog" onClick={() => dialog.current.showModal()}>
        {label[0].toLocaleUpperCase("tr") + label.slice(1)} sil
      </button>
      <dialog ref={dialog} className="admin-delete-dialog" aria-labelledby={titleId}>
        <h2 id={titleId}>Bu kaydı silmek istiyor musun?</h2>
        <p><strong>{name}</strong> {location} kalıcı olarak silinecek.</p>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <ConfirmDeleteButtons close={() => dialog.current.close()} label={label} />
        </form>
      </dialog>
    </div>
  );
}
