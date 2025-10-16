/**
 * OGC API – Connected Systems (CSAPI)
 * Module entry point.
 * Exports all public client functions for CSAPI Parts 1 & 2.
 */

export * from "./helpers";
export * from "./model";
export * from "./url_builder";

// Resource-specific clients (will be added progressively)
export * from "./systems";
// export * from "./deployments";
// export * from "./procedures";
// export * from "./sampling-features";
// export * from "./properties";
// export * from "./datastreams";
// export * from "./observations";
// export * from "./commands";
// export * from "./feasibility";
// export * from "./controlstreams";
// export * from "./events";
