import { Collection, Db, ObjectId } from 'mongodb';
import { DbConnection } from '../services';
import { User, UserRoleType } from '../interfaces';
import { _, logger } from '../utils'
/**
 * A generic service class responsible for managing CRUD operations 
 * for a specific MongoDB collection, defined at instantiation. 
 * Defaults to 'users' if no collection name is provided.
 */
class UserService {
    private readonly collectionName: string;

    /**
     * Constructor to initialize the service with a specific collection name.
     * @param collectionName The name of the MongoDB collection to operate on (default is 'users').
     */
    constructor(collectionName: string = 'users') {
        this.collectionName = collectionName;
    }

    /**
     * Retrieves the specified MongoDB Collection instance.
     * Uses the DbConnection singleton to ensure an open connection.
     * @returns A promise that resolves to the MongoDB Collection object.
     */
    private async getCollection(): Promise<Collection<User>> {
        // Get the singleton connection instance and open it
        const db: Db = await DbConnection.getInstance().openConnection();

        // Return the collection using the instance property
        return db.collection<User>(this.collectionName);
    }

    /**
     * Creates a new user document in the database.
     * @param userData User data fields, excluding the auto-generated _id.
     * @returns A promise that resolves to the complete User object including the new _id.
     */
    public async createUser(userData?: Omit<User, '_id'>, userRole?: UserRoleType): Promise<User> {
        try {
            const docToInsert: Omit<User, '_id'> = userData 
            ? userData 
            : _.getRandomUser(userRole || 'standard_user' as UserRoleType);

        const collection = await this.getCollection();
        const result = await collection.insertOne(docToInsert as User);
        logger.info(`[createUser]: user created: ${result.insertedId}`)

        return {
            _id: result.insertedId,
            ...docToInsert 
        } as User;
        } catch (error) {
            throw new Error(`[createUser]: ${error}`)
        }
    }

    /**
     * Finds and returns a single user document based on specified query criteria.
     * @param query The search criterion (e.g., { username: 'test_user' }).
     * @returns A promise that resolves to a User object or null if no user is found.
     */
    public async findUser(query: Partial<User>): Promise<User | null> {
        try {
            const collection = await this.getCollection();
            const user = await collection.findOne(query);
            return user;
        } catch (error) {
            throw new Error(`[findUser]: failed to find user:${query}\n${error}`)
        }
    }

    /**
     * Deletes a user document by its MongoDB identifier (_id).
     * @param userId The ObjectId of the user document to be deleted.
     * @returns A promise that resolves to a boolean: true if exactly one document was deleted.
     */
    public async deleteUser(userId: ObjectId): Promise<boolean> {
        try {
            const collection = await this.getCollection();
            const result = await collection.deleteOne({ _id: userId } as any);
            return result.deletedCount === 1;
        } catch (error) {
            throw new Error(`[deleteUser]: failed to deleted user:${userId}\n${error}`)
        }
    }
}

export const userService = new UserService
