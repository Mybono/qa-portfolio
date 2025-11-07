import { MongoClient, Db } from "mongodb";
import { logger } from "../utils";

/**
 * Singleton class to manage the single connection instance to MongoDB.
 * Ensures the connection is opened only once and can be reused across the application.
 */
export class DbConnection {
    private static instance: DbConnection;
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private isConnected = false;

    /**
     * Gets the single instance of DbConnection.
     * @returns The singleton instance of DbConnection.
     */
    public static getInstance(): DbConnection {
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection();
        }
        return DbConnection.instance;
    }

    /**
     * Opens the connection to MongoDB using the MONGO_CONNECTION_STRING from env.
     * If a connection is already open, it returns the existing Db object.
     * @returns A promise that resolves to the MongoDB Db object.
     */
    public async openConnection(MONGO_CONNECTION_STRING: string): Promise<Db> {
        if (this.isConnected && this.db) {
            return this.db;
        }

        this.client = new MongoClient(MONGO_CONNECTION_STRING);
        await this.client.connect();

        this.db = this.client.db(); 
        this.isConnected = true;
        logger.info("[openConnection] Connected successfully");
        return this.db;
    }

    /**
     * Closes the connection to MongoDB.
     * @returns A promise that resolves when the connection is closed.
     */
    public async closeConnection(): Promise<void> {
        if (this.client && this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            this.client = null;
            this.db = null;
            logger.warn("[closeConnection]: Connection closed");
        }
    }
}
