export async function getIssTrack() {
  let position;
  let people;

  try {
      console.log("Fetching ISS position...");

      const response = await fetch(
          "http://api.open-notify.org/iss-now.json"
      );

      console.log("Position status:", response.status);

      position = await response.json();

  } catch (error) {
      console.error("POSITION ERROR:", error);
      return null;
  }


  try {
      console.log("Fetching astronauts...");

      const response = await fetch(
          "http://api.open-notify.org/astros.json"
      );

      console.log("Astronaut status:", response.status);

      people = await response.json();

  } catch (error) {
      console.error("ASTRONAUT ERROR:", error);
      return null;
  }
  return {
      lat: Number(position.iss_position.latitude),
      lon: Number(position.iss_position.longitude),
      astros: people.people ?? []
  };
}


// getIssTrack()

// }


// async function test() {
//   console.log(getIssTrack())
// }


// test()
