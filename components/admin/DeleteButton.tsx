"use client";

export default function DeleteButton({
  confirmText,
  label = "Supprimer",
  className = "text-red-600 font-medium"
}: {
  confirmText: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      className={className}
    >
      {label}
    </button>
  );
}
