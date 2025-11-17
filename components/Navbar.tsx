"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear mock token
    router.push("/"); // redirect to landing page
  };

  return (
    <nav className="bg-gray-900 text-white flex justify-between px-6 py-4">
      <h1 className="font-bold text-lg">Koinsave</h1>
      <div className="flex gap-4 items-center">
        <Link href="/overview" className="hover:text-green-500">Overview</Link>
        <Link href="/transactions" className="hover:text-green-500">Transactions</Link>
        <Link href="/budgets" className="hover:text-green-500">Budgets</Link>
        <Link href="/pots" className="hover:text-green-500">Pots</Link>
        <Link href="/recurring-bills" className="hover:text-green-500">Recurring Bills</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
