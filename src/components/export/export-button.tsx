"use client";

// =============================================================================
// Bouton d'export avec menu deroulant
// =============================================================================

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ExportOption {
  label: string;
  url: string;
}

interface ExportButtonProps {
  options: ExportOption[];
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
}

export function ExportButton({
  options,
  label = "Exporter",
  variant = "outline",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (url: string) => {
    setIsLoading(true);
    setIsOpen(false);

    try {
      const res = await fetch(url);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'export");
      }

      // Recuperer le nom du fichier depuis le header
      const contentDisposition = res.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || "export.csv";

      // Telecharger le fichier
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Export termine");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'export");
    } finally {
      setIsLoading(false);
    }
  };

  if (options.length === 1) {
    return (
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleExport(options[0].url)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Export...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {label}
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant={variant}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Export...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {label}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => handleExport(option.url)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

