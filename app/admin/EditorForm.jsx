"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditorForm({ save, submitChanges, onSaved, id, children }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");
    startTransition(async () => {
      const result = await (submitChanges ?? save)(data, true).catch(() => ({ error: "Kayıt sonucu alınamadı. Tekrar denemeden önce listeyi kontrol edin." }));
      if (!result) return;
      if (result.error) {
        setError(result.error);
        return;
      }
      form.reset();
      onSaved?.();
      router.replace(result.next, { scroll: false });
    });
  }

  return (
    <form id={id} className="admin-form" action={save} method={save ? undefined : "post"} onSubmit={submit} aria-busy={pending}>
      {error && <p className="admin-notice" role="alert">{error}</p>}
      {typeof children === "function" ? children(pending) : children}
    </form>
  );
}
