import { execSync } from "node:child_process";
import { sql } from "drizzle-orm";

import { db } from "./connection.js";
import { users, userProfiles } from "./schema.js";

// ======================================================
// Sample data
// ======================================================

// Five demo users
const demoUsers = [
  { username: "alice", email: "alice@example.com" },
  { username: "ben", email: "ben@example.com" },
  { username: "charlie", email: "charlie@example.com" },
  { username: "diana", email: "diana@example.com" },
  { username: "ethan", email: "ethan@example.com" }
];

// Five demo profiles
// Each profile corresponds to a user at the same index
// in the demoUsers array.
const demoProfiles = [
  {
    firstName: "Alice",
    lastName: "Tan",
    bio: "Enjoys web development and UI design."
  },
  {
    firstName: "Ben",
    lastName: "Lim",
    bio: "Interested in cybersecurity and networking."
  },
  {
    firstName: "Charlie",
    lastName: "Wong",
    bio: "Enjoys coding games and mobile applications."
  },
  {
    firstName: "Diana",
    lastName: "Lee",
    bio: "Interested in artificial intelligence."
  },
  {
    firstName: "Ethan",
    lastName: "Goh",
    bio: "Enjoys working with databases and APIs."
  }
];

// ======================================================
// Seeding process
// ======================================================

console.log("Creating tables from schema...");

async function seed() {
  try {
    console.log("Dropping existing tables...");

    // DROP TABLE removes all data and resets
    // the AUTOINCREMENT counter.
    //
    // Drop child tables before parent tables
    // because they contain foreign keys to users.
    await db.run(sql`DROP TABLE IF EXISTS user_profiles`);
    await db.run(sql`DROP TABLE IF EXISTS users`);

    console.log("Recreating tables from schema...");

    // Drizzle Kit recreates tables based on schema.js
    execSync("npx drizzle-kit push", {
      stdio: "inherit"
    });

    console.log("Inserting sample data...");

    // Insert users first, because profiles need user IDs.
    // SQLite RETURNING gives us the generated IDs.
    const insertedUsers = await db
      .insert(users)
      .values(demoUsers)
      .returning();

    // Prepare profiles with the actual user IDs.
    // The index links each profile to its corresponding user.
    const profilesToInsert = demoProfiles.map(
      (profile, index) => ({
        userId: insertedUsers[index].id,
        ...profile
      })
    );

    // Insert all five profiles.
    const insertedProfiles = await db
      .insert(userProfiles)
      .values(profilesToInsert)
      .returning();

    // ==================================================
    // Summary
    // ==================================================

    console.log("\n==================================");
    console.log("       SEEDING SUMMARY");
    console.log("==================================");

    console.log(`Users created: ${insertedUsers.length}`);
    console.log(`Profiles created: ${insertedProfiles.length}`);

    console.log("\nCreated Users and Profiles:");

    console.table(
      insertedUsers.map((user, index) => ({
        UserID: user.id,
        Username: user.username,
        Email: user.email,
        ProfileID: insertedProfiles[index].id,
        FirstName: insertedProfiles[index].firstName,
        LastName: insertedProfiles[index].lastName
      }))
    );

    console.log("\nSeeding completed successfully!");

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  }
}

await seed();