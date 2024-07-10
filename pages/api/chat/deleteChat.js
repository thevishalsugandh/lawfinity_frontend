import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);

    const { chatId } = req.body;

    let objectId;

    try {
      objectId = new ObjectId(chatId);
    } catch (e) {
      res.status(422).json({
        message: "Invalid chat ID",
      });
      return;
    }

    // Delete the document based on the chatId and userId fields
    const result = await db
      .collection(process.env.COLLECTION_NAME)
      .deleteOne({ _id: objectId, userId: user.sub });

    console.log(`${result.deletedCount} document deleted`);
    res
      .status(200)
      .json({ message: `${result.deletedCount} document deleted` });
  } catch (err) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
