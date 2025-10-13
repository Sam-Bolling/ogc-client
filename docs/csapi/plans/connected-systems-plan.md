# 🧭 Implementation Plan: OGC API Connected Systems Client

This document outlines the step-by-step plan for integrating support for the OGC API - Connected Systems standard into the [`camptocamp/ogc-client`](https://github.com/camptocamp/ogc-client) TypeScript library. Development is performed in [Sam-Bolling/ogc-client](https://github.com/Sam-Bolling/ogc-client) and tracked in [OS4CSAPI](https://github.com/users/Sam-Bolling/projects/1) with the intent to contribute upstream via [Issue #118](https://github.com/camptocamp/ogc-client/issues/118).

This implementation follows a Test-Driven Development (TDD) workflow: each method will be defined by its expected behavior through failing tests before implementation begins. This ensures clarity, coverage, and contributor confidence.

---

## ✅ Goals

- Modular client using composition  
- Flexible query interface using `Record<string, string>`  
- Support for Systems, Observations, System History, Commands  
- Full test coverage and documentation  
- Capability detection for conditional exposure  
- Compliance with CSAPI spec via modular implementation  
- Contribution to upstream repo with maintainable design  
- Test-Driven Development (TDD) as a foundational workflow  

---

## 🧠 Architectural Rationale (TypeScript)

This implementation follows the modular design patterns used in the upstream `camptocamp/ogc-client` TypeScript library. Rather than extending the main client via inheritance, CSAPI functionality will be implemented using a functional layout with modular utilities and colocated tests.

This approach mirrors how EDR support is integrated — using capability detection and conditional exposure — and ensures that CSAPI logic remains isolated, testable, and maintainable.

### Key Design Principles

- **Composition over inheritance**: CSAPI logic is injected as a property (`connectedSystems`) only if the server advertises support  
- **Modular client structure**: Each API (Features, EDR, CSAPI) lives in its own folder and namespace  
- **Capability detection**: The main client will expose `.connectedSystems` only if CSAPI-specific links or metadata are present  
- **Type safety**: All query parameters and responses will use TypeScript interfaces and `Record<string, string>` for flexible filtering  
- **Testability**: Each method will be covered by unit tests using Jest, with mock responses for isolated validation  
- **TDD-first workflow**: All behavior will be defined via failing tests before implementation begins, following the Red → Green → Refactor cycle  

This design ensures that CSAPI support can be added without disrupting existing functionality, and can be cleanly merged back into the upstream repo via a pull request referencing [Issue #118](https://github.com/camptocamp/ogc-client/issues/118).

---

## 📁 Recommended File Structure and Integration Points

To align with existing modules like EDR, CSAPI support will be added under `src/ogc-api/connected-systems`. Additional integration points will follow the precedent set in [PR #114](https://github.com/camptocamp/ogc-client/pull/114).

```plaintext
src/
└── ogc-api/
    └── csapi/
    |   ├── model.ts                         ← Type-safe response modeling
    |   ├── model.spec.ts                    ← Tests for model logic
    |   ├── helpers.ts                       ← Utility functions (e.g., query encoding)
    |   ├── helpers.spec.ts                  ← Tests for helpers
    |   ├── url_builder.ts                   ← Dynamic URL construction
    |   ├── index.ts                         ← Optional: entry point for module export
    ├── endpoint.ts                          ← Shared fetch logic
    ├── endpoint.spec.ts                     ← Tests for endpoint logic
    ├── link_utils.ts                        ← Link parsing utilities
    ├── link-utils.spec.ts                   ← Tests for link utilities
    ├── info.ts                              ← Shared metadata handling
    ├── model.ts                             ← Shared modeling utilities

app/
└── examples/
    └── csapi.ts                            ← Example usage of CSAPI client

src/components/ogc-api/
└── OgcApiEndpoint.vue                      ← Update to conditionally expose CSAPI

fixtures/ogc-api/
└── csapi/
    └── sample-data-hub.json               ← Mock CSAPI response data

collections/
├── conformance.json                       ← Update to include CSAPI conformance class
├── reservoir-api.json                     ← Update if CSAPI endpoints are added
├── collections.json                       ← Update if CSAPI collections are exposed

sample-data-hub/
└── collections.json                       ← Update if CSAPI collections are exposed
```

**Testing Note:**  
This repo uses Jest and colocates tests with implementation files using `.spec.ts`. Follow this pattern for all CSAPI modules. Use mock fixtures from `fixtures/ogc-api/csapi/` to isolate behavior.

---

## 📋 Phase Checklist

<details>
<summary>🟨 Phase 0: Planning & Setup</summary>

- [x] Fork `camptocamp/ogc-client` and clone locally or use GitHub.dev  
- [x] Create feature branch `capability/ogc-connected-systems`  
- [x] Enable Issues tab in fork
- [x] Create GitHub Project board
- [x] Document implementation plan (`docs/connected-systems-plan.md`)  
- [x] Add issues to repo and update project board  

</details>

<details>
<summary>🟦 Phase 1: Scaffolding & Test Setup</summary>

- [x] Create file structure under src/ogc-api/csapi
- [x] Remove ConnectedSystemsClient.ts in favor of modular layout
- [x] Create placeholder files for `model.ts`, `endpoint.ts`, `helpers.ts`, etc.
- [x] Rename folder from connected-systems to csapi
- [X] Create `.spec.ts` test files for each module  
- [ ] Add mock fixture file under `fixtures/ogc-api/connected-systems/sample-data-hub.json`  
- [ ] Set up Jest test framework (already present in repo)  

</details>

<details>
<summary>🟩 Phase 2: Capability Detection </summary>

- [ ] Write test: `.connectedSystems` is undefined when CSAPI is not supported  
- [ ] Write test: `.connectedSystems` is defined when CSAPI endpoints are present  
- [ ] Implement detection logic to pass tests  
- [ ] Integrate CSAPI into main client using composition  
- [ ] Update `OgcApiEndpoint.vue` to expose CSAPI conditionally  

</details>

<details>
<summary>🟦 Phase 3: Method Implementation </summary>

For each method:

1. Write a failing test that defines expected behavior  
2. Implement minimal code to pass the test  
3. Refactor for clarity and reuse  
4. Add JSDoc comments and upstream spec references  

Methods to implement:

- [ ] `getSystems(params: Record<string, string>)`  
- [ ] `getObservations(params: Record<string, string>)`  
- [ ] `getSystemHistory(params: Record<string, string>)`  
- [ ] `getCommands(params: Record<string, string>)`  

</details>

<details>
<summary>🟧 Phase 4: Shared Patterns & Fixtures</summary>

- [ ] Extract reusable fetch logic  
- [ ] Add utility functions for query param encoding  
- [ ] Create mock data fixtures for CSAPI responses  
- [ ] Ensure consistent mocking and assertions across tests  

</details>

<details>
<summary>🟨 Phase 5: Documentation & Contributor Experience</summary>

- [ ] Add usage examples to `app/examples/connected-systems.ts`  
- [ ] Document TDD workflow in `CONTRIBUTING.md`  
- [ ] Tag “Good First Issues” for scoped tasks  
- [ ] Create GitHub milestone and label for CSAPI implementation  

</details>

<details>
<summary>🟥 Phase 6: Finalization</summary>

- [ ] Open pull request to your fork’s `main` branch  
- [ ] Review and test integration  
- [ ] Respond to feedback or prepare for upstream contribution  

</details>

<details>
<summary>🆕 Phase 7: Extended CSAPI Support (Post-MVP)</summary>

These methods will be considered after MVP completion:

- [ ] `getProcedures()`  
- [ ] `getDeployments()`  
- [ ] `getProperties()`  
- [ ] `getSamplingFeatures()`  
- [ ] `getDatastreams()`  
- [ ] `getControlChannels()`  
- [ ] `getSystemEvents()`  

</details>

---

## 📜 Compliance Note

This implementation is compliant with the OGC API - Connected Systems specification based on modular support for core entities. Additional entities will be added incrementally. Capability detection ensures that unsupported endpoints are not exposed, preserving interoperability and graceful degradation.




