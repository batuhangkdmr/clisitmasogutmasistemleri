"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditorForm({ save, submitChanges, onSaved, id, children, remountOnSave = false }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
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
      if (remountOnSave) setRevision((current) => current + 1);
      onSaved?.();
      router.replace(result.next, { scroll: false });
    });
  }

  return (
    <form key={revision} id={id} className="admin-form" action={save} method={save ? undefined : "post"} onSubmit={submit} aria-busy={pending}>
      {error && <p className="admin-notice" role="alert">{error}</p>}
      {typeof children === "function" ? children(pending) : children}
    </form>
  );
}
