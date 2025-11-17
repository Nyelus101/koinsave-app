
"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Spinner from "@/components/Spinner";
import { Transaction } from "@/types";
import Image from "next/image";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dynamically calculate rows based on viewport height
  const calculateRows = () => {
    const viewportHeight = window.innerHeight;

    const headerHeight = 260;

    // Detect mobile based on Tailwind breakpoint
    const isMobile = window.innerWidth < 640;

    const cardHeight = 120; // mobile card height
    const tableRowHeight = 55; // desktop table height

    const heightAvailable = viewportHeight - headerHeight;
    const rows = Math.max(
      4,
      Math.floor(heightAvailable / (isMobile ? cardHeight : tableRowHeight))
    );

    setRowsPerPage(rows);
  };

  useEffect(() => {
    calculateRows();
    window.addEventListener("resize", calculateRows);
    return () => window.removeEventListener("resize", calculateRows);
  }, []);

  useEffect(() => {
    api.getTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const currentData = transactions.slice(start, start + rowsPerPage);

  return (
    <div className="p-4 sm:p-6">

      <h2 className="text-xl sm:text-2xl font-bold mb-4">Transactions</h2>

      {/* TABLE VIEW (DESKTOP) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((t, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">
                  <Image
                    src={`/${t.avatar}`}
                    alt={t.name}
                    width={40}  
                    height={40}  
                    className="rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.category}</td>
                <td className="px-4 py-2">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td
                  className={`px-4 py-2 ${
                    t.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  ${t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW (MOBILE) */}
      <div className="sm:hidden space-y-4 pt-4 ">
        {currentData.map((t, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 shadow-sm bg-white flex items-start gap-3"
          >
            <Image
              src={`/${t.avatar}`}
              alt={t.name}
              width={48}    
              height={48}  
              className="rounded-full"
            />

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <span
                  className={`font-semibold ${
                    t.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  ${t.amount.toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500">{t.category}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(t.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-row justify-between items-center mt-6 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
