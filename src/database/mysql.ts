import * as mysql from 'mysql2';

import { IDBConnectionConfig, IDBConnection } from '../models/database.models';

export class MySql {
    public static createConnection({
        host,
        port,
        user,
        password,
        database,
        charset,
        timezone,
    }: IDBConnectionConfig): IDBConnection {
        return mysql.createConnection({
            host: host || 'localhost',
            port: port || 3306,
            user: user || 'root',
            password: password || '',
            database: database || 'root',
            charset: charset || 'utf8mb4',
            timezone: timezone || 'local',
        });
    }
}
