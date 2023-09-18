import dotenv from "dotenv";
import axios from "axios";

// functions
import { handleErrorLog } from "./handleLog.js";
import { handleWeather } from "./handleWeather.js";

dotenv.config();

let attempts = 20;

const handleTimeSort = (arr) => {
  arr.sort((a, b) => {
    let timeA = new Date(`${a.Date}`);
    let timeB = new Date(`${b.Date}`);
    return timeA - timeB;
  })
  return arr;
}

const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];

const gameDayCheck = (data) => {
  const today = new Date();
  const formattedToday = today.toDateString();
  const filteredGames = [];

  data.forEach((game) => {
    const gameDate = new Date(game.DateTime);
    const formattedGameDate = gameDate.toDateString();
    if(formattedToday === formattedGameDate){
      if(!statuses.includes(game.Status)){
        filteredGames.push(game);
      }
    }
  })
  return filteredGames;
}

export const handleTwitterGames = async () => {
  try {
    const response = await axios.get(`${process.env.NODE_ENV_SPORTS_API}`);
    const data = handleTimeSort(response.data);
    const filteredData = gameDayCheck(data);
    for (let i = 0; i < filteredData.length; i++) {
      setTimeout(() => {
        handleWeather(filteredData[i].StadiumDetails.GeoLat, filteredData[i].StadiumDetails.GeoLong, filteredData[i]);
      }, 1000 * 60 * .25 * i);
    }
  } catch (error) {
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleTwitterGames();
      }, 1000 * 60 * 5);
    } else {
      handleErrorLog(`Attempts Exceeded - Game API Error ${error.response.status} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
    }
  }
};