# Phase 2 · Step 4 · Sub-Step 1 — Implement Systems Client  
*(OGC Client CSAPI Implementation Project)*

---

## 🎯 Objective

Implement the **CSAPI Systems Client** — the foundational module providing access to  
`/systems` and `/systems/{id}` endpoints as defined in **OGC API – Connected Systems Part 1 § 10**.

This sub-step begins the **Incremental TDD Implementation Phase**, translating the previously built test harness (Phase 2 · Step 3) into working client logic.

---

## 🧩 Files Added or Updated

| File | Action | Purpose |
|:--|:--|:--|
| `src/ogc-api/csapi/systems.ts` | 🆕 Created | Implements CSAPI client methods for `/systems` and `/systems/{id}`. |
| `src/ogc-api/csapi/index.ts` | 🆕 Created | Defines the CSAPI module entry point and exports client functions. |
| `src/ogc-api/csapi/helpers.ts` | ✅ Reused | Provides hybrid fixture/live execution utilities (`maybeFetchOrLoad`). |
| `src/ogc-api/csapi/url_builder.ts` | ✅ Reused | Supplies endpoint URL constructors (e.g., `getSystemsUrl`). |
| `fixtures/ogc-api/csapi/sample-data-hub/systems.json` | ✅ Used | Provides offline fixture data for Systems tests. |

---

## 🧱 Implementation Summary

**Primary File:** `src/ogc-api/csapi/systems.ts`

```ts
/**
 * CSAPI Systems Client
 * Implements access to /systems and /systems/{id} resources
 * according to OGC API – Connected Systems Part 1 § 10.
 */

import { maybeFetchOrLoad } from "./helpers";
import { getSystemsUrl } from "./url_builder";

export interface CSAPISystem {
  id: string;
  type: string;
  properties: Record<string, any>;
}

export async function listSystems(apiRoot: string): Promise<CSAPISystem[]> {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);

  if (!data || !Array.isArray(data.features)) {
    throw new Error("Invalid systems collection structure");
  }

  return data.features.map((f: any) => ({
    id: f.id,
    type: f.type,
    properties: f.properties ?? {},
  }));
}

export async function getSystemById(apiRoot: string, id: string): Promise<CSAPISystem> {
  const systems = await listSystems(apiRoot);
  const match = systems.find((s) => s.id === id);
  if (!match) throw new Error(`System '${id}' not found`);
  return match;
}
