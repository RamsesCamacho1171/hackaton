// components/navbar.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Hospital, hospitals } from "@/lib/data";
import { useInventoryStore } from "@/lib/store";
import { Building2, History, LayoutGrid } from "lucide-react";

export function Navbar() {
  const { hospitalId, setHospitalId } = useInventoryStore();

  // Garantiza un hospital por defecto al cargar
  useEffect(() => {
    if (!hospitalId && hospitals.length > 0) {
      setHospitalId(hospitals[0].id);
    }
  }, [hospitalId, setHospitalId]);

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
      {/* Marca */}
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          🏥
        </span>
        <Link href="/" className="text-lg font-semibold tracking-tight">
          VitaLink
        </Link>
        <nav className="ml-4 hidden items-center gap-1 sm:flex">
          <NavLink href="/" icon={<LayoutGrid size={16} />}>
            Inventario
          </NavLink>
          <NavLink href="/historial" icon={<History size={16} />}>
            Historial
          </NavLink>
        </nav>
      </div>

      {/* Selector de hospital */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="hospital"
          className="hidden text-sm text-zinc-600 sm:inline-flex items-center gap-1"
        >
          <Building2 size={16} />
          Hospital
        </label>
        <select
          id="hospital"
          value={hospitalId ?? ""}
          onChange={(e) => setHospitalId(e.target.value)}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Seleccionar hospital"
        >
          {hospitals.map((h: Hospital) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
    >
      {icon}
      {children}
    </Link>
  );
}
