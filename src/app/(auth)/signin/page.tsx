"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
 import Logo from "@/components/ui/logo";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    try {
      await signIn("resend", { email, redirect: false });

      setSuccessMessage(
        `Great! We've sent a login link to ${email}. Please check your inbox and click the link to log in. If you don't see the email, please check your spam folder.`
      );
    } catch (error) {
      if (error instanceof AuthError) {
        //router.push(`/signin?error=${error.type}`);
      } else {
        setEmailError("Error sending login link. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { redirect: true });
    } catch (error) {
      if (error instanceof AuthError) {
        router.push(`/login?error=${error.type}`);
      } else {
        console.error("Provider login failed:", error);
      }
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signIn("github", { redirect: true });
    } catch (error) {
      if (error instanceof AuthError) {
        router.push(`/signin?error=${error.type}`);
      } else {
        console.error("Provider login failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="flex items-center">
          <Logo />
          <span className="ml-2 text-xl font-bold text-white">
            Our Platform
          </span>
        </Link>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-lg font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="h-12 text-base font-semibold rounded-none border-2 border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
                {successMessage && (
                  <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded-none">
                    <p className="text-green-700 font-semibold">
                      {successMessage}
                    </p>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 px-4 rounded-none bg-[#FCD19C] hover:bg-[#ffead7] text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
              >
                <Mail className="mr-2 h-4 w-4" /> Send Login Link
              </Button>
            </form>
            <div className="mt-4 space-y-4">
              <Button
                onClick={handleGoogleLogin}
                className="w-full h-12 px-4 rounded-none bg-gray-100 hover:bg-gray-200 text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
              >
                <FcGoogle className="mr-2 h-4 w-4" /> Login with Google
              </Button>
              <Button
                onClick={handleGithubLogin}
                className="w-full h-12 px-4 rounded-none bg-gray-100 hover:bg-gray-200 text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
              >
                <FiGithub className="mr-2 h-4 w-4" /> Login with GitHub
              </Button>
            </div>
            <div className="mt-8 pt-4 text-center border-t-2 border-gray-300">
              <p className="text-sm">
                <Link
                  href="/signup"
                  className="inline-block px-4 py-2 bg-white text-black border-2 border-black font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
