// functions
import { handleErrorLog, handleTweetLog } from './handleLog.js';
import { rwClient } from './twitterClient.js';

// data
import { TeamNames } from '../TeamNames.js';

export const tweet = async (data, gameDayWeather) => {
  // handles stadium type text
  let stadiumType;
  if (data.StadiumDetails.Type === 'RetractableDome') {
    stadiumType = 'Retractable Dome';
  } else {
    stadiumType = data.StadiumDetails.Type;
  }
  // handles time text
  let time;
  if (Number(data.DateTime.slice(11, 13)) >= 12) {
    time = `${Number(data.DateTime.slice(11, 13) - 12)}:${data.DateTime.slice(14, 16)}pm EST`;
  } else {
    time = `${Number(data.DateTime.slice(11, 13))}:${data.DateTime.slice(14, 16)}am EST`;
  }
  // handles team name for hashtags
  let awayTeam = TeamNames.find(team => team.id === data.AwayTeam);
  let homeTeam = TeamNames.find(team => team.id === data.HomeTeam);

  // converts date into day
  const weekday = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  let d = new Date(data.Day);
  let day = weekday[d.getDay()];

  let channel;
  if(!data.Channel){
    channel = 'TBA';
  } else {
    channel = data.Channel;
  }

  let tweetText = `<---- #${awayTeam.name} at #${homeTeam.name} on ${channel} ---->
${day} ${time} on ${channel}
  
${data.StadiumDetails.Name} - ${data.StadiumDetails.City}, ${data.StadiumDetails.State}
Type: ${stadiumType}
Surface: ${data.StadiumDetails.PlayingSurface}

Game Day Forecast
${gameDayWeather.detailedForecast}`;
  try {
    // await rwClient.v2.tweet(tweetText);
    // let message = `Success - Tweet ${awayTeam.name} vs ${homeTeam.name} @ ${new Date}`;
    handleTweetLog(tweetText);
  } catch (err) {
    handleErrorLog(err);
  }
}