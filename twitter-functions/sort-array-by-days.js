import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

let attempts = 20;

// functions
import { handleErrorLog, handleTweetLog } from "./handleLog.js";
import { handleWeather } from "./handleWeather.js";

const handleTimeSort = (arr) => {
  arr.sort((a, b) => {
    let timeA = new Date(`${a.Date}`);
    let timeB = new Date(`${b.Date}`);
    return timeA - timeB;
  })
  return arr;
}

const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];
const weekday = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];


// initial API call to get the game schedule
export const handleTwitterGames = async () => {
  try {
    await axios.get(`${process.env.NODE_ENV_SPORTS_API}`)
      .then((response) => {
        const data = handleTimeSort(response.data);
        const groupedData = {};

        data.forEach(game => {
            const gameDate = new Date(game.Date).toISOString().split("T")[0];
            
            if (!groupedData[gameDate]) {
              groupedData[gameDate] = [];
            }
            
            groupedData[gameDate].push(game);
        });
        console.log(data)
        console.log(groupedData)
        return groupedData;
    })
  } catch (err) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleTwitterGames();
      }, 1000 * 60 * 5);
    } else {
      console.log(err);
      handleErrorLog(`Attempts Exceeded - Game API Error ${err.response.status} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
    }
  }
};