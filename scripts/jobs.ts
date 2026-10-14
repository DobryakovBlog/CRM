// Run every few minutes from cron: sends reminders and review requests.
import { db } from "@/db";
import { runNotificationJobs } from "@/server/notify";

const result = await runNotificationJobs(db);
console.log(result);
process.exit(0);
