/**
 * OGC API – Connected Systems: Properties Client
 * Implements client logic for CSAPI Property resources (Part 2 §10–11)
 *
 * Mirrors Systems and SamplingFeatures clients for consistency.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getPropertiesUrl } from "./url_builder";

/**
 * Property interface
 * Represents a measurable or controllable attribute observed or commanded
 * within the CSAPI data model (e.g., temperature, pressure, switchState).
 */
export interface Property {
  id: string;
  type: "Property";
  name?: string;
  definition?: string;
  description?: string;
  observedUnit?: string;
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve the list of available Properties (Collection).
 */
export async function listProperties(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; members: Property[] }> {
  const url = getPropertiesUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Property by ID.
 */
export async function getPropertyById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Property> {
  const url = `${getPropertiesUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const PropertiesClient = {
  list: listProperties,
  get: getPropertyById,
};
