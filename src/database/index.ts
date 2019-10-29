import * as dotenv from 'dotenv';

import { MySql } from './mysql';
import { IDBConnectionConfig, IDBConnection, QueryCallback, NumberOrString } from '../models/database.models';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const dbConnectionConfig: IDBConnectionConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

export class Database {
    private static instance: Database;

    private connection: IDBConnection;

    private constructor() {
        this.connection = MySql.createConnection(dbConnectionConfig);
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public query<T>(
        queryString: string,
        params: NumberOrString[],
        callback: QueryCallback<T>,
    ): void {
        return this.connection.query(queryString, params, callback);
    }
}
