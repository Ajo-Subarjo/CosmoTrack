import requests

def apod():
    try:
        url_nasa = "https://nasa.gov"
        respons = requests.get(url=url_nasa).json()
        print(respons)
        return {
            "tittle": respons.get("tittle","Astronomy Picture of the Day"),
            "explanation": respons.get("explanation",""),
            "url": respons.get("url", "no media")
        }
    except Exception as e:
        printf(f"Error to communicate with nasa api: {e}")
        return nonl

print(apod())
