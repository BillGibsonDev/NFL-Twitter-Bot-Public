import {TwitterApi} from "twitter-api-v2";
import dotenv from 'dotenv';

dotenv.config();

const client = new TwitterApi({ 
  accessToken: `${process.env.NODE_ENV_TWITTER_ACCESS_TOKEN}`
});

export const rwClient = client.readWrite