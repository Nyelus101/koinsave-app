"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Spinner from "@/components/Spinner";
import { Transaction } from "@/types";

export default function RecurringBillsPage() {
  const [bills, setBills] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    api.getTransactions().then((data) => {
      setBills(data.filter((t) => t.recurring));
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recurring Bills</h2>
        {bills.length === 0 ? (
          <p>No recurring bills found.</p>
        ) : (
          <ul className="space-y-2">
            {bills.map((b, idx) => (
              <li key={idx} className="p-2 border rounded flex justify-between">
                <span>{b.name}</span>
                <span className="text-red-500">${b.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
