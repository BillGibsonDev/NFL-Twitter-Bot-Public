import fs from 'fs';

const handleDates = () => {
  let date = new Date();
  let day =date.getUTCDate();
  let month = date.getMonth() + 1;

  return `${month}-${day}`;
}

export const handleErrorLog = (log) => {
  let message = `\n${log} @ ${new Date}\n`;
  fs.appendFile(`${handleDates()}-logs.txt`, message, function (err) {
    if (err) console.log(err);
  });
}

export const handleTweetLog = (log) => {
  const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];
  let message;

  if(statuses.includes(log)){
    message = `\n${log} @ ${new Date()}\n`;
  } else {
    message = `\n${log}\n`
  }
  fs.appendFile(`${handleDates()}-logs.txt`, message, function (err) {
    if (err) console.log(err);
  });
}