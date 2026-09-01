require("dotenv").config()
const { App } = require("@slack/bolt");

const { getIssTrack } = require("./service/iss.mjs");
const { getNasaApod } = require("./service/nasa.mjs")


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
  console.log("bot is running!");
})();
