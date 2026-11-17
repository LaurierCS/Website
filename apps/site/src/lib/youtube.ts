/**
 * YouTube API integration for fetching recent videos from the channel.
 */

export type YouTubeVideo = {
  title: string;
  url: string;
  date: string;
  thumb: string;
};

const CHANNEL_ID = 'UCx5kLv_MO-yhjIIqcCLEMFA';
const YOUTUBE_API_BASE = 'https://www.youtube.com/feeds/videos.xml?channel_id=';

/**
 * Fetch recent videos from the YouTube channel using the public RSS feed.
 * This doesn't require an API key and works server-side.
 */
export async function getRecentYouTubeVideos(limit = 3): Promise<YouTubeVideo[]> {
  try {
    const feedUrl = `${YOUTUBE_API_BASE}${CHANNEL_ID}`;
    const response = await fetch(feedUrl);

    if (!response.ok) {
      console.error('Failed to fetch YouTube feed:', response.statusText);
      return [];
    }

    const text = await response.text();

    // Parse the RSS feed manually
    const videos: YouTubeVideo[] = [];

    // Extract video entries from the feed
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    let count = 0;

    while ((match = entryRegex.exec(text)) !== null && count < limit) {
      const entry = match[1];

      // Extract title
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : 'Untitled';

      // Extract video ID from yt:videoId
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      if (!videoIdMatch) continue;

      const videoId = videoIdMatch[1];
      const url = `https://www.youtube.com/watch?v=${videoId}`;

      // Extract published date
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const publishedDate = publishedMatch
        ? new Date(publishedMatch[1]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Recently';

      // Generate thumbnail URL (YouTube standard format)
      const thumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      videos.push({
        title,
        url,
        date: publishedDate,
        thumb,
      });

      count++;
    }

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}
