import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import { Report } from '../models/Chat';

export class ReportService {
  private static COLLECTION = 'reports';

  static async createReport(
    userId: string,
    chatSessionId: string,
    title: string,
    content: string,
    format: Report['format'] = 'markdown'
  ): Promise<Report> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    // Calculate metadata
    const wordCount = content.split(/\s+/).length;
    const referenceMatches = content.match(/\[\d+\]/g);
    const referenceCount = referenceMatches ? new Set(referenceMatches).size : 0;
    const sections = content.match(/^##\s+(.+)$/gm) || [];

    const report: Report = {
      userId: new ObjectId(userId),
      chatSessionId: new ObjectId(chatSessionId),
      title,
      content,
      format,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      tags: [],
      metadata: {
        wordCount,
        referenceCount,
        sections: sections.map(s => s.replace(/^##\s+/, '')),
      },
      exports: [],
    };

    const result = await reportsCollection.insertOne(report);
    report._id = result.insertedId;

    return report;
  }

  static async getReport(reportId: string, userId: string): Promise<Report | null> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    return reportsCollection.findOne({
      _id: new ObjectId(reportId),
      userId: new ObjectId(userId),
    });
  }

  static async getUserReports(userId: string): Promise<Report[]> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    return reportsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  static async getChatReports(chatSessionId: string, userId: string): Promise<Report[]> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    return reportsCollection
      .find({
        chatSessionId: new ObjectId(chatSessionId),
        userId: new ObjectId(userId),
      })
      .sort({ version: -1 })
      .toArray();
  }

  static async updateReport(
    reportId: string,
    userId: string,
    content: string,
    incrementVersion = true
  ): Promise<Report | null> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    // Calculate new metadata
    const wordCount = content.split(/\s+/).length;
    const referenceMatches = content.match(/\[\d+\]/g);
    const referenceCount = referenceMatches ? new Set(referenceMatches).size : 0;
    const sections = content.match(/^##\s+(.+)$/gm) || [];

    const updateData: any = {
      content,
      updatedAt: new Date(),
      'metadata.wordCount': wordCount,
      'metadata.referenceCount': referenceCount,
      'metadata.sections': sections.map(s => s.replace(/^##\s+/, '')),
    };

    if (incrementVersion) {
      updateData.$inc = { version: 1 };
    }

    const result = await reportsCollection.findOneAndUpdate(
      { _id: new ObjectId(reportId), userId: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  static async deleteReport(reportId: string, userId: string): Promise<boolean> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    const result = await reportsCollection.deleteOne({
      _id: new ObjectId(reportId),
      userId: new ObjectId(userId),
    });

    return result.deletedCount > 0;
  }

  static async addExport(
    reportId: string,
    userId: string,
    format: 'pdf' | 'html' | 'markdown',
    url?: string
  ): Promise<boolean> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    const result = await reportsCollection.updateOne(
      { _id: new ObjectId(reportId), userId: new ObjectId(userId) },
      {
        $push: {
          exports: {
            format,
            url,
            generatedAt: new Date(),
          },
        },
      }
    );

    return result.modifiedCount > 0;
  }

  static async searchReports(userId: string, query: string): Promise<Report[]> {
    const db = await getDatabase();
    const reportsCollection = db.collection<Report>(this.COLLECTION);

    return reportsCollection
      .find({
        userId: new ObjectId(userId),
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .sort({ updatedAt: -1 })
      .toArray();
  }
}
