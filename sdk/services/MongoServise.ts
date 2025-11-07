import { Collection, ObjectId, Filter, UpdateFilter, WithId, OptionalUnlessRequiredId } from 'mongodb';

export class MongoService<T extends { _id?: ObjectId }> {
    constructor(private readonly collection: Collection<T>) { }

    async findOne(query: Partial<T>): Promise<WithId<T> | null> {
        return this.collection.findOne(query as Filter<T>);
    }

    async insertOne(doc: Omit<T, '_id'>): Promise<WithId<T>> {
        const result = await this.collection.insertOne(doc as OptionalUnlessRequiredId<T>);
        return { _id: result.insertedId, ...doc } as WithId<T>;
    }

    async updateOne(id: ObjectId, update: Partial<T>): Promise<WithId<T> | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: id } as Filter<T>,
            { $set: update } as unknown as UpdateFilter<T>,
            { returnDocument: 'after' }
        );
        return (result as unknown as { value: WithId<T> | null }).value ?? null;
    }

    async deleteOne(id: ObjectId): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: id } as Filter<T>);
        return result.deletedCount === 1;
    }
}
