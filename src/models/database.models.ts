export enum DBTables {
    Users = 'users',
    UsersEntries = 'users_entries',
    AccountImages = 'account_images',
    Themes = 'themes',
    Languages = 'languages',
}

export interface IDBConnectionConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    charset?: string;
    timezone?: string;
}

export interface IDBConnection {
    query: <T>(
        queryString: string,
        params: NumberOrString[],
        callback: QueryCallback<T>,
    ) => void;
}

export type NumberOrString = number | string;

export type QueryCallback<T> = (error: Error, results: T, info: any) => void;
