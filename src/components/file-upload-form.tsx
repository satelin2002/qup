// components/FileUploadForm.tsx

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Eye, AlertCircle, Lock, Mail, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getFileIcon, formatFileSize } from "@/lib/file-helper";
import { fetchPresignedUrl, uploadFileToS3 } from "@/lib/s3-upload";
import { handleError, displayError } from "@/lib/error-helper";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [subdomainError, setSubdomainError] = useState(false);
  const [fileError, setFileError] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setFileError(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "text/html": [".html"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubdomainError(false);
    setFileError(false);
    
    if (!subdomain) {
      setSubdomainError(true);
      handleError("Please enter a subdomain.", setError);
      return;
    }

    if (!file) {
      setFileError(true);
      handleError("Please specify a file to upload.", setError);
      return;
    }

    try {
      setIsUploading(true);
      const url = await fetchPresignedUrl(file, subdomain);

      // Upload the file to S3 using the presigned URL
      await uploadFileToS3(file, url);

      alert("File uploaded successfully!");
      setFile(null);
      setSubdomain("");
      setError(null);
    } catch (error) {
      handleError(
        displayError(error, "Failed to upload file. Please try again."),
        setError
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Upload Your File</h2>
        <p className="text-gray-600 mb-4">
          Easily upload HTML, ZIP, or other files to generate a shareable link.
        </p>
        <div>
          <Label htmlFor="subdomain" className="mb-2 text-lg font-bold">
            Domain Setting
          </Label>
          <div className="flex flex-row gap-2">
            <div className="flex-grow">
              <Input
                id="subdomain"
                type="text"
                placeholder="Enter subdomain"
                value={subdomain}
                onChange={(e) => {
                  setSubdomain(e.target.value);
                  setSubdomainError(false);
                }}
                className={`h-12 text-base font-semibold rounded-none border-2 focus-visible:ring-0 focus-visible:ring-offset-0 w-full ${
                  subdomainError ? "border-red-500" : "border-black"
                }`}
              />
            </div>
            <Select defaultValue=".tiiny.site">
              <SelectTrigger className="w-[140px] sm:w-[180px] h-12 text-base rounded-none border-2 font-semibold border-black bg-white hover:bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full rounded-none border-2 border-black font-semibold">
                <SelectItem value=".tiiny.site">.tiiny.site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`p-4 border-2 border-dashed cursor-pointer my-4 transition-colors ${
            isDragActive ? "bg-gray-50" : "bg-white hover:bg-gray-50"
          } ${fileError ? "border-red-500" : "border-black"}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="rounded-none hover:bg-gray-200"
                disabled={!file}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <FileUp strokeWidth={1.25} className="mx-auto h-10 w-10 mb-2 " />
              <p className="font-semibold">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supported file types: HTML, ZIP, PDF, PNG, JPEG, GIF
              </p>
            </div>
          )}
        </div>
        <div className="border-t-2 border-black my-6"></div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          Access gate <Eye className="h-5 w-5 text-gray-400" />
        </h2>
        <Select defaultValue="public">
          <SelectTrigger className="w-full h-14 text-base rounded-none border-2 border-black bg-white hover:bg-gray-50">
            <SelectValue placeholder="Select access type" />
          </SelectTrigger>
          <SelectContent className="w-full rounded-none border-2 border-black">
            <SelectItem value="public" className="py-3">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium flex items-center gap-2">
                    No restrictions (public)
                  </div>
                  <div className="text-sm text-gray-500">
                    No restrictions for your visitors
                  </div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="password" className="py-3">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium flex items-center gap-2">
                    Password protected
                    <span className="text-xs px-2 py-0.5 bg-[#FFD700] text-black border border-black font-bold">
                      UPGRADE
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Make your link private by adding a layer of security
                  </div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="email" className="py-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium flex items-center gap-2">
                    Capture emails
                    <span className="text-xs px-2 py-0.5 bg-[#FFD700] text-black border border-black font-bold">
                      UPGRADE
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Capture potential leads by requiring visitors to enter their
                    email address
                  </div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border-t-2 border-black my-6"></div>
      <div>
        <h2 className="text-lg font-bold mb-2">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>Hide from Search Engines</span>
                <span className="text-xs px-2 py-0.5 bg-[#FFD700] text-black border border-black font-bold">
                  UPGRADE
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Prevent your page from appearing in search results
              </p>
            </div>
            <Switch className="border-2 border-black " />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Error configuration</span>
                <span className="text-xs px-2 py-0.5 bg-[#FFD700] text-black border border-black font-bold">
                  UPGRADE
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Customize error pages for your visitors
              </p>
            </div>
            <Switch disabled className="border-2 border-black" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-base">{error}</p>}

      <Button
        type="submit"
        disabled={isUploading}
        className="w-full h-12 text-base rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-4 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 transform rotate-[0.5deg] relative overflow-hidden"
      >
        <span className="relative z-10">
          {isUploading ? "Uploading..." : "PUBLISH YOUR FILE"}
        </span>
      </Button>
    </form>
  );
}
