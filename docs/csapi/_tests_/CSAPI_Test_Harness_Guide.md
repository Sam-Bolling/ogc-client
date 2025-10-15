# OGC API – Connected Systems (CSAPI) Test Harness Guide  
*(Phase 2 · Step 3 — Test Harness Wiring Completion)*

This document explains how to use, configure, and maintain the **CSAPI client test harness** implemented in this phase.  
It describes the test structure, the hybrid fixture/live execution model, and how tests trace back to the CSAPI Parts 1 & 2 standards.

---

## 🧭 Purpose

The CSAPI test harness verifies that a client correctly implements the **OGC API – Connected Systems** standards:
- **Part 1 — Feature Resources** (OGC 23-001)
- **Part 2 — Dynamic Data** (OGC 23-002)

It provides:
- A comprehensive Jest-based test suite for canonical CSAPI endpoints.
- Hybrid execution using **static fixtures** (offline) or **live network requests**.
- Traceability between each test, fixture, and normative requirement.

---

## 🧩 Test Suite Overview

**Location**
```
src/ogc-api/csapi/__tests__/
```

**Structure**

| Category | Description | Example Files |
|:--|:--|:--|
| Core API behavior | Landing page & conformance checks | `common.spec.ts` |
| Canonical endpoints | Discovery and accessibility of CSAPI endpoints | `endpoints.part2.canonical.spec.ts` |
| Feature resources (Part 1) | Systems, Deployments, Procedures, SamplingFeatures, Properties | `systems.spec.ts`, `deployments.spec.ts`, `procedures.spec.ts`, `sampling-features.spec.ts`, `properties.spec.ts` |
| Dynamic resources (Part 2) | Datastreams, Observations, Commands, Feasibility, ControlStreams, SystemEvents | `datastreams.spec.ts`, `observations.spec.ts`, `commands.spec.ts`, `feasibility.spec.ts`, `controlstreams.spec.ts`, `events.spec.ts` |
| Encodings | GeoJSON, SensorML-JSON, SWE Common, OM-JSON | `encodings.part1.spec.ts`, `encodings.part2.spec.ts` |

Each spec maps directly to normative requirements (`/req/...`) and references a corresponding fixture.

---

## 🧰 Fixtures

**Location**
```
fixtures/ogc-api/csapi/sample-data-hub/
```

**Index**  
See [`Fixture_Index.md`](./Fixture_Index.md) for fixture descriptions, referenced tests, and requirement traceability.

All fixtures are lightweight **stubs** (syntactically correct examples) for offline testing.  
They can later be replaced or extended with live CSAPI responses.

---

## ⚙️ Running the Tests

### 1) Fixture Mode (default — offline)
Uses static JSON fixtures (no network calls).
```bash
npm test -- src/ogc-api/csapi/__tests__/
```

### 2) Live Mode (integration testing)
Fetches responses from a live CSAPI-compliant server.
```bash
CSAPI_LIVE=true CSAPI_API_ROOT=https://example.csapi.server npm test
```

**Environment Variables**

| Name | Description |
|:--|:--|
| `CSAPI_LIVE` | When set to `"true"`, enables live network testing. |
| `CSAPI_API_ROOT` | Base URL of the CSAPI service under test. |

> When `CSAPI_LIVE` is **not** set, the harness automatically falls back to **fixture mode**.

---

## 🧪 Hybrid Execution Model

Helper functions are defined in:
```
src/ogc-api/csapi/helpers.ts
```

| Function | Purpose |
|:--|:--|
| `fetchCollection(url)` | Performs live HTTP fetch. |
| `loadFixture(name)` | Loads a local fixture file by name. |
| `maybeFetchOrLoad(name, url)` | Chooses live vs. fixture mode automatically. |
| `expectFeatureCollection(data, itemType?)` | Standard assertion for FeatureCollection validity. |
| `expectCanonicalUrl(url, pattern)` | Asserts endpoint URL conformance. |

---

## 📘 Traceability and Documentation

| Artifact | Purpose |
|:--|:--|
| `CSAPI_Test_Design_Matrix_v1.0.md` | Maps each requirement (`/req/...`) to test IDs and expected outcomes. |
| `Fixture_Index.md` | Lists all fixtures and their associated tests/requirements. |
| `CSAPI_Test_Harness_Guide.md` *(this file)* | How to execute and maintain the test suite. |

Together these provide full transparency between **standards**, **tests**, and **data**.

---

## 🧾 Phase 2 · Step 3 — Completion Summary

| Deliverable | Status | Location |
|:--|:--|:--|
| Jest spec files for all CSAPI endpoints | ✅ Implemented | `src/ogc-api/csapi/__tests__/` |
| Hybrid helpers (fixture/live switching) | ✅ Implemented | `src/ogc-api/csapi/helpers.ts` |
| URL builder updates | ✅ Implemented | `src/ogc-api/csapi/url_builder.ts` |
| Fixture stubs & folder structure | ✅ Created | `fixtures/ogc-api/csapi/sample-data-hub/` |
| Fixture index (traceability doc) | ✅ Created | `docs/csapi/_tests_/Fixture_Index.md` |
| Test harness guide | ✅ Created | `docs/csapi/_tests_/CSAPI_Test_Harness_Guide.md` |
| Test Design Matrix update | 🔲 Pending (mark “Fixture Ready”) | `docs/csapi/_tests_/CSAPI_Test_Design_Matrix_v1.0.md` |

---

## 🧭 Next Phase

**Phase 2 · Step 4 — Client Implementation (Incremental TDD)**  
Implement CSAPI client functionality in small, test-driven increments until all spec tests pass.  
This phase will:
- Extend `src/ogc-api/csapi/` with client classes/methods.
- Use the existing test harness to drive implementation.
- Replace fixture-only verification with live endpoint validation.

---

*Prepared as part of OGC Client CSAPI Implementation — Phase 2 · Step 3.*
