import OpenAI from "openai";
import {OPENAI_KEY} from "./constants.js";

const openAI = new OpenAI({
  apiKey: OPENAI_KEY,
  dangerouslyAllowBroswser: true,
});

export default openAI;
