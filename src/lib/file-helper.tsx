// lib/file-helper.ts

import {
  FileArchive,
  FileText,
  FileImage,
  FileCode,
  FileUp,
} from "lucide-react";

export const getFileIcon = (fileType: string) => {
  if (fileType.includes("zip"))
    return <FileArchive className="h-8 w-8 text-gray-600" />;
  if (fileType.includes("pdf"))
    return <FileText className="h-8 w-8 text-gray-600" />;
  if (fileType.includes("image"))
    return <FileImage className="h-8 w-8 text-gray-600" />;
  if (fileType.includes("html"))
    return <FileCode className="h-8 w-8 text-gray-600" />;
  return <FileUp className="h-8 w-8 text-gray-600" />;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
