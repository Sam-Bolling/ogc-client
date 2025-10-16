/**
 * OGC API – Connected Systems: Observations Client
 * Implements client logic for CSAPI Observation resources (Part 2 §10–11)
 *
 * Follows the pattern of Datastreams, Systems, and SamplingFeatures clients.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getObservationsUrl } from "./url_builder";

/**
 * Observation interface
 * Represents a single measured or computed result associated with a
 * Datastream, Property, and Feature-of-Interest.
 */
export interface Observation {
  id: string;
  type: "Feature";
  properties: {
    phenomenonTime?: string;
    resultTime?: string;
    result?: number | string | Record<string, any>;
    unitOfMeasurement?: string;
    datastream?: {
      id: string;
      href?: string;
    };
    featureOfInterest?: {
      id: string;
      href?: string;
    };
    [key: string]: any;
  };
  geometry?: any;
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve all Observations for the API root (FeatureCollection).
 * May be filtered server-side by Datastream or Feature-of-Interest.
 */
export async function listObservations(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: Observation[] }> {
  const url = getObservationsUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Observation by ID.
 */
export async function getObservationById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Observation> {
  const url = `${getObservationsUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const ObservationsClient = {
  list: listObservations,
  get: getObservationById,
};
