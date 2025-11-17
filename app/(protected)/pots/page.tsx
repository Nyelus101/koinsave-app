"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Spinner from "@/components/Spinner";
import { Pot } from "@/types";

export default function PotsPage() {
  const [pots, setPots] = useState<Pot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    api.getPots().then((data) => {
      setPots(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Pots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pots.map((p) => (
            <div key={p.id} className="p-4 rounded shadow" style={{ backgroundColor: p.theme }}>
              <h3 className="font-semibold">{p.name}</h3>
              <p>Total: ${p.total.toFixed(2)}</p>
              <p>Target: ${p.target.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
