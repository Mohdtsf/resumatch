"use client";

import { useCallback, useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { MAX_FILE_SIZE } from "@/lib/utils/constants";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function FileUpload({ onFileSelected, selectedFile, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (file: File) => {
      setError(null);

      // Client-side validation (server also validates magic bytes)
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext !== "pdf" && ext !== "docx") {
        setError("Only PDF and DOCX files are accepted.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
        return;
      }

      if (file.size === 0) {
        setError("File appears to be empty.");
        return;
      }

      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleClick = () => inputRef.current?.click();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div>
      <div
        className={`upload-zone ${isDragging ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        id="file-upload-zone"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="hidden"
          id="file-upload-input"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            {/* File icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "var(--accent-500)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 15l2 2 4-4" />
              </svg>
            </div>

            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                {selectedFile.name}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                {formatFileSize(selectedFile.size)} •{" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                    setError(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="underline hover:opacity-80 transition-opacity"
                  style={{ color: "var(--danger-500)" }}
                >
                  Remove
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Upload icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: isDragging
                  ? "rgba(99, 102, 241, 0.15)"
                  : "rgba(99, 102, 241, 0.06)",
                color: "var(--primary-500)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                {isDragging ? "Drop your resume here" : "Upload your resume"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                Drag & drop or click to browse • PDF or DOCX • Max 3MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--danger-500)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
