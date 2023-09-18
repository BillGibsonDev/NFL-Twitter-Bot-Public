import { CronJob } from "cron";
import mongoose from "mongoose";
import dotenv from "dotenv";

// functions
// import { handleDatabaseGames } from "./database-functions/controllers/GamesController.js";
import { handleTwitterGames } from "./twitter-functions/main.js";

dotenv.config();

// mongoose.connect(process.env.NODE_ENV_MONGO_KEY, {
//   useNewUrlParser: true,
// });

// const databaseJob = new CronJob("55 * * * *", () => {
//   handleDatabaseGames();
//   console.log('database job started');
// },
//   null,
//   true,
//   'America/New_York'
// );

handleTwitterGames()
//handleDatabaseGames();

// const twitterJobThursday = new CronJob("30 18 * * Thu", () => {
//     handleTwitterGames();
//     console.log("Thursday job started");
//   },
//   null,
//   true,
//   "America/New_York"
// );

// const twitterJobSaturday = new CronJob("0 12 * * Sat", () => {
//     handleTwitterGames();
//     console.log("Saturday job started");
//   },
//   null,
//   true,
//   "America/New_York"
// );

// const twitterJobSunday = new CronJob("25 10 * * Sun", () => {
//     handleTwitterGames();
//     console.log("Sunday job started");
//   },
//   null,
//   true,
//   "America/New_York"
// );

// const twitterJobMonday = new CronJob("30 18 * * Mon", () => {
//     handleTwitterGames();
//     console.log("Monday job started");
//   },
//   null,
//   true,
//   "America/New_York"
// );

// twitterJobThursday.start(); // 6:30pm Thursday
// twitterJobSaturday.start(); // Noon Satuday
// twitterJobSunday.start(); // 10am Sunday
// twitterJobMonday.start(); // 6:30pm Monday