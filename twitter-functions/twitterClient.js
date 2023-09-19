import { TwitterApi } from "twitter-api-v2";
import dotenv from 'dotenv';

dotenv.config();

const client = new TwitterApi({ 
  appKey: `${process.env.NODE_ENV_TWITTER_API_KEY}`,
  appSecret: `${process.env.NODE_ENV_TWITTER_API_SECRET}`,
  accessToken: `${process.env.NODE_ENV_TWITTER_ACCESS_TOKEN}`,
  accessSecret: `${process.env.NODE_ENV_TWITTER_ACCESS_SECRET}`,
});

export const rwClient = client.readWrite