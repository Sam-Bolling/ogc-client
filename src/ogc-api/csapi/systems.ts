/**
 * CSAPI Systems Client
 * Implements access to /systems and /systems/{id} resources
 * according to OGC API – Connected Systems Part 1 § 10.
 */

import { maybeFetchOrLoad } from "./helpers";
import { getSystemsUrl } from "./url_builder";

export interface CSAPISystem {
  id: string;
  type: string;
  properties: Record<string, any>;
}

/**
 * Retrieve the /systems collection.
 * Loads fixture or fetches live data depending on execution mode.
 */
export async function listSystems(apiRoot: string): Promise<CSAPISystem[]> {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);

  if (!data || !Array.isArray(data.features)) {
    throw new Error("Invalid systems collection structure");
  }

  return data.features.map((f: any) => ({
    id: f.id,
    type: f.type,
    properties: f.properties ?? {},
  }));
}

/**
 * Retrieve a single System by ID.
 * Loads fixture data or fetches live resource.
 */
export async function getSystemById(apiRoot: string, id: string): Promise<CSAPISystem> {
  const systems = await listSystems(apiRoot);
  const match = systems.find((s) => s.id === id);
  if (!match) throw new Error(`System '${id}' not found`);
  return match;
}
