"use client";

import React, { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Trash2, Edit2, Search, HelpCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the Domain type
type Domain = {
  id: string;
  name: string;
  status: "ACTIVE" | "PENDING" | "ERROR";
  // Include other fields as necessary
};

// Define the Props type
type Props = {
  initialDomains: Domain[];
  addDomain: (name: string) => Promise<Domain>;
  deleteDomain: (id: string) => Promise<void>;
  editDomain: (id: string, newName: string) => Promise<Domain>;
};

export default function CustomDomainManager({
  initialDomains,
  addDomain,
  deleteDomain,
  editDomain,
}: Props) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [newDomain, setNewDomain] = useState("");
  const [filterText, setFilterText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null); // New state for edit error
  const [isPending, startTransition] = useTransition();

  // State for editing domains
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [editingDomainName, setEditingDomainName] = useState<string>("");

  // State for deleting domains
  const [deletingDomainId, setDeletingDomainId] = useState<string | null>(null);

  // Validation function
  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
    const minLength = 3;
    const maxLength = 255;

    return (
      domainRegex.test(domain) &&
      domain.length >= minLength &&
      domain.length <= maxLength
    );
  };

  // Handler to add a new domain
  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDomain) {
      setError("Please enter a domain name.");
      return;
    }

    if (!isValidDomain(newDomain)) {
      setError("Invalid domain format. Example: example.com");
      return;
    }

    startTransition(async () => {
      try {
        const domain = await addDomain(newDomain);
        setDomains([...domains, domain]);
        setNewDomain("");
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to add domain.");
        } else {
          setError("Failed to add domain.");
        }
      }
    });
  };

  // Handler to initiate domain editing
  const handleEditClick = (domain: Domain) => {
    setEditingDomainId(domain.id);
    setEditingDomainName(domain.name);
    setEditError(null); 
  };

  // Handler to update the domain
  const handleEditDomain = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDomainId) return;

    if (!editingDomainName) {
      setEditError("Please enter a domain name.");
      return;
    }

    if (!isValidDomain(editingDomainName)) {
      setEditError("Invalid domain format. Example: example.com");
      return;
    }

    startTransition(async () => {
      try {
        const updatedDomain = await editDomain(
          editingDomainId,
          editingDomainName
        );

        // Update the domain in the local state
        setDomains(
          domains.map((domain) =>
            domain.id === updatedDomain.id ? updatedDomain : domain
          )
        );

        // Reset editing state
        setEditingDomainId(null);
        setEditingDomainName("");
        setEditError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setEditError(err.message || "Failed to edit domain.");
        } else {
          setEditError("Failed to edit domain.");
        }
      }
    });
  };

  // Handler to cancel editing
  const handleCancelEdit = () => {
    setEditingDomainId(null);
    setEditingDomainName("");
    setEditError(null); // Reset edit error
  };

  // Handler to initiate domain deletion
  const handleDeleteClick = (domain: Domain) => {
    setDeletingDomainId(domain.id);
    setError(null);
  };

  // Handler to delete the domain
  const handleDeleteDomain = () => {
    if (!deletingDomainId) return;

    startTransition(async () => {
      try {
        await deleteDomain(deletingDomainId);
        setDomains(domains.filter((domain) => domain.id !== deletingDomainId));
        setDeletingDomainId(null);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to delete domain.");
        } else {
          setError("Failed to delete domain.");
        }
      }
    });
  };

  // Handler to cancel deletion
  const handleCancelDelete = () => {
    setDeletingDomainId(null);
    setError(null);
  };

  // Filtered domains based on search input
  const filteredDomains = useMemo(() => {
    return domains.filter((domain) =>
      domain.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [domains, filterText]);

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold mb-2 text-left">
            Custom Domain Manager
          </h2>
          <p className="text-gray-600 mb-6">
            Manage your custom domains effortlessly—add, track, and configure them for seamless website integration.
          </p>
          <form onSubmit={handleAddDomain} className="space-y-4">
            <div>
              <Label htmlFor="domain" className="text-lg font-bold">
                Add Custom Domain
              </Label>
              <div className="flex mt-2">
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="Enter your domain (e.g., example.com)"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-grow h-12 text-base font-semibold rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="ml-2 h-12 px-4 rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                >
                  {isPending ? "Adding..." : "Add Domain"}
                </Button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          </form>

          <div className="mt-8">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-left">Your Domains</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto ml-2 hover:bg-transparent"
                    >
                      <HelpCircle className="h-5 w-5 text-gray-600" />
                      <span className="sr-only">Domain Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-sm text-gray-900 p-4 rounded-none border-2 border-black max-w-md">
                    {/* Add tooltip content here */}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Filter domains..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="h-10 text-base font-semibold rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="border-4 border-black">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-2 text-left font-bold">Domain</th>
                    <th className="p-2 text-left font-bold">Status</th>
                    <th className="p-2 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDomains.map((domain, index) => (
                    <tr
                      key={domain.id}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="p-2 border-t-2 border-b-2 border-black font-medium">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          {domain.name}
                        </div>
                      </td>
                      <td className="p-2 border-t-2 border-b-2 border-black">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-bold text-white border border-black ${
                            domain.status === "ACTIVE"
                              ? "bg-green-500"
                              : domain.status === "PENDING"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {domain.status}
                        </span>
                      </td>
                      <td className="p-2 border-t-2 border-b-2 border-black">
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <Dialog
                            open={editingDomainId === domain.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                handleCancelEdit();
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleEditClick(domain)}
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 rounded-none border-2 border-black hover:bg-gray-200 font-bold"
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-black">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                  Edit Domain
                                </DialogTitle>
                                <DialogDescription className="text-md">
                                  Update the domain name below.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditDomain}>
                                <div className="py-4">
                                  <Label
                                    htmlFor="editDomain"
                                    className="text-right"
                                  >
                                    Domain Name
                                  </Label>
                                  <Input
                                    id="editDomain"
                                    value={editingDomainName}
                                    onChange={(e) =>
                                      setEditingDomainName(e.target.value)
                                    }
                                    className="mt-2 h-12 text-base font-semibold rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                                  />
                                  {/* Display error message in the edit dialog */}
                                {editError && (
                                  <p className="mt-2 text-red-500 text-sm font-bold mb-2">
                                    {editError}
                                  </p>
                                )}
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-12 px-4 rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                                  >
                                    {isPending ? "Saving..." : "Save Changes"}
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="h-12 px-4 rounded-none bg-white hover:bg-gray-100 text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                                  >
                                    Cancel
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          {/* Delete Button */}
                          <Dialog
                            open={deletingDomainId === domain.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                handleCancelDelete();
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleDeleteClick(domain)}
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 rounded-none border-2 border-black hover:bg-gray-200 font-bold"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-black">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                  Confirm Deletion
                                </DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="text-lg mb-2">
                                  Are you sure you want to delete the domain:
                                </p>
                                <p className="text-xl font-bold text-red-500 mb-4">
                                  {domain?.name}
                                </p>
                                <p className="text-md text-gray-600">
                                  This action cannot be undone.
                                </p>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={handleDeleteDomain}
                                  disabled={isPending}
                                  className="h-12 px-4 rounded-none bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                                >
                                  {isPending ? "Deleting..." : "Delete"}
                                </Button>
                                <Button
                                  onClick={handleCancelDelete}
                                  className="h-12 px-4 rounded-none bg-white hover:bg-gray-100 text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                                >
                                  Cancel
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {/* Add more actions if needed */}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 rounded-none border-2 border-black hover:bg-gray-200 font-bold"
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Config
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] rounded-none border-4 border-black">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                  Domain Configuration
                                </DialogTitle>
                                <DialogDescription className="text-md">
                                  Add the following TXT record to your DNS
                                  settings:
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-gray-100 p-4 border-2 border-black font-mono text-sm break-words">
                                <p>
                                  <span className="font-semibold">Name:</span>{" "}
                                  _vercel
                                </p>
                                <p>
                                  <span className="font-semibold">Value:</span>{" "}
                                  <span className="break-all max-w-full">
                                    vc-domain-verify={domain.id}
                                    ,5bfee5b3286e038a6547
                                  </span>
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDomains.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-black mt-4">
                <Globe
                  className="mx-auto h-16 w-16 text-gray-400"
                  strokeWidth={1.25}
                />
                <p className="mt-2 text-lg font-bold">
                  {domains.length === 0
                    ? "No domains added yet"
                    : "No matching domains found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
