import { CrsCode } from '../../shared/models.js';
import {
  DataQueryType,
  CsapiParameterInfo,
  OgcApiCollectionInfo,
  optionalFeatureParams,
  optionalDynamicParams,
  WellKnownTextString,
  zParameterToString,
} from './model.js';
import { DateTimeParameterToCSAPIString } from './helpers.js';

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
      throw new Error(
        `Collection '${collection.id ?? 'unknown'}' has no data queries; cannot issue CSAPI queries.`
      );
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
      if (value) queries.add(key as DataQueryType);
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
      throw new Error(`Collection '${this.collection.id}' does not support feature queries.`);
    }

    const url = new URL(this.collection.data_queries.feature.link.href);
    url.searchParams.set('coords', coords);

    if (optional_params.z !== undefined)
      url.searchParams.set('z', zParameterToString(optional_params.z));

    if (optional_params.datetime !== undefined)
      url.searchParams.set(
        'datetime',
        DateTimeParameterToCSAPIString(optional_params.datetime)
      );

    if (optional_params.parameter_name) {
      for (const param of optional_params.parameter_name) {
        if (!this.supported_parameters[param]) {
          throw new Error(
            `Parameter '${param}' is not supported by collection '${this.collection.id}'.`
          );
        }
      }
      url.searchParams.set('parameter-name', optional_params.parameter_name.join(','));
    }

    if (optional_params.crs !== undefined) {
      if (!this.supported_crs.includes(optional_params.crs)) {
        throw new Error(
          `CRS '${optional_params.crs}' is not supported by collection '${this.collection.id}'.`
        );
      }
      url.searchParams.set('crs', optional_params.crs);
    }

    if (optional_params.f !== undefined) url.searchParams.set('f', optional_params.f);

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
      throw new Error(`Collection '${this.collection.id}' does not support dynamic queries.`);
    }

    const url = new URL(this.collection.data_queries.dynamic.link.href);
    url.searchParams.set('coords', coords);

    if (optional_params.z !== undefined)
      url.searchParams.set('z', zParameterToString(optional_params.z));

    if (optional_params.datetime !== undefined)
      url.searchParams.set(
        'datetime',
        DateTimeParameterToCSAPIString(optional_params.datetime)
      );

    if (optional_params.parameter_name) {
      for (const param of optional_params.parameter_name) {
        if (!this.supported_parameters[param]) {
          throw new Error(
            `Parameter '${param}' is not supported by collection '${this.collection.id}'.`
          );
        }
      }
      url.searchParams.set('parameter-name', optional_params.parameter_name.join(','));
    }

    if (optional_params.crs !== undefined) {
      if (!this.supported_crs.includes(optional_params.crs)) {
        throw new Error(
          `CRS '${optional_params.crs}' is not supported by collection '${this.collection.id}'.`
        );
      }
      url.searchParams.set('crs', optional_params.crs);
    }

    if (optional_params.f !== undefined) url.searchParams.set('f', optional_params.f);

    return url.toString();
  }

  /**
   * Build a query URL for multiple instances of the same collection
   * @see https://docs.ogc.org/is/23-001/23-001.html#_instances
   */
  buildInstancesDownloadUrl(): string {
    if (!this.collection.data_queries.instances) {
      throw new Error(`Collection '${this.collection.id}' does not support instances queries.`);
    }
    return this.collection.data_queries.instances.link.href;
  }
}
