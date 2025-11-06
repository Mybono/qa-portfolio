import { MongoClient, Db } from "mongodb";
import { logger } from "../utils";
import { env } from "../config";


export class DbConnection {
  private static instance: DbConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;

  public static getInstance(): DbConnection {
    if (!DbConnection.instance) {
      DbConnection.instance = new DbConnection();
    }
    return DbConnection.instance;
  }

  public async openConnection(): Promise<Db> {
    if (this.isConnected && this.db) {
      return this.db;
    }

    this.client = new MongoClient(env.MONGO_CONNECTION_STRING);
    await this.client.connect();

    this.db = this.client.db(); 
    this.isConnected = true;
    logger.info("[openConnection] Connected successfully");
    return this.db;
  }

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
