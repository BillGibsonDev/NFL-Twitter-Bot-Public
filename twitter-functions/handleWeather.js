import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// functions
import { tweet } from "./tweet.js";
import { handleErrorLog } from "./handleLog.js";

let attempts = 20;

let agent = "";
// creates a random string as to use as a user agent to prevent api from timing out access
const generateUserAgent = () => {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 21; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  agent = result;
};

// calls the weather api with the sports data it receives from handleGames
export const handleWeather = async (lat, lon, data) => {
  try {
    generateUserAgent();
    // calls the api with lat and lon which converts it to the NWS grid point system and returns new endpoint
    await axios.get(`${process.env.NODE_ENV_WEATHER_API}/${lat},${lon}`, {
      headers: {
        "User-Agent": agent,
      },
    })
    .then((response) => {
      generateUserAgent();
      axios.get(`${response.data.properties.forecast}`, {
        headers: {
          "User-Agent": agent,
        },
      })
      .then((res) => {
        // filters the data to find the date of the game
        let gameDayData = res.data.properties.periods.filter((weather) => weather.startTime.slice(0, 10) === data.DateTime.slice(0, 10));
        if (!gameDayData) {
          handleErrorLog(gameDayData);
        } else if (data.DateTime.slice(11, 13) < 17) {
          // if the game is during the day before 5pm aka 17:00, uses the day forecast
          tweet(data, gameDayData[0]);
        } else if (gameDayData.length < 2){
          // if the bot runs at a later time, it will only return the night forecast
          tweet(data, gameDayData[0]);
        } else {
          // if the game is at night, it will be the 2nd forecast
          tweet(data, gameDayData[1]);
        }
      })
      .catch((err) => {
        handleErrorLog(`Forecast Error ${err.response.status} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
        if(err.response.status === 500 || 503){
            if(attempts > 0){
              attempts--;
              setTimeout(() => {
                handleWeather(lat, lon, data);
              }, 1000 * 60);
            } else {
              handleErrorLog(`Attempts Exceeded - Forecast Error ${err.response.status} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
            }
          }
        })
      })
    .catch((err) => {
      console.log(err)
      handleErrorLog(`Grid Point Error ${err.response.status} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
      if(err.response.status === 500 || 503){
        setTimeout(() => {
          handleWeather(lat, lon, data);
        }, 1000 * 60);
      }
    })
  } catch (err) {
    console.log(err);
    handleErrorLog(err);
  }
};
