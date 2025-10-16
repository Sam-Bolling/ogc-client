/**
 * OGC API – Connected Systems: Commands Client
 * Implements client logic for CSAPI Command resources (Part 2 §11–12)
 *
 * Aligned with ControlStreams client but focuses on execution and feedback.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getCommandsUrl } from "./url_builder";

/**
 * Command interface
 * Represents a single actuation instruction or command instance
 * issued to a System via a ControlStream.
 */
export interface Command {
  id: string;
  type: "Feature";
  properties: {
    name?: string;
    description?: string;
    issuedTime?: string;
    executedTime?: string;
    status?: "pending" | "inProgress" | "completed" | "failed";
    commandType?: string;
    parameters?: Record<string, any>;
    result?: Record<string, any>;
    controlStream?: {
      id: string;
      href?: string;
    };
    system?: {
      id: string;
      href?: string;
    };
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve all Commands (FeatureCollection).
 */
export async function listCommands(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: Command[] }> {
  const url = getCommandsUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Command by ID.
 */
export async function getCommandById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Command> {
  const url = `${getCommandsUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const CommandsClient = {
  list: listCommands,
  get: getCommandById,
};
