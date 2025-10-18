# OGC API – Connected Systems (CSAPI) Client Implementation Plan (v2.0)

### Revision Date
October 2025

---

## 1. Executive Summary

This document describes the **revised implementation plan** for adding **OGC API – Connected Systems (Parts 1 & 2)** client-side capability to the open-source **`ogc-client`** library.  
It replaces the draft plan with the **actual structured process** executed collaboratively between August – October 2025.

The purpose of this effort is to provide a robust, modular, and standards-compliant TypeScript implementation of the **Connected Systems API** that:

- Aligns fully with OGC Standards 23-001 (Part 1) and 23-002 (Part 2)  
- Preserves architectural parity with existing OGC API – EDR modules  
- Uses **test-driven development (TDD)** to guarantee traceability from requirement → test → fixture → code  
- Maintains minimal surface-area change to the upstream `ogc-client` repository  

---

## 2. Architecture Overview

The **CSAPI module** resides under:

```
src/ogc-api/csapi/
```

and follows the established EDR pattern of:
- one client file per resource collection  
- one test specification per collection under `__tests__/`  
- centralized URL-builder, helper, and model files  
- shared fixtures within `/fixtures/ogc-api/csapi/sample-data-hub/`

### Directory Summary

| Category | Example Path | Purpose |
|-----------|---------------|---------|
| Client classes | `src/ogc-api/csapi/systems.ts` | Implements REST interaction per resource |
| Tests | `src/ogc-api/csapi/__tests__/systems.spec.ts` | Jest spec per requirement |
| Fixtures | `fixtures/ogc-api/csapi/sample-data-hub/systems.json` | Mock data for hybrid tests |
| Helpers | `src/ogc-api/csapi/helpers.ts` | Fixture management & feature assertions |
| URL Builder | `src/ogc-api/csapi/url_builder.ts` | Canonical endpoint composition |

All imports are **relative**, ensuring compatibility with upstream build systems and mirroring the structure of `src/ogc-api/edr/`.

---

## 3. Phase Breakdown

### **Phase 1 – Requirements & Test Matrix**
**Objective:** Translate OGC CSAPI Parts 1 & 2 specifications into traceable implementation artifacts.  
**Deliverables:**
- `CSAPI_Requirements_Register_v1.0.md`
- `CSAPI_Test_Design_Matrix_v1.0.md`
- Classification of requirements as _Inherited_, _Specialized_, or _New_
- Cross-reference with `openapi-connectedsystems-1.yaml` and `-2.yaml`

**Outcome:** A comprehensive traceability map linking every normative requirement to a planned Jest test.  
✅ **Status:** Complete

---

### **Phase 2 – Test Scaffolding & Client Implementation**
**Objective:** Implement test scaffolds and corresponding client classes per resource collection.  
**Deliverables:**
- Jest specs under `src/ogc-api/csapi/__tests__/`
- Core client modules (`systems.ts`, `deployments.ts`, `procedures.ts`, `samplingFeatures.ts`, `properties.ts`, `datastreams.ts`, `observations.ts`, `controlStreams.ts`, `commands.ts`, `feasibility.ts`, `systemEvents.ts`)
- Updated `index.ts` aggregator
- Helper utilities for hybrid (fixture/live) execution

**Outcome:**  
All client modules compiled and exported successfully with passing baseline tests.  
✅ **Status:** Complete

---

### **Phase 3 – Fixture Integration & Validation**
**Objective:** Create representative JSON fixtures reflecting canonical responses per Part 1 & 2.  
**Deliverables:**
- “Sample Data Hub” fixture collection under `fixtures/ogc-api/csapi/sample-data-hub/`
- Lifecycle, linkage, and encoding validation tests
- Hybrid execution mode via `maybeFetchOrLoad()`

**Key Tests:**
- `clients.lifecycle.spec.ts` — client GET/LIST validation  
- `linkage.spec.ts` — cross-collection link integrity  
- `system-events.spec.ts` & `systems.spec.ts` — canonical event linkage  

