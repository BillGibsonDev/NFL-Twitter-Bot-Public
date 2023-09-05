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

  const sortDataByDate = (data) => {
    const groupedData = {};

    data.forEach(game => {
      let gameDate = game.DateTime;
      let slicedGameDate = gameDate.slice(0,13);

      if (!groupedData[slicedGameDate]) {
        groupedData[slicedGameDate] = {
          date: gameDate,
          games: []
        };
      }
      
      groupedData[slicedGameDate].games.push(game);
    });

    const groupedArray = Object.values(groupedData);
    return groupedArray;
  };

const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];

export const handleTwitterGames = async () => {
  try {
    const response = await axios.get(`${process.env.NODE_ENV_SPORTS_API}`);
    const data = handleTimeSort(response.data);
    const groupedData = sortDataByDate(data);
    let string = '1';
    groupedData.forEach((day, index) => {
      let gamesArr = day.games;
      setTimeout(() => {
        gamesArr.forEach((game, index) => {
          console.log(game)
          console.log(index)
        //   setTimeout(() => {
        //     if (statuses.includes(game.Status)) {
        //       handleTweetLog(game);
        //     } else {
        //       string += handleWeather(game.StadiumDetails.GeoLat, game.StadiumDetails.GeoLong, game);
        //     }
        //   }, 1000 * 60 * 1 * index);
        })
      }, 1000 * 60 * 1 * index)
    })
    console.log(string);
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