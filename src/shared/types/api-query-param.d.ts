declare module 'api-query-params' {
    export interface AqpResult {
      filter: Record<string, any>;
      sort?: Record<string, 1 | -1>;
      population?: string | string[];
      projection?: any;
      skip?: number;
      limit?: number;
    }
  
    export default function aqp(query: string): AqpResult;
  }
  