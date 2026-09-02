require("dotenv").config()
const { App } = require("@slack/bolt");
const express = require("express");
const axios = require("axios");
const { getIssTrack } = require("./service/iss.mjs");
const { getNasaApod } = require("./service/nasa.mjs")


const web = express();
const CLIENT_ID = process.env.SLACK_CLIENT_ID;
const CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const REDIRECT_URI = process.env.SLACK_REDIRECT_URI;

web.get("/slack/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Error: no code");

  try {
    const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
      params: { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code, redirect_uri: REDIRECT_URI }
    });
    console.log("Bot token:", response.data.access_token);
    res.send("Bot berhasil diinstall! ✅");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});



const app = new App({
  token: process.env.SLACK_XOXB,
  appToken: process.env.SLACK_XAPP,
  socketMode: true
});

app.command("/ct-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/ct-trackiss", async ({ ack, say }) => {
  await ack();
  const data = await getIssTrack()

  if (data) {
    await sendIssTrack(data, say);
  }
  });

app.command("/ct-apod", async ({ ack, say }) => {
  await ack()
  const data = await getNasaApod(process.env.NASA_API_KEY);
  if (!data) {
      await say("can't fetch APOD");
      return;
  }

  if (data.media_type === "image") {
      await sendApodImage(data, say);
  }

  else if (data.media_type === "video") {
      await sendApodVideo(data, say);
  }

  else {
      await say("can't fetch media type");
  }
});




async function sendIssTrack(data, say) {
  // console.log(astros)
  const { astros } = data;
  const iss = astros.filter(p => p.craft === "ISS").map(p => p.name);
  const tiangong = astros.filter(p => p.craft === "Tiangong").map(p => p.name);
  await say({
    text:
      `*Orbital Status*\n` +
      `*Position*\n` +
      `\`\`\`lat: ${data.lat}\nlon: ${data.lon} \`\`\``,

    attachments: [
      {
        text:
          `\n\n*ISS*  ·  ${iss.length} crew\n` +
          iss.map(name => `• ${name}`).join("\n") +
          `\n\n` +
          `*Tiangong*  ·  ${tiangong.length} crew\n` +
          tiangong.map(name => `• ${name}`).join("\n")
      }
    ]
  });
}

async function sendApodImage(data, say) {
  say({
    text: `*Astronomy Of The Day: ${data.title}*\n \`${data.date}\n\n\``,
    attachments: [{
      text: data.explanation,
      image_url: data.url
    }]
  });
}

async function sendApodVideo(data, say) {
  say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Astronomy Of The Day: ${data.title}*\n \`${data.date}\`\n\n${data.explanation}`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "📺 Watch Video",
              emoji: true
            },
            value: "watch_video",
            url: data.url,
            action_id: "button_click"
          }
        ]
      }
    ]
  });
}




(async () => {
  await app.start();
  web.listen(3000, () => console.log("Express running on port 3000"));
  console.log("bot is running!");
})();
