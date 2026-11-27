"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

function ConfirmDeleteButtons({ close }) {
  const { pending } = useFormStatus();
  return (
    <div className="admin-inline">
      <button type="button" className="admin-secondary" onClick={close} disabled={pending}>Vazgeç</button>
      <button type="submit" className="admin-danger" name="confirmation" value="delete" disabled={pending}>
        {pending ? "Siliniyor…" : "Evet, ürünü sil"}
      </button>
    </div>
  );
}

export default function DeleteProduct({ id, name, action }) {
  const dialog = useRef(null);

  return (
    <div className="admin-delete">
      <button type="button" className="admin-danger" aria-haspopup="dialog" onClick={() => dialog.current.showModal()}>
        Ürünü sil
      </button>
      <dialog ref={dialog} className="admin-delete-dialog" aria-labelledby="delete-product-title">
        <h2 id="delete-product-title">Ürünü silmek istiyor musun?</h2>
        <p><strong>{name}</strong> katalogdan kalıcı olarak silinecek.</p>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <ConfirmDeleteButtons close={() => dialog.current.close()} />
        </form>
      </dialog>
    </div>
  );
}
