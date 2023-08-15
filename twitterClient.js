const { TwitterApi } = require("twitter-api-v2");
require('dotenv').config()

const client = new TwitterApi({
  appKey: `${process.env.NODE_ENV_TWITTER_API_KEY}`,
  appSecret: `${process.env.NODE_ENV_TWITTER_API_SECRET}`,
  accessToken: `${process.env.NODE_ENV_TWITTER_ACCESS_TOKEN}`,
  accessSecret: `${process.env.NODE_ENV_TWITTER_ACCESS_SECRET}`
})

const rwClient = client.readWrite

module.exports = rwClient