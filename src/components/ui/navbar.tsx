"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Links */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center rounded-full mr-3">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="font-bold text-xl text-black">Qup</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link
                href="/sites"
                className="text-black font-semibold px-3 py-2 text-md hover:outline hover:outline-2 hover:outline-black"
              >
                Sites
              </Link>
              <Link
                href="/domains"
                className="text-black font-semibold px-3 py-2 text-md hover:outline hover:outline-2 hover:outline-black"
              >
                Domains
              </Link>
            </div>
          </div>

          {/* Menu Button for Mobile */}
          <div className="flex md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Links and Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              asChild
              className="ml-2 h-12 px-4 rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
            >
              <Link
                href="/publish"
                className="uppercase  font-bold  tracking-wider"
              >
                <FileUp className="mr-2 h-6 w-6" />
                Upload File
              </Link>
            </Button>
            <Link
              href="/settings"
              className="text-black font-semibold px-3 py-2 text-md hover:outline hover:outline-2 hover:outline-black"
            >
              Settings
            </Link>
            <Button className="h-10 px-4 py-2 text-md font-semibold rounded-none bg-white hover:bg-gray-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150">
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="space-y-2 px-2 pt-2 pb-3">
              <Link
                href="/sites"
                className="block text-black font-semibold px-3 py-2 text-md hover:outline hover:outline-2 hover:outline-black"
                onClick={toggleMenu}
              >
                Sites
              </Link>
              <Link
                href="/domains"
                className="block text-black font-semibold px-3 py-2 text-md hover:outline hover:outline-2 hover:outline-black"
                onClick={toggleMenu}
              >
                Domains
              </Link>
              <Link
                href="/settings"
                className="block text-black font-semibold px-3 py-2 text-md hover:outline hover:outline-2 hover:outline-black"
                onClick={toggleMenu}
              >
                Settings
              </Link>
              <Button
                asChild
                className="w-full h-10 px-4 py-2 text-md font-semibold rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
              >
                <Link href="/upload" onClick={toggleMenu}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload File
                </Link>
              </Button>
              <Button
                className="w-full h-10 px-4 py-2 text-md font-semibold rounded-none bg-white hover:bg-gray-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                onClick={toggleMenu}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
