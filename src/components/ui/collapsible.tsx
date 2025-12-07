"use client";

import React, { useState } from "react";

export function Collapsible({
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div data-slot="collapsible" className="w-full">
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
}

export function CollapsibleTrigger({
  open,
  setOpen,
  children,
}: any) {
  return (
    <button
      data-slot="collapsible-trigger"
      onClick={() => setOpen(!open)}
      className="flex items-center gap-2 cursor-pointer"
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  open,
  children,
}: any) {
  return (
    <div
      data-slot="collapsible-content"
      className={`transition-all overflow-hidden ${
        open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
