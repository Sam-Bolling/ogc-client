/**
 * OGC API – Connected Systems (CSAPI)
 * Central module export entry point.
 *
 * This file exposes all client classes for dynamic import by the test harness
 * (see helpers.ts: CSAPI_CLIENT_MODE support).
 *
 * Conforms to OGC API – Connected Systems Parts 1 and 2 (OGC 23-001, 23-002)
 * and preserves naming conventions consistent with ogc-client patterns.
 */

export * from "./model";
export * from "./helpers";
export * from "./url_builder";

/* -------------------------------------------------------------------------- */
/*                         Individual Client Class Exports                    */
/* -------------------------------------------------------------------------- */
/**
 * Each client corresponds to a canonical CSAPI resource collection.
 * These clients are progressively implemented as part of the CSAPI
 * client module buildout.
 *
 * Example naming convention:
 *   - /systems              → SystemsClient
 *   - /deployments          → DeploymentsClient
 *   - /procedures           → ProceduresClient
 *   - /samplingFeatures     → SamplingFeaturesClient
 *   - /properties           → PropertiesClient
 *   - /datastreams          → DatastreamsClient
 *   - /observations         → ObservationsClient
 *   - /controlStreams       → ControlStreamsClient
 *   - /commands             → CommandsClient
 *   - /feasibility          → FeasibilityClient
 *   - /systemEvents         → SystemEventsClient
 *
 * All names are exported in PascalCase for automatic discovery by the
 * test harness via helpers.ts → maybeFetchOrLoad().
 */

export { SystemsClient } from "./systems";
export { DeploymentsClient } from "./deployments";
export { ProceduresClient } from "./procedures";
export { SamplingFeaturesClient } from "./sampling-features";
export { PropertiesClient } from "./properties";
export { DatastreamsClient } from "./datastreams";
export { ObservationsClient } from "./observations";
export { ControlStreamsClient } from "./control-streams";
export { CommandsClient } from "./commands";
export { FeasibilityClient } from "./feasibility";
export { SystemEventsClient } from "./events";

/* -------------------------------------------------------------------------- */
/*                           Fallback / Aggregator Export                     */
/* -------------------------------------------------------------------------- */
/**
 * If consumers prefer to access all clients through a single aggregate
 * object, the following export provides that convenience.
 */
export const CSAPIClients = {
  SystemsClient: undefined as any,
  DeploymentsClient: undefined as any,
  ProceduresClient: undefined as any,
  SamplingFeaturesClient: undefined as any,
  PropertiesClient: undefined as any,
  DatastreamsClient: undefined as any,
  ObservationsClient: undefined as any,
  ControlStreamsClient: undefined as any,
  CommandsClient: undefined as any,
  FeasibilityClient: undefined as any,
  SystemEventsClient: undefined as any,
};

/**
 * Note:
 * Each client will progressively replace its `undefined` placeholder
 * as actual implementations (e.g., SystemsClient, ProceduresClient)
 * are developed and imported above.
 */
