/**
 * Tests for CSAPI Part 2 — Encodings (Dynamic Data)
 * Validates that dynamic data resources (Datastreams, Observations)
 * support encodings based on SWE Common 3.0, as required by Part 2 Table 1.
 *
 * Traces to:
 *   - /req/encodings/swe-common        (23-002 Table 1)
 *   - /req/encodings/observations-json (23-002 § 7.4)
 *   - /req/encodings/content-negotiation (23-002 § 7.4)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Confirms valid structure for SWE Common-based encodings
 *   - Verifies JSON vs Binary content types and negotiation support
 */

import {
  getDatastreamsUrl,
  getObservationsUrl,
} from "../url_builder";
import { maybeFetchOrLoad } from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/encodings/swe-common
 * Datastreams SHALL advertise and provide data encodings conforming to SWE Common 3.0.
 */
test("GET /datastreams advertises SWE Common 3.0 encodings", async () => {
  const url = getDatastreamsUrl(apiRoot) + "?f=application/swe+json";
  const data = await maybeFetchOrLoad("encodings_part2_swecommon", url);

  expect(data).toBeDefined();
  expect(data).toHaveProperty("type", "Datastream");
  expect(data).toHaveProperty("encoding");
  expect(data.encoding).toMatch(/swe|SWE/i);
});

/**
 * Requirement: /req/encodings/observations-json
 * Observations SHALL be retrievable as JSON using SWE Common schemas.
 */
test("GET /observations returns SWE Common JSON representation", async () => {
  const url = getObservationsUrl(apiRoot) + "?f=application/swe+json";
  const data = await maybeFetchOrLoad("encodings_part2_observations_swe", url);

  expect(data).toBeDefined();
  expect(data.type).toBe("FeatureCollection");
  expect(Array.isArray(data.features)).toBe(true);

  const first = data.features[0];
  expect(first).toHaveProperty("properties");
  expect(first.properties).toHaveProperty("result");
});

/**
 * Requirement: /req/encodings/content-negotiation
 * The server SHALL support standard HTTP content negotiation for dynamic data encodings.
 */
test("Server supports content negotiation for SWE JSON and OM JSON", async () => {
  const sweUrl = getObservationsUrl(apiRoot) + "?f=application/swe+json";
  const omUrl = getObservationsUrl(apiRoot) + "?f=application/om+json";

  const sweData = await maybeFetchOrLoad("encodings_part2_observations_swe", sweUrl);
  const omData = await maybeFetchOrLoad("encodings_part2_observations_om", omUrl);

  expect(sweData.type).toBe("FeatureCollection");
  expect(omData.type).toBe("FeatureCollection");
});
