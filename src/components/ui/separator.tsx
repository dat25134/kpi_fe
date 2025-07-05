import * as React from "react";

export function Separator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`my-2 border-t border-gray-200 ${className}`}
      role="separator"
    />
  );
}

export default Separator; 