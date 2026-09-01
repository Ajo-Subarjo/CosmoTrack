# CosmoTrack

A simple slackbot space theme build with **Node.js** and **Slack Bolt**.

## Features

* `/ct-Ping` - Check if the bot is online
* `/ct-apod` - Get NASA's Astronomy Picture of the Day
* `/ct-trackiss` - Get the current ISS position and crew information

## Tech Stack
* Node.js
* JavaScript
* Slack Bolt
* NASA APOD API
* Open Notify API

## Setup

```bash
npm install
npm start
```

Create a `.env` file:

```env
SLACK_XOXB= "your-slack-bot-token"
SLACK_XAPP= "your-slack-app-token"
NASA_API_KEY= "your-nasa-api-key"
```

## Project Structure

```text
CosmoTrack/
├── index.js
├── package.json
├── .env
└── service/
    ├── iss.js
    └── nasa_apod.js
```

## License

This project is licensed under the **MIT License**.
