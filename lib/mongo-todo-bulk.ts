import { MongoClient, ObjectId } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

function getClient(): MongoClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (globalForMongo.mongoClient) return globalForMongo.mongoClient;
  const client = new MongoClient(url);
  if (process.env.NODE_ENV !== "production")
    globalForMongo.mongoClient = client;
  return client;
}

export type TodoUpsertDoc = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
  labelId?: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Single bulk write: upsert many todos for one user. Uses MongoDB bulkWrite (one round-trip).
 */
export async function bulkUpsertTodos(
  userId: string,
  items: TodoUpsertDoc[],
): Promise<void> {
  if (items.length === 0) return;

  const client = getClient();
  const db = client.db();
  const userIdObj = new ObjectId(userId);
  const collection = db.collection<{
    _id: string;
    userId: ObjectId;
    title: string;
    completed: boolean;
    dueDate: Date | null;
    labelId: ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
  }>("Todo");

  // Match by _id and userId (accept both string and ObjectId for existing docs)
  const ops = items.map((item) => ({
    updateOne: {
      filter: {
        _id: item.id,
        $or: [{ userId: userIdObj }, { userId }],
      },
      update: {
        $set: {
          title: item.title,
          completed: item.completed,
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
          labelId: item.labelId ? new ObjectId(item.labelId) : null,
          updatedAt: new Date(item.updatedAt),
          userId: userIdObj,
        },
        $setOnInsert: {
          _id: item.id,
          createdAt: new Date(item.createdAt),
        },
      },
      upsert: true,
    },
  }));

  await collection.bulkWrite(ops as Parameters<typeof collection.bulkWrite>[0]);
}
