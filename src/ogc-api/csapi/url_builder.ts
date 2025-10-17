import { CrsCode } from '../../shared/models.js';
import {
  DataQueryType,
  CsapiParameterInfo,
  OgcApiCollectionInfo,
} from './model.js';
import { DateTimeParameterToCSAPIString } from './helpers.js';
import {
  optionalFeatureParams,
  optionalDynamicParams,
  WellKnownTextString,
  zParameterToString,
} from './model.js';

/**
 * Builds query URLs according to the OGC CSAPI standard
 * Part 1: Feature Resources – https://docs.ogc.org/is/23-001/23-001.html
 * Part 2: Dynamic Data – https://docs.ogc.org/is/23-002/23-002.html
 */
export default class CSAPIQueryBuilder {
  private supported_query_types: {
    feature: boolean;
    dynamic: boolean;
    instances: boolean;
  };

  public supported_parameters: Record<string, CsapiParameterInfo> = {};
  public supported_crs: CrsCode[] = [];
  public links: {
    type: string;
    href: string;
    title: string;
    rel: string;
  }[] = [];

  constructor(private collection: OgcApiCollectionInfo) {
    if (!collection.data_queries) {
      throw new Error('No data queries found, cannot issue CSAPI queries');
    }

    this.supported_query_types = {
      feature: collection.data_queries.feature !== undefined,
      dynamic: collection.data_queries.dynamic !== undefined,
      instances: collection.data_queries.instances !== undefined,
    };

    this.supported_parameters = collection.parameter_names;
    this.supported_crs = collection.crs;
    this.links = collection.links;
  }

  /**
   * Return the set of CSAPI queries supported by this collection
   */
  get supported_queries(): Set<DataQueryType> {
    const queries: Set<DataQueryType> = new Set();
    for (const [key, value] of Object.entries(this.supported_query_types)) {
      if (value) {
        queries.add(key as DataQueryType);
      }
    }
    return queries;
  }

  /**
   * Build a Feature query URL (CSAPI Part 1)
   * @see https://docs.ogc.org/is/23-001/23-001.html#feature-resources
   */
  buildFeatureDownloadUrl(
    coords: WellKnownTextString,
    optional_params: optionalFeatureParams = {}
  ): string {
    if (!this.supported_query_types.feature) {
      throw new Error('Collection does not support feature queries');
    }

    const url = new URL(this.collection.data_queries?.feature?.link.href);
    url.searchParams.set('coords', coords);

    if (optional_params.z !== undefined)
      url.searchParams.set('z', zParameterToString(optional_params.z));

    if (optional_params.datetime !== undefined)
      url.searchParams.set(
        'datetime',
        DateTimeParameterToCSAPIString(optional_params.datetime)
      );

    if (optional_params.parameter_name) {
      for (const parameter of optional_params.parameter_name) {
        if (!this.supported_parameters[parameter]) {
          throw new Error(
            `The following parameter name does not exist: '${parameter}'`
          );
        }
      }
      url.searchParams.set(
        'parameter-name',
        optional_params.parameter_name.join(',')
      );
    }

    if (optional_params.crs !== undefined) {
      if (!this.supported_crs.includes(optional_params.crs)) {
        throw new Error(`The following CRS is not supported: '${optional_params.crs}'`);
      }
      url.searchParams.set('crs', optional_params.crs);
    }

    if (optional_params.f !== undefined)
      url.searchParams.set('f', optional_params.f);

    return url.toString();
  }

