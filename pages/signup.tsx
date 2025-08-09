import Head from "next/head";
import React, { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp(): JSX.Element {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const resp = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (resp.ok) {
      router.push("/signin");
    } else {
      const data = await resp.json().catch(()=>({}));
      alert(data.error ?? "Failed to sign up");
    }
  }

  return (
    <>
      <Head><title>Sign Up</title></Head>
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-md px-4 py-10">
          <h1 className="text-2xl font-bold mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Name (optional)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} type="text" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full border rounded-lg px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input className="w-full border rounded-lg px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
            </div>
            <button className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold">Sign Up</button>
          </form>
          <p className="mt-3 text-sm">
            Already have an account? <Link href="/signin" className="text-blue-600 underline">Sign in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
