import dotenv from "dotenv";
import axios from "axios";

// functions
import { handleErrorLog, handleTweetLog } from "./handleLog.js";
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

  // const sortDataByDate = (data) => {
  //   const groupedData = {};
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   data.forEach(game => {
  //     let gameDate = game.DateTime;
  //     let slicedGameDate = gameDate.slice(0,13);

  //     gameDate.setHours(0, 0, 0, 0);

  //     let gameDateString = gameDate.toLocaleDateString();

  //     if (today.getTime() === gameDate.getTime()) {
  //       gameDateString = 'Today';
  //     }

  //     if (!groupedData[slicedGameDate]) {
  //       groupedData[slicedGameDate] = {
  //         date: slicedGameDate,
  //         games: []
  //       };
  //     }
      
  //     groupedData[slicedGameDate].games.push(game);
  //   });

  //   const groupedArray = Object.values(groupedData);
  //   return groupedArray;
  // };

const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];

export const handleTwitterGames = async () => {
  try {
    const response = await axios.get(`${process.env.NODE_ENV_SPORTS_API}`);
    const data = handleTimeSort(response.data);
    for (let i = 0; i < data.length; i++) {
      setTimeout(() => {
        if (statuses.includes(data[i].Status)) {
          handleTweetLog(data[i]);
        } else {
          handleWeather(data[i].StadiumDetails.GeoLat, data[i].StadiumDetails.GeoLong, data[i]);
        }
      }, 1000 * 60 * 2 * i);
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