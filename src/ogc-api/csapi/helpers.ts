import { CSAPIParameter } from './model';

/**
 * Part 1 – Feature Resources
 * --------------------------
 * Extracts CSAPIParameter objects from a parameter block.
 * Used for feature resource queries where `parameter_names` are returned in collection metadata.
 *
 * @param parameterBlock Record of parameters from collection metadata
 * @returns Array of CSAPIParameter objects
 */
export function extractParameters(parameterBlock: Record<string, any>): CSAPIParameter[] {
  return Object.values(parameterBlock) as CSAPIParameter[];
}

/**
 * Part 1 – Feature Resources
 * --------------------------
 * Validates that the provided CRS is supported by the collection.
 *
 * @param crs The CRS string to validate
 * @param supported Array of supported CRS codes
 * @returns The CRS string if valid
 * @throws Error if CRS is not supported
 */
export function validateCrs(crs: string, supported: string[]): string {
  if (!supported.includes(crs)) {
    throw new Error(`Unsupported CRS: '${crs}'. Supported CRS are: ${supported.join(', ')}`);
  }
  return crs;
}

/**
 * Part 1 – Feature Resources
 * --------------------------
 * Converts a 2D or 3D bounding box to a comma-separated string for query parameters.
 *
 * @param bbox Bounding box coordinates [[minX, minY], [maxX, maxY]]
 * @returns String in the form "minX,minY,maxX,maxY"
 */
export function bboxToString(bbox: number[][]): string {
  if (!bbox || bbox.length !== 2 || bbox[0].length !== 2 || bbox[1].length !== 2) {
    throw new Error('Invalid bbox format. Expected [[minX, minY], [maxX, maxY]]');
  }
  return `${bbox[0][0]},${bbox[0][1]},${bbox[1][0]},${bbox[1][1]}`;
}

/**
 * Part 1 & Part 2 – Feature Resources & Dynamic Data
 * --------------------------------------------------
 * Converts a Date or a temporal range to a CSAPI-compatible string.
 *
 * @param param Date or object with start/end properties
 * @returns String representing datetime parameter
 */
export function DateTimeParameterToCSAPIString(param: Date | { start?: Date; end?: Date }): string {
  const format = (d: Date) => d.toISOString();

  if (param instanceof Date) {
    return format(param);
  }

  if ('start' in param && 'end' in param) {
    return `${format(param.start)}/${format(param.end)}`;
  }

  if ('start' in param) {
    return `${format(param.start)}/..`;
  }

  if ('end' in param) {
    return `../${format(param.end)}`;
  }

  throw new Error('Invalid DateTimeParameter');
}

/**
 * Part 2 – Dynamic Data
 * ---------------------
 * Converts a structured ZParameter into a string for vertical levels.
 * Only needed if CSAPI implementation supports vertical dimensions.
 */
export type ZParameter =
  | { type: 'single'; level: number }
  | { type: 'interval'; minLevel: number; maxLevel: number }
  | { type: 'list'; levels: number[] }
  | { type: 'repeating'; repeat: number; minLevel: number; step: number };

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
