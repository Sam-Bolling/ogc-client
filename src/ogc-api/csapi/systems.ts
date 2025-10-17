/**
 * OGC API – Connected Systems Part 2: Systems Client
 * Implements client-side access for the /systems collection and related resources.
 *
 * Traces to:
 *   - /req/system/collection-endpoint    (23-002 §8.1)
 *   - /req/system/items-endpoint         (23-002 §8.2)
 *   - /req/system/canonical-url          (23-002 §7.4 Req37)
 *   - /req/system/ref-to-events          (23-002 §7.4 Req43)
 *
 * Exports:
 *   - SystemsClient: main API client class
 */

import { CSAPISystem, CSAPISystemCollection } from "./model";
import { maybeFetchOrLoad } from "./helpers";
import { getSystemsUrl, getSystemEventsUrl } from "./url_builder";

/**
 * SystemsClient
 * Provides typed access to the /systems collection and related resources.
 */
export class SystemsClient {
  readonly apiRoot: string;

  constructor(apiRoot: string) {
    this.apiRoot = apiRoot;
  }

  /**
   * Retrieves the systems collection.
   * Uses fixture "systems" by default, or fetches live data when CSAPI_LIVE=true.
   */
  async list(): Promise<CSAPISystemCollection> {
    const url = getSystemsUrl(this.apiRoot);
    const data = await maybeFetchOrLoad("systems", url);
    return data as CSAPISystemCollection;
  }

  /**
   * Retrieves a single System by ID.
   * Example canonical path: /systems/{systemId}
   */
  async get(id: string): Promise<CSAPISystem> {
    const url = `${getSystemsUrl(this.apiRoot)}/${id}`;
    const data = await maybeFetchOrLoad(`system_${id}`, url);
    return data as CSAPISystem;
  }

  /**
   * Lists all System Events for a given System.
   * Canonical path: /systems/{systemId}/events
   */
  async listEvents(systemId: string): Promise<any> {
    const url = getSystemEventsUrl(this.apiRoot, systemId);
    const data = await maybeFetchOrLoad(`systemEvents_${systemId}`, url);
    return data;
  }

  /**
   * Resolves all related link relations from a System’s metadata.
   * Returns a map of rel→href pairs.
   */
  async getLinkedResources(id: string): Promise<Record<string, string>> {
    const system = await this.get(id);
    const links: Record<string, string> = {};
    system.links?.forEach((l) => {
      if (l.rel && l.href) links[l.rel] = l.href;
    });
    return links;
  }
}
