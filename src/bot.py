import dotenv
import os
from requests.api import get
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from service.nasa_apod import apod
from service.iss_track import get_iss_track


dotenv.load_dotenv()


app = App(token=os.getenv("SLACK_XOXB"))

@app.command("/ct-Ping")
def ping(ack, body,logger, say):
    ack()
    print("someone ping me")
    say("hello i've been trigger")

@app.command("/ct-apod")
def Apod_callback(ack, say):
    ack()
    print("someone req apod")
    data = apod(os.getenv("NASA_API_KEY"))

    if data:

        if data["media_type"] == "image":
            send_apod_image(data,say)

        elif data["media_type"] == "video":
            send_apod_video(data,say)

        else:
            say("can't fetch media type")


@app.command("/ct-trackiss")
def TrackIss_callback(ack, say):
    ack()
    data = get_iss_track()
    if data:
        # print(data)
        send_iss_track(data, say)


def send_iss_track(data, say):
    people = data["name"]

    iss = [p["name"] for p in people if p["craft"] == "ISS"]
    tiangong = [p["name"] for p in people if p["craft"] == "Tiangong"]

    say({
        "text": f"""*Orbital Status*\n *Position*\n```lat: {data['lat']}\nlon: {data['lon']} ```""",

        "attachments": [{
            "text":
                f"\n\n*ISS*  ·  {len(iss)} crew\n"+ "\n".join(f"• {name}" for name in iss) + "\n\n"
                f"*Tiangong*  ·  {len(tiangong)} crew\n" + "\n".join(f"• {name}" for name in tiangong)
        }]
    })

def send_apod_image(data, say):
    say({
        "text": f"*Astronomy Of The Day: {data['title']}*\n `{data['date']}\n\n`",
        "attachments": [{
            "text": data['explanation'],
            "image_url": data['url']
        }]
    })

def send_apod_video(data, say):
    block_chat = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Astronomy Of The Day: {data['title']}*\n `{data['date']}`\n\n"+f"{data['explanation']}"
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "📺 Watch Video",
                        "emoji": True
                    },
                    "value": "watch_video",
                    "url": data['url'],
                    "action_id": "button_click"
                }
            ]
        }
    ]

    say(blocks=block_chat)


if __name__ == "__main__":
    SocketModeHandler(app, os.environ["SLACK_XAPP"]).start()
