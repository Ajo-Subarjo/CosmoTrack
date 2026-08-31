import requests


def apod(api_key):
    try:
        url_nasa = f"https://api.nasa.gov/planetary/apod?api_key={api_key}"
        respons = requests.get(url=url_nasa).json()
        print(respons)
        return {
            "date": respons.get("date", ""),
            "title": respons.get("title","Astronomy Picture of the Day"),
            "explanation": respons.get("explanation",""),
            "url": respons.get("url", "no media"),
            "media_type": respons.get("media_type", "cant identified")
        }
    except Exception as e:
        print(f"Error to communicate with nasa api: {e}")
        return None
