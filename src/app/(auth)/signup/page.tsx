"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Mail } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/logo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
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
        `Great! We've sent a confirmation link to ${email}. Please check your inbox and click the link to complete your account creation. If you don't see the email, please check your spam folder.`
      );
    } catch (error) {
      if (error instanceof AuthError) {
        //router.push(`/signup?error=${error.type}`);
      } else {
        setEmailError("Error sending confirmation link. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signIn("google", { redirect: true });
    } catch (error) {
      if (error instanceof AuthError) {
        router.push(`/signup?error=${error.type}`);
      } else {
        console.error("Provider signup failed:", error);
      }
    }
  };

  const handleGithubSignup = async () => {
    try {
      await signIn("github", { redirect: true });
    } catch (error) {
      if (error instanceof AuthError) {
        router.push(`/signup?error=${error.type}`);
      } else {
        console.error("Provider signup failed:", error);
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
        <div className="w-full max-w-4xl bg-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side: Signup form */}
            <div className="w-full md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-6">Join Our Platform</h1>
              <form onSubmit={handleEmailSignup} className="space-y-4">
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
                  <Mail className="mr-2 h-4 w-4" /> Create Account
                </Button>
              </form>
              <div className="mt-4 space-y-4">
                <Button
                  onClick={handleGoogleSignup}
                  className="w-full h-12 px-4 rounded-none bg-gray-100 hover:bg-gray-200 text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                >
                  <FcGoogle className="mr-2 h-4 w-4" /> Sign up with Google
                </Button>
                <Button
                  onClick={handleGithubSignup}
                  className="w-full h-12 px-4 rounded-none bg-gray-100 hover:bg-gray-200 text-black border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
                >
                  <FiGithub className="mr-2 h-4 w-4" /> Sign up with GitHub
                </Button>
              </div>
              <div className="mt-8 pt-4 text-center border-t-2 border-gray-300">
                <p className="text-sm">
                  <Link
                    href="/signin"
                    className="inline-block px-4 py-2 bg-white text-black border-2 border-black font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            {/* Right side: Feature list */}
            <div className="w-full md:w-1/2 bg-[#FCD19C] p-8 border-t-4 md:border-t-0 md:border-l-4 border-black">
              <h2 className="text-2xl font-bold mb-6">
                Why Choose Our Platform?
              </h2>
              <ul className="space-y-4">
                {[
                  "Easy-to-use interface",
                  "Secure passwordless login",
                  "24/7 customer support",
                  "Customizable dashboards",
                  "Integration with popular tools",
                  "Regular feature updates",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-6 w-6 mr-2 text-green-600" />
                    <span className="text-lg font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-white border-2 border-black">
                <p className="text-lg font-bold">
                  Join thousands of satisfied users!
                </p>
                <p className="mt-2">
                  Experience the difference today and take your productivity to
                  the next level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
