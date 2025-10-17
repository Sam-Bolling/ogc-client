/**
 * OGC API – Connected Systems Model Definitions
 * Shared TypeScript interfaces for CSAPI entities.
 *
 * Includes:
 *   - Core CSAPI resource types
 *   - Systems-specific extensions (Part 2 §8)
 */

export interface CSAPIResource {
  id: string;
  type: string;
  [key: string]: any;
}

export interface CSAPICollection {
  type: "FeatureCollection";
  itemType?: string;
  features: CSAPIResource[];
  links?: Array<{ rel: string; href: string; type?: string }>;
}

/* -------------------------------------------------------------------------- */
/*                              Systems (Part 2 §8)                           */
/* -------------------------------------------------------------------------- */

/**
 * Represents a link relation associated with a System.
 */
export interface CSAPISystemLink {
  rel: string;
  href: string;
  type?: string;
  title?: string;
}

/**
 * Represents a System resource (Feature) in CSAPI Part 2.
 */
export interface CSAPISystem extends CSAPIResource {
  id: string;
  name?: string;
  description?: string;
  status?: string;
  links?: CSAPISystemLink[];
}

/**
 * Represents a Systems FeatureCollection response.
 */
export interface CSAPISystemCollection extends CSAPICollection {
  itemType: "System";
  features: CSAPISystem[];
}

/* -------------------------------------------------------------------------- */
/*                       Parameters and Other Shared Types                    */
/* -------------------------------------------------------------------------- */

/**
 * Generic CSAPIParameter type — retained for Part 1 compatibility.
 */
export interface CSAPIParameter {
  name: string;
  description?: string;
  required?: boolean;
  schema?: Record<string, any>;
}
