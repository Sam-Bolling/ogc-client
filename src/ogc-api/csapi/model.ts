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

export interface CSAPICollection {
  id: string;
  title: string;
  description?: string;
  extent?: {
    spatial?: {
      bbox: number[][];
      crs?: string;
    };
  };
  parameter_names?: Record<string, CSAPIParameter>;
  data_queries?: Record<string, { link: { href: string; rel: string; variables?: any } }>;
}
