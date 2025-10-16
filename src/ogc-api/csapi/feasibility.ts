/**
 * OGC API – Connected Systems: Feasibility Client
 * Implements client logic for CSAPI Feasibility resources (Part 2 §13)
 *
 * Provides access to feasibility evaluations linked to Commands and ControlStreams.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getFeasibilityUrl } from "./url_builder";

/**
 * Feasibility interface
 * Represents the outcome of a pre-execution evaluation for a proposed Command.
 */
export interface Feasibility {
  id: string;
  type: "Feature";
  properties: {
    evaluatedTime?: string;
    commandType?: string;
    isFeasible: boolean;
    reason?: string;
    parameters?: Record<string, any>;
    system?: { id: string; href?: string };
    controlStream?: { id: string; href?: string };
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve all Feasibility results (FeatureCollection).
 */
export async function listFeasibility(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: Feasibility[] }> {
  const url = getFeasibilityUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Feasibility assessment by ID.
 */
export async function getFeasibilityById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Feasibility> {
  const url = `${getFeasibilityUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const FeasibilityClient = {
  list: listFeasibility,
  get: getFeasibilityById,
};
