"use client";

import React from "react";

interface SpinnerProps {
  size?: "small" | "medium";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "medium" }) => {
  const classes =
    size === "small"
      ? "w-4 h-4 border-2 border-t-2 border-gray-200 rounded-full animate-spin"
      : "w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin";

  return <div className={classes}></div>;
};

export default Spinner;
