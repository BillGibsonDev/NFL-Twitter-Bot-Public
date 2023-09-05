import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// functions
import { tweet } from "./tweet.js";
import { handleErrorLog } from "./handleLog.js";
import { handleForecastData } from "./handleForecastData.js";
import { generateUserAgent } from "./generateUserAgent.js";

let attempts = 20;

export const handleWeather = async (lat, lon, data) => {
  if(!lat || !lon ){
    handleErrorLog(`Data Error`);
    return;
  }
  try {
    const response = await axios.get(`${process.env.NODE_ENV_WEATHER_API}/${lat},${lon}`, {
      headers: {
        "User-Agent": generateUserAgent(),
      }
    })
      const hourlyForecastURL = response.data.properties.forecastHourly;
      const dailyForecastURL = response.data.properties.forecast;
      const forecasts = await handleForecastData(dailyForecastURL, hourlyForecastURL, data);

      const handleHourlyFormat = (hourly) => {
        let string = '';
        hourly.forEach((hour, index) => {

          const weatherStartTimeEDT = new Date(hour.startTime).toLocaleString('en-US', { timeZone: 'America/New_York' });
          const weatherTime = weatherStartTimeEDT; 
          const splitWeatherTime = weatherTime.split(' ');
          const weatherHourAndAbbreviation = splitWeatherTime[1].split(':');
          let time =  `\n<-- ${weatherHourAndAbbreviation[0]}:${weatherHourAndAbbreviation[1]} ${splitWeatherTime[2]} -->`;
          if(index === 0){
            time = `<-- ${weatherHourAndAbbreviation[0]}:${weatherHourAndAbbreviation[1]} ${splitWeatherTime[2]} -->`;
          }

          string += `
      ${time}
      ${hour.temperature} F
      ${hour.windSpeed} ${hour.windDirection}
      ${hour.shortForecast}`;
      });
      return string;
    };

    let hourly = '';
    if(forecasts && forecasts.hourly.length === 3){
      hourly = `\n** Hourly Forecast in EST **${handleHourlyFormat(forecasts.hourly)}`;
    }

    let day = '';
    if(forecasts){
      day = `\n** Game Day Forecast ** \n${forecasts.day.detailedForecast}`;
    }
    
    return `${day}\n${hourly}`
      // tweet(data, forecasts.day, forecasts.hourly);
    }
  catch(error) {
    console.log(error);
    if(attempts > 0){
      attempts--;
      setTimeout(() => {
        handleWeather(lat, lon, data);
      }, 1000 * 60);
    } else {
      handleErrorLog(`Forecast Error ${error} on game ${data.AwayTeam} vs ${data.HomeTeam}`);
    }
  }
};