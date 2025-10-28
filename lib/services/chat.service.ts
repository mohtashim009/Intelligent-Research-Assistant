import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { ChatSession, Message } from '../models/Chat';

export class ChatService {
  private static COLLECTION = 'chat_sessions';

  static async createChatSession(userId: string, title?: string): Promise<ChatSession> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    const chatSession: ChatSession = {
      userId: new ObjectId(userId),
      title: title || 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      isArchived: false,
      tags: [],
      metadata: {
        totalMessages: 0,
        totalTokens: 0,
        researchTopics: [],
      },
    };

    const result = await chatsCollection.insertOne(chatSession);
    chatSession._id = result.insertedId;

    return chatSession;
  }

  static async getChatSession(chatId: string, userId: string): Promise<ChatSession | null> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    return chatsCollection.findOne({
      _id: new ObjectId(chatId),
      userId: new ObjectId(userId),
    });
  }

  static async getUserChatSessions(userId: string, includeArchived = false): Promise<ChatSession[]> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    const query: any = { userId: new ObjectId(userId) };
    if (!includeArchived) {
      query.isArchived = false;
    }

    return chatsCollection
      .find(query)
      .sort({ lastMessageAt: -1 })
      .toArray();
  }

  static async addMessage(chatId: string, userId: string, message: Message): Promise<boolean> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(chatId), userId: new ObjectId(userId) },
      {
        $push: { messages: message },
        $set: {
          updatedAt: new Date(),
          lastMessageAt: new Date(),
        },
        $inc: { 'metadata.totalMessages': 1 },
      }
    );

    return result.modifiedCount > 0;
  }

  static async updateChatTitle(chatId: string, userId: string, title: string): Promise<boolean> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(chatId), userId: new ObjectId(userId) },
      {
        $set: {
          title,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  }

  static async archiveChatSession(chatId: string, userId: string): Promise<boolean> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(chatId), userId: new ObjectId(userId) },
      {
        $set: {
          isArchived: true,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  }

  static async deleteChatSession(chatId: string, userId: string): Promise<boolean> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    const result = await chatsCollection.deleteOne({
      _id: new ObjectId(chatId),
      userId: new ObjectId(userId),
    });

    return result.deletedCount > 0;
  }

  static async getChatMessages(chatId: string, userId: string, limit?: number): Promise<Message[]> {
    const chat = await this.getChatSession(chatId, userId);
    if (!chat) {
      return [];
    }

    if (limit) {
      return chat.messages.slice(-limit);
    }

    return chat.messages;
  }

  static async searchChatSessions(userId: string, query: string): Promise<ChatSession[]> {
    const db = await getDatabase();
    const chatsCollection = db.collection<ChatSession>(this.COLLECTION);

    return chatsCollection
      .find({
        userId: new ObjectId(userId),
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'messages.content': { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .sort({ lastMessageAt: -1 })
      .toArray();
  }
}
