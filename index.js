import { CronJob } from "cron";
import mongoose from "mongoose";
import dotenv from "dotenv";

// functions
import { handleDatabaseGames } from "./database-functions/controllers/GamesController.js";
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

// const twitterJob = new CronJob("06 * * * *", () => {
//     handleTwitterGames();
//     console.log("twitter job started");
//   },
//   null,
//   true,
//   "America/New_York"
// );

// // databaseJob.start();
// twitterJob.start();

// maintenance functions
// import { handleStadiumData } from "./maintenance-functions/handleStadiumData.js";

// const stadiumJob = new CronJob(
//   "02 * * * *",
//   () => {
//     handleStadiumData();
//     console.log("stadium job started");
//   },
//   null,
//   true,
//   "America/New_York"
// );

// stadiumJob.start();
