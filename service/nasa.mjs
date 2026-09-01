export async function getNasaApod(apiKey) {
  try {
    const respons = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = await respons.json()
    console.log(data)
    return {
          date: data.date ?? "",
          title: data.title ?? "Astronomy Picture of the Day",
          explanation: data.explanation ?? "",
          url: data.url ?? "no media",
          media_type: data.media_type ?? "cant identified"
        };
  } catch (e) {
    console.error(`Error to communicate with nasa api: ${e}`);
    return null;
  }
}
