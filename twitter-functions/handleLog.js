import fs from 'fs';

const handleDates = () => {
  let date = new Date();
  let dateString = date.toDateString();
  let removedSpaces = dateString.replace(/ /g, "");
  let removedYear = removedSpaces.replace(/2023/, "");

  return removedYear;
}

export const handleErrorLog = (log) => {
  let message = `\n${log} @ ${new Date}\n`;
  fs.appendFile(`./tweet-logs/Errors-${handleDates()}-logs.txt`, message, function (err) {
    if (err) console.log(err);
  });
}

export const handleTweetLog = (log) => {
  const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];
  let message;

  if(statuses.includes(log.Status)){
    message = `\n${log.Status} - ${log.AwayTeam} vs ${log.HomeTeam} @ ${new Date()}\n`;
  } else {
    message = `\n${log}\n`;
  }
  fs.appendFile(`./tweet-logs/${handleDates()}-logs.txt`, message, function (err) {
    if (err) console.log(err);
  });
}