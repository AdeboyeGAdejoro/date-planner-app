import React, { JSX } from "react";
import Head from "next/head";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/bookings",
    });
    // NextAuth will handle redirects; you can handle errors via res?.error
  }

  return (
    <>
      <Head><title>Sign In</title></Head>
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-md px-4 py-10">
          <h1 className="text-2xl font-bold mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full border rounded-lg px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input className="w-full border rounded-lg px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
            </div>
            <button className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold">Sign In</button>
          </form>
          <p className="mt-3 text-sm">
            No account? <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
          </p>
        </div>
      </main>
    </>
  );
}
