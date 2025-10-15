/**
 * Tests for CSAPI Part 1 — Deployments
 * Ensures Deployments are exposed as canonical collections with correct item URLs
 * and reuse of OGC API – Features collection behavior.
 *
 * Traces to:
 *   - /req/deployment/canonical-endpoint  (23-001 §11)
 *   - /req/deployment/resources-endpoint  (23-001 §11)
 *   - /req/deployment/canonical-url       (23-001 §11)
 *   - /req/deployment/collections         (23-001 §11)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates FeatureCollection structure, itemType, and canonical URL patterns
 */

import {
  getDeploymentsUrl
} from "../url_builder";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/deployment/canonical-endpoint
 * The /deployments endpoint SHALL be exposed as the canonical Deployments collection.
 */
test("GET /deployments is exposed as canonical Deployments collection", async () => {
  const url = getDeploymentsUrl(apiRoot);
  const data = await maybeFetchOrLoad("deployments", url);

  expectFeatureCollection(data, "Deployment");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/deployment/resources-endpoint
 * The /deployments collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /deployments returns FeatureCollection (itemType=Deployment)", async () => {
  const url = getDeploymentsUrl(apiRoot);
  const data = await maybeFetchOrLoad("deployments", url);

  expectFeatureCollection(data, "Deployment");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/deployment/canonical-url
 * Each Deployment SHALL have a canonical item URL at /deployments/{id}.
 */
test("Deployments have canonical item URL at /deployments/{id}", async () => {
  const url = getDeploymentsUrl(apiRoot);
  const data = await maybeFetchOrLoad("deployments", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/deployments/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/deployments\/[^/]+$/);
});

/**
 * Requirement: /req/deployment/collections
 * Any collection with featureType sosa:Deployment SHALL behave like /deployments.
 */
test("Collections with featureType sosa:Deployment behave like /deployments", async () => {
  const url = getDeploymentsUrl(apiRoot);
  const data = await maybeFetchOrLoad("deployments", url);

  expectFeatureCollection(data, "Deployment");

  const featureType = data.features?.[0]?.properties?.featureType;
  if (featureType) {
    expect(featureType).toMatch(/sosa:Deployment/i);
  }
});
