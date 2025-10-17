/**
 * Tests for OGC API – Connected Systems Part 2: Cross-Collection Linkage
 *
 * Validates that canonical link relations between CSAPI resources resolve
 * correctly according to OGC 23-002 (Part 2 §7.4, §8–12).
 *
 * Traces to:
 *   - /req/system/ref-to-deployments        (§8.3 Req45)
 *   - /req/deployment/ref-to-systems        (§10.3 Req46)
 *   - /req/deployment/ref-to-procedures     (§10.4 Req47)
 *   - /req/datastream/ref-to-observations   (§11.4 Req49)
 *   - /req/system/ref-to-events             (§7.4 Req43)
 *
 * Strategy:
 *   - Uses hybrid fixtures/live toggle (CSAPI_LIVE)
 *   - Reads fixtures through maybeFetchOrLoad()
 *   - Checks link rel/href integrity between canonical collections
 */

import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";
import {
  getSystemsUrl,
  getDeploymentsUrl,
  getProceduresUrl,
  getDatastreamsUrl,
  getObservationsUrl,
  getSystemEventsUrl,
} from "../url_builder";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/* -------------------------------------------------------------------------- */
/*                           Systems → Deployments                            */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/ref-to-deployments
 * Each System SHALL include a link (rel="deployments") referencing /deployments.
 */
test("Systems include link rel=deployments referencing /deployments", async () => {
  const data = await maybeFetchOrLoad("systems", getSystemsUrl(apiRoot));
  expectFeatureCollection(data, "System");

  const first = data.features[0];
  const deploymentLink = first.links?.find((l: any) => l.rel === "deployments");
  expect(deploymentLink).toBeDefined();
  expectCanonicalUrl(deploymentLink.href, /\/deployments/);
});

/* -------------------------------------------------------------------------- */
/*                         Deployments → Systems & Procedures                 */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/deployment/ref-to-systems
 * Each Deployment SHALL include a link (rel="system") referencing /systems/{id}.
 */
test("Deployments include link rel=system referencing /systems/{id}", async () => {
  const data = await maybeFetchOrLoad("deployments", getDeploymentsUrl(apiRoot));
  expectFeatureCollection(data, "Deployment");

  const first = data.features[0];
  const systemLink = first.links?.find((l: any) => l.rel === "system");
  expect(systemLink).toBeDefined();
  expectCanonicalUrl(systemLink.href, /\/systems\/[A-Za-z0-9\-_]+$/);
});

/**
 * Requirement: /req/deployment/ref-to-procedures
 * Each Deployment SHALL include a link (rel="procedure") referencing /procedures/{id}.
 */
test("Deployments include link rel=procedure referencing /procedures/{id}", async () => {
  const data = await maybeFetchOrLoad("deployments", getDeploymentsUrl(apiRoot));
  const first = data.features[0];
  const procLink = first.links?.find((l: any) => l.rel === "procedure");
  expect(procLink).toBeDefined();
  expectCanonicalUrl(procLink.href, /\/procedures\/[A-Za-z0-9\-_]+$/);
});

/* -------------------------------------------------------------------------- */
/*                         Datastreams → Observations                         */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/datastream/ref-to-observations
 * Each Datastream SHALL include a link (rel="observations") referencing /observations.
 */
test("Datastreams include link rel=observations referencing /observations", async () => {
  const data = await maybeFetchOrLoad("datastreams", getDatastreamsUrl(apiRoot));
  expectFeatureCollection(data, "Datastream");

  const first = data.features[0];
  const obsLink = first.links?.find((l: any) => l.rel === "observations");
  expect(obsLink).toBeDefined();
  expectCanonicalUrl(obsLink.href, /\/observations/);
});

/* -------------------------------------------------------------------------- */
/*                            Systems → SystemEvents                          */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/ref-to-events
 * Systems SHALL expose nested events at /systems/{systemId}/events.
 */
test("Systems expose nested events at /systems/{id}/events", async () => {
  const systemId = "sys-001";
  const data = await maybeFetchOrLoad(
    `systemEvents_${systemId}`,
    getSystemEventsUrl(apiRoot, systemId)
  );

  expectFeatureCollection(data, "SystemEvent");
  if (data.features.length > 0) {
    const first = data.features[0];
    expect(first.properties?.system?.id).toBe(systemId);
  }
});
