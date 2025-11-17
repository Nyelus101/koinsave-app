"use client";

import React, { useState } from "react";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setModalOpen(false);
    router.push("/overview");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Koinsave</h1>
      <p className="mb-6 max-w-xl">
        Manage your finances effortlessly with Koinsave. Track transactions, budgets, and savings pots in one place.
      </p>
      <div className="flex gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setModalOpen(true)}
        >
          Login / Signup
        </button>
      </div>
      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} />
    </div>
  );
}
