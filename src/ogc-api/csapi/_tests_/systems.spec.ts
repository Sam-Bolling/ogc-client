/**
 * Tests for OGC API – Connected Systems Part 2: Systems Client
 *
 * Traces to:
 *   - /req/system/collection-endpoint    (23-002 §8.1)
 *   - /req/system/items-endpoint         (23-002 §8.2)
 *   - /req/system/canonical-url          (23-002 §7.4 Req37)
 *   - /req/system/ref-to-events          (23-002 §7.4 Req43)
 *
 * Strategy:
 *   - Hybrid fixture/live testing (maybeFetchOrLoad)
 *   - Validates SystemsClient list/get/listEvents/link resolution
 */

import { SystemsClient } from "../systems";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";
import { getSystemsUrl, getSystemEventsUrl } from "../url_builder";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";
const client = new SystemsClient(apiRoot);

/* -------------------------------------------------------------------------- */
/*                               Collection Tests                             */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/collection-endpoint
 * The /systems endpoint SHALL expose a canonical FeatureCollection of Systems.
 */
test("GET /systems is exposed as canonical Systems collection", async () => {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);

  expectFeatureCollection(data, "System");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/* -------------------------------------------------------------------------- */
/*                                  Item Tests                                */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/items-endpoint
 * Each /systems/{id} SHALL return a valid System resource.
 */
test("GET /systems/{id} returns a valid System", async () => {
  const system = await client.get("sys-001");
  expect(system).toBeDefined();
  expect(system.id).toBe("sys-001");
  expect(system.type).toBeDefined();
  expect(Array.isArray(system.links)).toBe(true);
});

/**
 * Requirement: /req/system/canonical-url
 * Each System SHALL have a canonical URL at /systems/{id}.
 */
test("System items have canonical URL pattern /systems/{id}", async () => {
  const system = await client.get("sys-001");
  const url = `${apiRoot}/systems/${system.id}`;
  expectCanonicalUrl(url, /^https?:\/\/.+\/systems\/[^/]+$/);
});

/* -------------------------------------------------------------------------- */
/*                             Nested Event Tests                             */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/ref-to-events
 * Systems SHALL expose nested events at /systems/{systemId}/events.
 */
test("GET /systems/{id}/events lists events for a System", async () => {
  const events = await client.listEvents("sys-001");
  expectFeatureCollection(events, "SystemEvent");
  expect(Array.isArray(events.features)).toBe(true);
});

/* -------------------------------------------------------------------------- */
/*                             Link Resolution Tests                          */
/* -------------------------------------------------------------------------- */

/**
 * Client convenience: resolve link relations for a System.
 */
test("getLinkedResources() returns rel→href mapping for a System", async () => {
  const links = await client.getLinkedResources("sys-001");
  expect(links).toBeDefined();
  expect(Object.keys(links)).toContain("self");
  expect(Object.keys(links)).toContain("events");
  expect(links.events).toMatch(/\/systems\/sys-001\/events/);
});
