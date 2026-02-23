"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buttonSecondary, inputBase } from "@/components/ui/styles";

type Props = {
  paramName?: string;
  placeholder?: string;
  className?: string;
};

export default function SearchBoxUrl({ paramName = "q", placeholder = "Search…", className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const initial = useMemo(() => params.get(paramName) || "", [params, paramName]);
  const [value, setValue] = useState(initial);

  useEffect(() => setValue(initial), [initial]);

  function update(next: string) {
    const sp = new URLSearchParams(params.toString());
    if (next.trim()) sp.set(paramName, next.trim());
    else sp.delete(paramName);
    sp.delete("page"); // reset pagination on new search
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className={className}>
      <label className="sr-only" htmlFor={`search-${paramName}`}>Search</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id={`search-${paramName}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={inputBase}
        />
        <button className={buttonSecondary} onClick={() => update(value)} type="button" data-track="search_submit">
          Search
        </button>
      </div>
    </div>
  );
}
