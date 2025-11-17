

"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Spinner from "@/components/Spinner";
import { Budget } from "@/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

useEffect(() => {
  const fetchBudgets = async () => {
    
    try {
      const data = await api.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      // Optionally set an error state:
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  fetchBudgets();
}, []);


  if (loading) return <Spinner />;

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Budgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgets.map((b) => (
            <div key={b.id} className="p-4 rounded shadow" style={{ backgroundColor: b.theme }}>
              <h3 className="font-semibold">{b.category}</h3>
              <p>Max: ${b.maximum.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
