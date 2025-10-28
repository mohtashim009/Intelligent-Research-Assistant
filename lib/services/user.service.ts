import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { User } from '../models/User';
import { hashPassword, verifyPassword } from '../auth/password';

export class UserService {
  private static COLLECTION = 'users';

  static async createUser(email: string, password: string, name: string): Promise<User> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>(this.COLLECTION);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user: User = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'system',
        defaultExportFormat: 'pdf',
      },
    };

    const result = await usersCollection.insertOne(user);
    user._id = result.insertedId;

    return user;
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>(this.COLLECTION);

    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return null;
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    );

    return user;
  }

  static async getUserById(userId: string): Promise<User | null> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>(this.COLLECTION);

    return usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>(this.COLLECTION);

    return usersCollection.findOne({ email: email.toLowerCase() });
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>(this.COLLECTION);

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>(this.COLLECTION);

    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }
}
