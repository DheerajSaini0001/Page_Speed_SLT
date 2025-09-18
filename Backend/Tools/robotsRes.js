import axios from "axios";

export default async function robotsRes(url) {

    try{
    const robotsRes = await axios.get(new URL("/robots.txt", url).href);
    const robotsText = robotsRes.data;
    return robotsText;
    }
    catch (error) {
    console.error("Error fetching robotsText data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch robotsText data" });
  }
}
