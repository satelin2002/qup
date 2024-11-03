"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, X, Eye, FileArchive, Lock, Mail } from "lucide-react";
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
// import FeaturesSidebar from "@/components/FeaturesSidebar";

export default function Component() {
  const [file, setFile] = useState<File | null>(null);
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!subdomain) {
      setError("Please enter a subdomain.");
      return;
    }
    console.log("File to upload:", file);
    console.log("Subdomain:", subdomain);
    setFile(null);
    setSubdomain("");
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="text-base bg-[#0F172A] min-h-screen p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left section with the form */}
        <div className="bg-white p-8 rounded border-2 border-black lg:col-span-1">
          <h1 className="text-2xl font-bold mb-6">Upload Your File</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subdomain Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Subdomain Settings</h2>
              <Label htmlFor="subdomain" className="text-base">
                Subdomain
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="subdomain"
                  type="text"
                  placeholder="link-name"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="h-12 text-base rounded-none border-2 border-black flex-grow"
                />
                <Select defaultValue=".tiiny.site">
                  <SelectTrigger className="w-[180px] h-12 text-base rounded-none border-2 border-black bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black">
                    <SelectItem value=".tiiny.site">.tiiny.site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">File Upload</h2>
              <div
                {...getRootProps()}
                className={`p-4 border-2 border-black cursor-pointer transition-colors ${
                  isDragActive ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
              >
                {file ? (
                  <div className="flex items-center gap-3">
                    <FileUp className="h-5 w-5" />
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="ml-auto rounded-none hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileUp className="mx-auto h-10 w-10 mb-2" />
                    <p>Drag & drop a file here, or click to select</p>
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 border-2 border-black bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileArchive className="h-8 w-8 text-gray-600" />
                    <div>
                      <p className="font-medium">
                        {file ? file.name : "No file selected"}
                      </p>
                      {file && (
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      )}
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
              </div>
            </div>

            {/* Access Settings Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Access Settings</h2>
              <Select defaultValue="public">
                <SelectTrigger className="w-full h-12 text-base rounded-none border-2 border-black bg-white">
                  <SelectValue placeholder="Select access type" />
                </SelectTrigger>
                <SelectContent className="max-w-md rounded-none border-2 border-black">
                  <SelectItem value="password" disabled className="py-3">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 mt-0.5" />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          Password protected
                          <span className="text-xs px-2 py-0.5 bg-gray-100 border border-black">
                            UPGRADE
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Make your link private by adding a layer of security
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="email" disabled className="py-3">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 mt-0.5" />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          Capture emails
                          <span className="text-xs px-2 py-0.5 bg-gray-100 border border-black">
                            UPGRADE
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Capture potential leads by requiring visitors to enter
                          their email address
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500 text-base">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 text-base rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-4 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 transform rotate-[0.5deg] relative overflow-hidden"
            >
              <span className="relative z-10">Publish</span>
              <span
                className="absolute inset-0 bg-repeat opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle, black 1px, transparent 1px)`,
                  backgroundSize: "10px 10px",
                }}
              ></span>
            </Button>
          </form>
        </div>

        {/* Right section with the features sidebar */}
        {/* <FeaturesSidebar /> */}
      </div>
    </div>
  );
}
