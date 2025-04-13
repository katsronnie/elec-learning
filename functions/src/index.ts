import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";

admin.initializeApp();

export const expireSubmissionLinks = onSchedule(
  {
    schedule: "every 1 hours",
    timeZone: "Africa/Kampala", // You can use "UTC" or any valid IANA timezone
    region: "us-central1",
  },
  async () => {
    const now = admin.firestore.Timestamp.now();
    const db = admin.firestore();
    let lastVisible = null;
    let totalUpdated = 0;

    try {
      do {
        let query = db
          .collection("submissionLinks")
          .where("status", "==", "active")
          .where("closingTime", "<=", now)
          .orderBy("closingTime")
          .limit(500);

        if (lastVisible) {
          query = query.startAfter(lastVisible);
        }

        const snapshot = await query.get();
        if (snapshot.empty) {
          if (totalUpdated === 0) {
            console.log("No expired submission links found");
          }
          break;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.update(doc.ref, {status: "expired"});
        });

        await batch.commit();
        totalUpdated += snapshot.size;
        console.log(`Updated ${snapshot.size} links to expired status`);
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
      } while (lastVisible);

      console.log(`Total updated: ${totalUpdated} submission links`);
    } catch (error) {
      console.error("Error updating expired links:", error);
      throw error;
    }
  }
);
