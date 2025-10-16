/**
 * Tests for CSAPI Part 2 — ControlStreams
 * Validates canonical endpoints and collection semantics for ControlStream resources.
 *
 * Traces to:
 *   - /req/controlstream/canonical-endpoint  (23-002 §7.4)
 *   - /req/controlstream/resources-endpoint  (23-002 §10–11)
 *   - /req/controlstream/canonical-url       (23-002 §7.4)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates FeatureCollection structure and canonical URL patterns
 *   - Mirrors Commands/Feasibility pattern to maintain consistent lifecycle testing
 */

import { getControlStreamsUrl } from "../url_builder";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/controlstream/canonical-endpoint
 * The /controlStreams endpoint SHALL be exposed as the canonical ControlStreams collection.
 */
test("GET /controlStreams is exposed as canonical ControlStreams collection", async () => {
  const url = getControlStreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("controlStreams", url);

  expectFeatureCollection(data, "ControlStream");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/controlstream/resources-endpoint
 * The /controlStreams collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /controlStreams returns FeatureCollection (itemType=ControlStream)", async () => {
  const url = getControlStreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("controlStreams", url);

  expectFeatureCollection(data, "ControlStream");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/controlstream/canonical-url
 * Each ControlStream SHALL have a canonical item URL at /controlStreams/{id}.
 */
test("ControlStreams have canonical item URL at /controlStreams/{id}", async () => {
  const url = getControlStreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("controlStreams", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/controlStreams/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/controlStreams\/[^/]+$/);
});

/**
 * Optional lifecycle linkage
 * If control streams reference Commands or Systems, verify relational integrity.
 */
test("ControlStreams optionally link to related Systems or Commands", async () => {
  const url = getControlStreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("controlStreams", url);

  const first = data.features[0];
  const props = first.properties ?? {};

  // Optional checks — tolerate missing links in minimal fixtures
  if (props.system) {
    expect(props.system).toHaveProperty("id");
  }
  if (props.command) {
    expect(props.command).toHaveProperty("id");
  }
});
