export const dynamic = 'force-dynamic';
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="font-outfit font-black text-3xl uppercase tracking-tighter text-white">
            ADMIN <span className="text-brand">LOGIN</span>
          </h1>
          <p className="font-inter text-xs text-gray-400 tracking-widest uppercase">
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs font-inter p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="text-center tracking-widest"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="text-center tracking-widest"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 mt-4">
            {loading ? "AUTHENTICATING..." : "ACCESS GRANTED"}
          </Button>
        </form>
      </div>
    </div>
  );
}