**Outcome:**  
46 test suites fully passing with hybrid fixtures; consistent schema validation confirmed.  
✅ **Status:** Complete

---

### **Phase 4 – Integration Audit & Upstream Preparation**
**Objective:** Ensure internal consistency and readiness for merge into upstream `camptocamp/ogc-client`.  
**Deliverables:**
- `CSAPI_Consistency_Audit_v1.0.md` (generated via `audit_tree.txt`)  
- Verification of export parity in `index.ts`  
- Validation of fixture completeness (no missing keys)  
- Repository-wide Jest regression: ✔ 47 / 47 passed  

**Pending Tasks:**
- Add inline JSDoc comments for public classes  
- Expand README section describing CSAPI usage examples  
- Draft pull-request summary referencing implemented requirements  

🟡 **Status:** In Progress

---

## 4. Traceability Framework

Each CSAPI requirement is mapped through four aligned artifacts:

| Layer | Artifact | Description |
|:------|:----------|:-------------|
| **Specification** | OGC 23-001 / 23-002 (PDF + YAML) | Normative definitions |
| **Requirements Register** | `/docs/requirements/CSAPI_Requirements_Register_v1.0.md` | Canonical list + classification |
| **Test Design Matrix** | `/docs/tests/CSAPI_Test_Design_Matrix_v1.0.md` | Requirement → test case mapping |
| **Implementation** | `/src/ogc-api/csapi/` + fixtures | Code + data realization |

This ensures 1:1 traceability and simplifies OGC Compliance Test Suite (CITE) alignment.

---

## 5. Future Roadmap

| Category | Next Steps | Target |
|-----------|-------------|--------|
| **Documentation** | Update `README.md` to describe CSAPI client usage, add overview diagram | Oct 2025 |
| **Upstream PR Integration** | Submit consolidated PR to `camptocamp/ogc-client` main branch | Nov 2025 |
| **Cross-API Validation** | Align CSAPI feature patterns with EDR & Features modules | Q4 2025 |
| **Extended Testing** | Introduce live endpoint fixtures via `CSAPI_LIVE` mode | Q4 2025 |
| **Phase 5 (Optional)** | Integrate SensorML 3.0 and SWE Common 3.0 encodings for advanced discovery | 2026 cycle |

---

## 6. Reference Materials

| Type | File | Description |
|------|------|--------------|
| OGC CSAPI Part 1 | `OGC_CS_API_Part1_v1.0.0_23-001.pdf` | Core architecture & resource model |
| OGC CSAPI Part 2 | `OGC_CS_API_Part2_v1.0.0_23-002.pdf` | System Events & advanced linkages |
| OpenAPI YAML (Part 1) | `openapi-connectedsystems-1.yaml` | Canonical OpenAPI definition |
| OpenAPI YAML (Part 2) | `openapi-connectedsystems-2.yaml` | Canonical OpenAPI definition |
| SensorML 3.0 | `OGC_SensorML_v3.0.0_23-000.pdf` | Procedural and deployment metadata |
| SWE Common 3.0 | `OGC_SWE_Common_v3.0.0_24-014.pdf` | Encoding foundation for CSAPI |
| Requirements Register | `/docs/requirements/CSAPI_Requirements_Register_v1.0.md` | Extracted requirements |
| Test Design Matrix | `/docs/tests/CSAPI_Test_Design_Matrix_v1.0.md` | Full test traceability |
| Consistency Audit | `/docs/audits/CSAPI_Consistency_Audit_v1.0.md` | Module and fixture integrity |

---

## 7. Conclusion

The **CSAPI Client Implementation (v2.0)** delivers a complete, standards-aligned client for OGC API – Connected Systems Parts 1 and 2.  
The project now maintains **full parity** with upstream EDR, passes **all automated tests**, and establishes a robust foundation for future integration with other OGC API modules.

Upon completion of Phase 4 documentation and merge preparation, the CSAPI client will be ready for upstream contribution review.
