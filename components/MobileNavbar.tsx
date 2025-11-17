"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-4 flex justify-between items-center md:hidden">
      <h1 className="font-bold text-lg">Koinsave</h1>

      {/* Hamburger Button */}
      <button onClick={() => setOpen(!open)}>
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 border-t border-gray-700 px-6 py-4 space-y-4 z-50 shadow-lg">
          <Link
            href="/overview"
            onClick={() => setOpen(false)}
            className="block text-lg hover:text-green-500"
          >
            Overview
          </Link>

          <Link
            href="/transactions"
            onClick={() => setOpen(false)}
            className="block text-lg hover:text-green-500"
          >
            Transactions
          </Link>

          <Link
            href="/budgets"
            onClick={() => setOpen(false)}
            className="block text-lg hover:text-green-500"
          >
            Budgets
          </Link>

          <Link
            href="/pots"
            onClick={() => setOpen(false)}
            className="block text-lg hover:text-green-500"
          >
            Pots
          </Link>

          <Link
            href="/recurring-bills"
            onClick={() => setOpen(false)}
            className="block text-lg hover:text-green-500"
          >
            Recurring Bills
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
