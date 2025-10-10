/**
 * CSAPI Model Definitions
 * 
 * This file defines TypeScript types for OGC API - Common Sensor API (CSAPI)
 * covering both Part 1 (Feature Resources) and Part 2 (Dynamic Data).
 * 
 * Part 1: Feature Resources – metadata, static information about sensors/collections.
 * Part 2: Dynamic Data – spatial/temporal queries returning observation results.
 */

/** -------------------- Part 1: Feature Resources -------------------- */

/**
 * Defines a parameter in a CSAPI collection.
 * Part 1: Feature Resources define observable properties and units.
 */
export interface CSAPIParameter {
  id: string;
  name: string;
  observedProperty: {
    label: {
      id: string;
      en: string;
    };
  };
  unit: {
    label: {
      en: string;
    };
    symbol: {
      value: string;
      type: string;
    };
  };
}

/**
 * CSAPI Collection metadata.
 * Part 1: describes static collection info, including extent and parameters.
 */
export interface CSAPICollection {
  id: string;
  title: string;
  description?: string;
  extent?: {
    spatial?: {
      bbox: number[][]; // [ [minX, minY, maxX, maxY], ... ]
      crs?: string;
    };
    temporal?: {
      interval?: string[]; // ISO 8601 intervals
    };
  };
  parameter_names?: Record<string, CSAPIParameter>;
  data_queries?: Record<
    string,
    { link: { href: string; rel: string; variables?: any } }
  >;
}

/** -------------------- Part 2: Dynamic Data -------------------- */

import { DateTimeParameter } from '../../shared/models.js';

/**
 * A Well Known Text (WKT) string representing a point, linestring, or polygon.
 * Used in dynamic data queries (Part 2).
 */
export type WellKnownTextString = string;

/**
 * Bounding box without vertical axis
 * Used in Part 2 spatial queries.
 */
export type bboxWithoutVerticalAxis = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

/**
 * Bounding box with vertical axis
 * Optional if data has vertical dimension.
 */
export type bboxWithVerticalAxis = bboxWithoutVerticalAxis & {
  minZ: number;
  maxZ: number;
};

/**
 * Vertical (z) query parameter type for Part 2 dynamic data queries.
 */
export type ZParameter =
  | { type: 'single'; level: number }
  | { type: 'interval'; minLevel: number; maxLevel: number }
  | { type: 'list'; levels: number[] }
  | { type: 'repeating'; repeat: number; minLevel: number; step: number };

/**
 * Converts ZParameter to string for query URLs.
 */
export function zParameterToString(z: ZParameter): string {
  switch (z.type) {
    case 'single':
      return `${z.level}`;
    case 'interval':
      return `${z.minLevel}/${z.maxLevel}`;
    case 'list':
      return z.levels.join(',');
    case 'repeating':
      return `R${z.repeat}/${z.minLevel}/${z.step}`;
  }
}

/** -------------------- Optional Query Parameters (Part 2) -------------------- */

export type optionalAreaParams = {
  parameter_name?: string[];
  z?: ZParameter;
  datetime?: DateTimeParameter;
  crs?: string;
  f?: string;
};

export type optionalLocationParams = {
  locationId?: string;
  parameter_name?: string[];
  datetime?: DateTimeParameter;
  crs?: string;
  f?: string;
};

export type optionalCubeParams = {
  parameter_name?: string[];
  z?: ZParameter;
  datetime?: DateTimeParameter;
  crs?: string;
  f?: string;
};

export type optionalTrajectoryParams = {
  z?: ZParameter;
  datetime?: DateTimeParameter;
  parameter_name?: string[];
  crs?: string;
  f?: string;
};

export type optionalCorridorParams = {
  z?: ZParameter;
  datetime?: DateTimeParameter;
  parameter_name?: string[];
  resolution_x?: string;
  resolution_y?: string;
  resolution_z?: string;
  crs?: string;
  f?: string;
};

export type optionalPositionParams = {
  parameter_name?: string[];
  z?: ZParameter;
  datetime?: DateTimeParameter;
  crs?: string;
  f?: string;
};

export type optionalRadiusParams = {
  parameter_name?: string[];
  z?: ZParameter;
  datetime?: DateTimeParameter;
  crs?: string;
  f?: string;
};
