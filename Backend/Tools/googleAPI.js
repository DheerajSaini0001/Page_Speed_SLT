const API_KEY = 'AIzaSyCww7MhvCEUmHhlACNBqfbzL5PUraT8lkk';


export default async function googleAPI(url) {
    try{
    const googleAPI =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(url)}&strategy=desktop&key=${API_KEY}`;
    // console.log(googleAPI);
    const response = await fetch(googleAPI);
    const data = await response.json(); 
    
    return data;
    }
    catch (error) {
    console.error("Error fetching Google API data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Google API data" });
  }


}
