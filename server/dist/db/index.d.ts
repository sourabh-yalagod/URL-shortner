export declare function createTable(): Promise<void>;
export declare function checkUrlExist(shortCode: string): Promise<import("pg").QueryResult<any>>;
export declare function updateClicks(shortCode: string): Promise<void>;
export declare function findUrlByShortCode(shortCode: string): Promise<import("pg").QueryResult<any>>;
export declare function insertNewShortCode(shortCode: string, url: string): Promise<import("pg").QueryResult<any>>;
//# sourceMappingURL=index.d.ts.map