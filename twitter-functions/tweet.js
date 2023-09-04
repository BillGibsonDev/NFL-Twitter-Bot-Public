// functions
import { handleErrorLog, handleTweetLog } from './handleLog.js';
import { rwClient } from './twitterClient.js';

// data
import { TeamNames } from '../TeamNames.js';

const handleHourlyFormat = (hourly) => {
  let string = '';
  hourly.forEach((hour) => {
    let time;
    const dataHour = Number(hour.startTime.slice(11, 13));

    if (dataHour >= 12) {
      if (dataHour === 12) {
        time = `12:${hour.startTime.slice(14, 16)} pm EST`;
      } else {
        time = `${dataHour - 12}:${hour.startTime.slice(14, 16)} pm EST`;
      }
    } else {
      time = `${dataHour}:${hour.startTime.slice(14, 16)} am EST`;
    }

    string += `
<-- ${time} -->
${hour.temperature} F
${hour.windSpeed} ${hour.windDirection}
${hour.shortForecast}\n`;
  });
  return string;
};

export const tweet = async (data, gameDayWeather, hourlyWeather) => {
  if(!gameDayWeather){
    handleErrorLog(`No forecast available yet ${data.AwayTeam} at ${data.HomeTeam}`);
    return;
  }

  let hourly = '';
  if(hourlyWeather && hourlyWeather.length > 0){
    hourly = `\n\n** Hourly Forecast **\n${handleHourlyFormat(hourlyWeather)}`;
  } 
  
  let stadiumType;
  if (data.StadiumDetails.Type === 'RetractableDome') {
    stadiumType = 'Retractable Dome';
  } else {
    stadiumType = data.StadiumDetails.Type;
  }
  
    let time;
    const dataHour = Number(data.DateTime.slice(11, 13));

    if (dataHour >= 12) {
      if (dataHour === 12) {
        time = `12:${data.DateTime.slice(14, 16)} pm EST`;
      } else {
        time = `${dataHour - 12}:${data.DateTime.slice(14, 16)} pm EST`;
      }
    } else {
      time = `${dataHour}:${data.DateTime.slice(14, 16)} am EST`;
    }

  // handles team name for hashtags
  let awayTeam = TeamNames.find(team => team.id === data.AwayTeam);
  let homeTeam = TeamNames.find(team => team.id === data.HomeTeam);

  const weekday = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  let d = new Date(data.Day);
  let day = weekday[d.getDay()];

  let channel;
  if(!data.Channel){
    channel = 'TBA';
  } else {
    channel = data.Channel;
  }

  let tweetText = `<---- #${awayTeam.name} at #${homeTeam.name} ---->
${day} ${time} on ${channel}
  
${data.StadiumDetails.Name} - ${data.StadiumDetails.City}, ${data.StadiumDetails.State}
Type: ${stadiumType}
Surface: ${data.StadiumDetails.PlayingSurface}

** Game Day Forecast ** 
${gameDayWeather.detailedForecast}${hourly}`;
  try {
    // await rwClient.v2.tweet(tweetText);
    // let message = `Success - Tweet ${awayTeam.name} vs ${homeTeam.name} @ ${new Date}`;
    handleTweetLog(tweetText);
  } catch (error) {
    handleErrorLog(error);
  }
}