  /**
   * Build a Dynamic query URL (CSAPI Part 2)
   * @see https://docs.ogc.org/is/23-002/23-002.html#dynamic-data
   */
  buildDynamicDownloadUrl(
    coords: WellKnownTextString,
    optional_params: optionalDynamicParams = {}
  ): string {
    if (!this.supported_query_types.dynamic) {
      throw new Error('Collection does not support dynamic queries');
    }

    const url = new URL(this.collection.data_queries?.dynamic?.link.href);
    url.searchParams.set('coords', coords);

    if (optional_params.z !== undefined)
      url.searchParams.set('z', zParameterToString(optional_params.z));

    if (optional_params.datetime !== undefined)
      url.searchParams.set(
        'datetime',
        DateTimeParameterToCSAPIString(optional_params.datetime)
      );

    if (optional_params.parameter_name) {
      for (const parameter of optional_params.parameter_name) {
        if (!this.supported_parameters[parameter]) {
          throw new Error(
            `The following parameter name does not exist: '${parameter}'`
          );
        }
      }
      url.searchParams.set(
        'parameter-name',
        optional_params.parameter_name.join(',')
      );
    }

    if (optional_params.crs !== undefined) {
      if (!this.supported_crs.includes(optional_params.crs)) {
        throw new Error(`The following CRS is not supported: '${optional_params.crs}'`);
      }
      url.searchParams.set('crs', optional_params.crs);
    }

    if (optional_params.f !== undefined)
      url.searchParams.set('f', optional_params.f);

    return url.toString();
  }

  /**
   * Having multiple instances of the same collection is allowed
   * @see https://docs.ogc.org/is/23-001/23-001.html#_instances
   */
  buildInstancesDownloadUrl(): string {
    if (!this.collection.data_queries?.instances) {
      throw new Error('Collection does not support instances queries');
    }
    return this.collection.data_queries.instances.link.href;
  }
}

/* -------------------------------------------------------------------------- */
/*             CSAPI Canonical Endpoint URL Builders (for tests)              */
/* -------------------------------------------------------------------------- */

/**
 * These lightweight helper functions expose canonical CSAPI Part 1 & 2 endpoints.
 * They are used by Jest test harnesses and higher-level client logic.
 */

export function getSystemsUrl(apiRoot: string): string {
  return `${apiRoot}/systems`;
}

export function getSystemByIdUrl(apiRoot: string, systemId: string): string {
  return `${apiRoot}/systems/${systemId}`;
}

export function getDeploymentsUrl(apiRoot: string): string {
  return `${apiRoot}/deployments`;
}

export function getProceduresUrl(apiRoot: string): string {
  return `${apiRoot}/procedures`;
}

export function getSamplingFeaturesUrl(apiRoot: string): string {
  return `${apiRoot}/samplingFeatures`;
}

export function getPropertiesUrl(apiRoot: string): string {
  return `${apiRoot}/properties`;
}

export function getDatastreamsUrl(apiRoot: string, systemId?: string, deploymentId?: string): string {
  if (systemId) return `${apiRoot}/systems/${systemId}/datastreams`;
  if (deploymentId) return `${apiRoot}/deployments/${deploymentId}/datastreams`;
  return `${apiRoot}/datastreams`;
}

export function getDatastreamByIdUrl(apiRoot: string, id: string): string {
  return `${apiRoot}/datastreams/${id}`;
}

export function getObservationsUrl(apiRoot: string, datastreamId?: string): string {
  return datastreamId
    ? `${apiRoot}/datastreams/${datastreamId}/observations`
    : `${apiRoot}/observations`;
}

export function getControlStreamsUrl(apiRoot: string): string {
  return `${apiRoot}/controlStreams`;
}

export function getCommandsUrl(apiRoot: string): string {
  return `${apiRoot}/commands`;
}

export function getFeasibilityUrl(apiRoot: string): string {
  return `${apiRoot}/feasibility`;
}

export function getSystemEventsUrl(apiRoot: string): string {
  return `${apiRoot.replace(/\/$/, "")}/systemEvents`;
}

export function getSystemEventsForSystemUrl(apiRoot: string, systemId: string): string {
  return `${apiRoot.replace(/\/$/, "")}/systems/${systemId}/events`;
}

/**
 * Canonical endpoint registry (Part 2 §7.4)
 */
export const CANONICAL_ENDPOINTS = [
  "systems",
  "deployments",
  "procedures",
  "samplingFeatures",
  "properties",
  "datastreams",
  "observations",
  "controlStreams",
  "commands",
  "feasibility",
  "systemEvents",
];
