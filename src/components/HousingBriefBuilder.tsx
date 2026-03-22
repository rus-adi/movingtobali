"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type MoveShape = "test-stay" | "trial-move" | "full-move";
type SchoolRole = "yes" | "maybe" | "no";

const moveShapeLabels: Record<MoveShape, string> = {
  "test-stay": "Test stay first",
  "trial-move": "Longer trial move",
  "full-move": "Full move",
};

const schoolRoleLabels: Record<SchoolRole, string> = {
  yes: "Empathy School is one of the anchors",
  maybe: "Empathy School might shape the shortlist",
  no: "Empathy School is not shaping housing right now",
};

function joinLines(value: string): string[] {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function HousingBriefBuilder() {
  const [arrivalWindow, setArrivalWindow] = useState("e.g., arriving for a 3-week test stay in July");
  const [moveShape, setMoveShape] = useState<MoveShape>("test-stay");
  const [adults, setAdults] = useState("2 adults");
  const [kidsAges, setKidsAges] = useState("e.g., 4 and 8");
  const [bedroomsIdeal, setBedroomsIdeal] = useState("3 bedrooms");
  const [bedroomsMinimum, setBedroomsMinimum] = useState("2 bedrooms");
  const [workNeeds, setWorkNeeds] = useState("e.g., one quiet work zone for calls");
  const [budgetComfort, setBudgetComfort] = useState("e.g., comfortable around __ per month");
  const [budgetStretch, setBudgetStretch] = useState("e.g., stretch ceiling __ for the right place");
  const [areas, setAreas] = useState("e.g., Ubud side, Tampaksiring, calmer Gianyar pockets");
  const [backupAreas, setBackupAreas] = useState("e.g., one backup area if the shortlist gets too tight");
  const [schoolRole, setSchoolRole] = useState<SchoolRole>("maybe");
  const [nonNegotiables, setNonNegotiables] = useState("e.g., calmer road situation\nenclosed outdoor space\nshorter weekday loop");
  const [niceToHave, setNiceToHave] = useState("e.g., guest room\nbetter kitchen\nsmall garden");
  const [dealbreakers, setDealbreakers] = useState("e.g., too many stairs\nheavy road noise\nunsafe pool setup");
  const [notes, setNotes] = useState("e.g., we care more about weekday calm than villa wow factor");
  const [copied, setCopied] = useState(false);

  const brief = useMemo(() => {
    const lines = [
      "Hi,",
      "",
      "We would like help with family housing in Bali.",
      "",
      "Timing",
      `- Likely arrival window: ${arrivalWindow}`,
      `- Move shape: ${moveShapeLabels[moveShape]}`,
      "",
      "Family setup",
      `- Adults: ${adults}`,
      `- Kids' ages: ${kidsAges}`,
      "",
      "Bedrooms + home setup",
      `- Ideal bedrooms: ${bedroomsIdeal}`,
      `- Minimum bedrooms: ${bedroomsMinimum}`,
      `- Work needs: ${workNeeds}`,
      "",
      "Budget band",
      `- Comfortable range: ${budgetComfort}`,
      `- Stretch ceiling: ${budgetStretch}`,
      "",
      "Area shortlist",
      `- First-choice areas: ${areas}`,
      `- Backup areas: ${backupAreas}`,
      "",
      "School / routine anchor",
      `- ${schoolRoleLabels[schoolRole]}`,
      "",
      "Non-negotiables",
      ...joinLines(nonNegotiables).map((line) => `- ${line}`),
      "",
      "Nice to have",
      ...joinLines(niceToHave).map((line) => `- ${line}`),
      "",
      "Dealbreakers",
      ...joinLines(dealbreakers).map((line) => `- ${line}`),
      "",
      "Notes",
      ...joinLines(notes).map((line) => `- ${line}`),
      "",
      "Thank you.",
    ];

    return lines.join("\n");
  }, [
    adults,
    areas,
    arrivalWindow,
    backupAreas,
    bedroomsIdeal,
    bedroomsMinimum,
    budgetComfort,
    budgetStretch,
    dealbreakers,
    kidsAges,
    moveShape,
    niceToHave,
    nonNegotiables,
    notes,
    schoolRole,
    workNeeds,
  ]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function resetForm() {
    setArrivalWindow("");
    setMoveShape("test-stay");
    setAdults("");
    setKidsAges("");
    setBedroomsIdeal("");
    setBedroomsMinimum("");
    setWorkNeeds("");
    setBudgetComfort("");
    setBudgetStretch("");
    setAreas("");
    setBackupAreas("");
    setSchoolRole("maybe");
    setNonNegotiables("");
    setNiceToHave("");
    setDealbreakers("");
    setNotes("");
    setCopied(false);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Build the message first</span>
          <span className={badge}>Gaia Group-ready brief</span>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Arrival window</span>
              <input className={inputBase} value={arrivalWindow} onChange={(e) => setArrivalWindow(e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Move shape</span>
              <select className={inputBase} value={moveShape} onChange={(e) => setMoveShape(e.target.value as MoveShape)}>
                {Object.entries(moveShapeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Adults</span>
              <input className={inputBase} value={adults} onChange={(e) => setAdults(e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Kids' ages</span>
              <input className={inputBase} value={kidsAges} onChange={(e) => setKidsAges(e.target.value)} />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Ideal bedrooms</span>
              <input className={inputBase} value={bedroomsIdeal} onChange={(e) => setBedroomsIdeal(e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Minimum bedrooms</span>
              <input className={inputBase} value={bedroomsMinimum} onChange={(e) => setBedroomsMinimum(e.target.value)} />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Work-from-home needs</span>
            <input className={inputBase} value={workNeeds} onChange={(e) => setWorkNeeds(e.target.value)} />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Comfortable budget band</span>
              <input className={inputBase} value={budgetComfort} onChange={(e) => setBudgetComfort(e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Stretch ceiling</span>
              <input className={inputBase} value={budgetStretch} onChange={(e) => setBudgetStretch(e.target.value)} />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">First-choice areas</span>
              <input className={inputBase} value={areas} onChange={(e) => setAreas(e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Backup areas</span>
              <input className={inputBase} value={backupAreas} onChange={(e) => setBackupAreas(e.target.value)} />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Empathy School role</span>
            <select className={inputBase} value={schoolRole} onChange={(e) => setSchoolRole(e.target.value as SchoolRole)}>
              {Object.entries(schoolRoleLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Non-negotiables</span>
            <textarea className={`${inputBase} min-h-[120px]`} value={nonNegotiables} onChange={(e) => setNonNegotiables(e.target.value)} />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Nice to have</span>
              <textarea className={`${inputBase} min-h-[120px]`} value={niceToHave} onChange={(e) => setNiceToHave(e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Dealbreakers</span>
              <textarea className={`${inputBase} min-h-[120px]`} value={dealbreakers} onChange={(e) => setDealbreakers(e.target.value)} />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Extra notes</span>
            <textarea className={`${inputBase} min-h-[110px]`} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={badgeAccent}>Copyable output</span>
            {copied ? <span className={badge}>Copied</span> : null}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Your housing brief</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            This does not need to sound polished. It just needs to be grounded enough that the first housing conversation starts with reality.
          </p>
          <textarea className={`${inputBase} mt-5 min-h-[420px] font-mono text-xs leading-6`} readOnly value={brief} />
          <div className={btnRow}>
            <button type="button" className={buttonPrimary} onClick={handleCopy} data-track="housing_brief_copy">
              Copy brief
            </button>
            <button type="button" className={buttonSecondary} onClick={resetForm} data-track="housing_brief_reset">
              Clear form
            </button>
            <a
              className={buttonSecondary}
              href={buildContactHref("Housing intro", { from: "/housing-brief-builder", partner: "gaia-group-bali" })}
              data-track="housing_brief_contact"
            >
              Open contact form
            </a>
          </div>
        </div>

        <div className={cardCls}>
          <strong className="text-sm font-semibold text-gray-900">What makes this stronger</strong>
          <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
            <li>Use a range, not one magic number.</li>
            <li>Keep the shortlist to two or three real areas.</li>
            <li>Say what your family is trying to avoid, not only what would be nice.</li>
            <li>Mention whether Empathy School is shaping commute decisions.</li>
          </ul>
          <div className={btnRow}>
            <a className={buttonSecondary} href="/housing-intro-readiness" data-track="housing_brief_readiness">
              Check housing readiness
            </a>
            <a className={buttonSecondary} href="/resources/gaia-group-intro-checklist" data-track="housing_brief_checklist">
              Intro checklist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
