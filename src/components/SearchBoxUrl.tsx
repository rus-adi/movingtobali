"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buttonSecondary, inputBase, pill } from "@/components/ui/styles";

type Suggestion = {
  label: string;
  value?: string;
  href?: string;
};

type Props = {
  paramName?: string;
  placeholder?: string;
  className?: string;
  submitLabel?: string;
  suggestions?: Suggestion[];
  helperText?: string;
  basePath?: string;
};

function SearchBoxUrlInner({
  paramName = "q",
  placeholder = "Search…",
  className,
  submitLabel = "Search",
  suggestions = [],
  helperText,
  basePath,
}: Props) {
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
    sp.delete("page");
    const query = sp.toString();
    const targetPath = basePath || pathname;
    router.push(query ? `${targetPath}?${query}` : targetPath);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    update(value);
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center" role="search" aria-label="Site search">
        <label className="sr-only" htmlFor={`search-${paramName}`}>Search</label>
        <input
          id={`search-${paramName}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={inputBase}
        />
        <button className={buttonSecondary} type="submit" data-track="search_submit">
          {submitLabel}
        </button>
      </form>

      {helperText ? <p className="mt-3 text-sm leading-6 text-gray-600">{helperText}</p> : null}

      {suggestions.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((item) => {
            if (item.href) {
              return (
                <Link key={`${item.label}-${item.href}`} href={item.href} className={pill} data-track="search_suggestion_link">
                  {item.label}
                </Link>
              );
            }
            const nextValue = item.value || item.label;
            return (
              <button
                key={`${item.label}-${nextValue}`}
                type="button"
                className={pill}
                onClick={() => {
                  setValue(nextValue);
                  update(nextValue);
                }}
                data-track="search_suggestion_query"
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}


export default function SearchBoxUrl(props: Props) {
  return (
    <Suspense fallback={null}>
      <SearchBoxUrlInner {...props} />
    </Suspense>
  );
}
