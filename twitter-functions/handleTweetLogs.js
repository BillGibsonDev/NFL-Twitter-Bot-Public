import fs from 'fs';

export const handleTweetLog = (log) => {
  const statuses = ['InProgress', 'Final', 'F/OT', 'Postponed' ];
  let message;

  if(statuses.find(log)){
    message = `\n${log} @ ${new Date()}`;
  } else {
    message = `\n${log}`
  }
  fs.appendFile(`tweets.txt`, message, function (err) {
    if (err) console.log(err);
  });
}