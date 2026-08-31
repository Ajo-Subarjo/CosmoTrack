import requests

def get_iss_track():
    try:
        position = requests.get("http://api.open-notify.org/iss-now.json").json()
        name = requests.get("http://api.open-notify.org/astros.json").json()
        return {
            "lat": float(position['iss_position']['latitude']),
            "lon": float(position['iss_position']['longitude']),
            "name": name.get('people',""),
        }

    except Exception as e:
        print(f"Error to communicate with iss api: {e}")
        return None
