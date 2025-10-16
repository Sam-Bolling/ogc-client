/**
 * OGC API – Connected Systems: Sampling Features Client
 * Implements client logic for CSAPI SamplingFeature resources (Part 2 §10–11)
 *
 * Mirrors Systems and Deployments clients to maintain consistency.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getSamplingFeaturesUrl } from "./url_builder";

/**
 * SamplingFeature interface
 * Represents a physical or logical feature that serves as the
 * feature-of-interest for observations or deployments.
 */
export interface SamplingFeature {
  id: string;
  type: "Feature";
  geometry?: any;
  properties: {
    name?: string;
    description?: string;
    sampledFeature?: {
      id: string;
      href?: string;
    };
    relatedSystem?: {
      id: string;
      href?: string;
    };
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
}

/**
 * Retrieve all SamplingFeatures (FeatureCollection).
 */
export async function listSamplingFeatures(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: SamplingFeature[] }> {
  const url = getSamplingFeaturesUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific SamplingFeature by ID.
 */
export async function getSamplingFeatureById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<SamplingFeature> {
  const url = `${getSamplingFeaturesUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const SamplingFeaturesClient = {
  list: listSamplingFeatures,
  get: getSamplingFeatureById,
};
