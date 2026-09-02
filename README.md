# CosmoTrack

A simple slackbot space theme build with **Node.js** and **Slack Bolt**.

## Features

* `/ct-Ping` - Check if the bot is online
* `/ct-apod` - Get NASA's Astronomy Picture of the Day
* `/ct-trackiss` - Get the current ISS position and crew information


### add your to Workspace
Click the button below to add CosmoTrack to your Slack workspace:

[![Add to Slack](https://platform.slack-edge.com/img/add_to_slack.png)](https://slack.com/oauth/v2/authorize?client_id=11932289980007.11943549521429&scope=app_mentions:read,channels:history,channels:read,chat:write,commands,groups:history,groups:read&redirect_uri=http://cosmo.nest.hackclub.app/slack/callback)



# Slef Hosting Setup
If you want hosting it yourself here's the setup

### 1. Clone the repository

```bash
git clone https://github.com/Ajo-Subarjo/CosmoTrack.git
cd CosmoTrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Slack App

Create a Slack App https://api.slack.com/apps and configure the following.

#### Socket Mode

Enable **Socket Mode** and create an **App-Level Token** with the required permissions.

```env
SLACK_XAPP=your-slack-app-token
```

#### OAuth Scopes

Add these **Bot Token Scopes**:

* `app_mentions:read` - View messages that directly mention @CosmoTrack
* `channels:history` - View messages in public channels that CosmoTrack has been added to
* `channels:read` - View basic information about public channels
* `chat:write` - Send messages as @CosmoTrack
* `commands` - Add shortcuts and slash commands
* `groups:history` - View messages in private channels that CosmoTrack has been added to
* `groups:read` - View basic information about private channels

After adding the scopes, **install or reinstall the app to your workspace**.

### 4. Add the bot to a channel

Invite **@CosmoTrack** to the channel before using the bot.

```text
/invite @CosmoTrack
```

### 5. Configure Slash Commands

Add these Slash Commands to your Slack App:

* `/ct-Ping` - Check if the bot is online
* `/ct-apod` - Get NASA's Astronomy Picture of the Day
* `/ct-trackiss` - Get the current ISS position and crew information

Since CosmoTrack uses **Socket Mode**, no public Request URL is required.

### 6. Configure environment variables

Create a `.env` file in the project root:

```env
SLACK_XOXB=your-slack-bot-token
SLACK_XAPP=your-slack-app-token
NASA_API_KEY=your-nasa-api-key
```

### 7. Run the bot

```bash
npm start
```
try use `node index.js` if it get error


## Tech Stack
* Node.js
* JavaScript
* Slack Bolt
* NASA APOD API
* Open Notify API

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
