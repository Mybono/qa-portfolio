import { User, UserRole, UserRoleType, collections } from '../interfaces';
import { MongoService } from '../services';
import { Db, ObjectId } from 'mongodb';
import { _, logger } from '../utils';

/**
 * A generic service class responsible for managing CRUD operations 
 * for a specific MongoDB collection, defined at instantiation. 
 * Defaults to 'users' if no collection name is provided.
 */
export class UserService {
    private mongoService: MongoService<User>;

    constructor(db: Db, private collectionName = collections.users) {
        const collection = db.collection<User>(collectionName);
        this.mongoService = new MongoService<User>(collection);
    }

    public async createUser(userRole?: UserRoleType, userData?: Omit<User, '_id'>): Promise<User> {
        try {
            const doc = userData || _.getRandomUser(userRole || UserRole.standard_user);
            const inserted = await this.mongoService.insertOne(doc);
            logger.info(`[UserService] Created user ${inserted._id}`);
            return inserted;
        } catch (error) {
            throw new Error(`[createUser]: ${error}`)
        }
    }

    public async findUser(query: Partial<User>): Promise<User | null> {
        try {
            return this.mongoService.findOne(query);
        } catch (error) {
            throw new Error(`[findUser]: failed to find user:${query}\n${error}`)
        }
    }

    public async deleteUser(userId: ObjectId): Promise<boolean> {
        try {
            return this.mongoService.deleteOne(userId);
        } catch (error) {
            throw new Error(`[deleteUser]: failed to deleted user:${userId}\n${error}`)
        }
    }
}
