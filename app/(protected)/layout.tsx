"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Spinner from "@/components/Spinner";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // redirect to landing if not logged in
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="fixed z-30 w-full ">
        <div className="hidden md:block">
            <Navbar />
        </div>

        <div className="md:hidden">
            <MobileNavbar />
        </div>
     </div>
      <main>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
