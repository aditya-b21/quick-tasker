import { useMemo } from "react";

interface VideoEmbedProps {
  url: string;
  title?: string;
}

const VideoEmbed = ({ url, title = "Video" }: VideoEmbedProps) => {
  const embedData = useMemo(() => {
    // YouTube detection - handles watch, embed, shorts, and youtu.be
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
        videoId,
      };
    }

    // Instagram detection - handles posts, reels, and reels URLs
    const instagramMatch = url.match(
      /instagram\.com\/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/
    );
    if (instagramMatch) {
      const postId = instagramMatch[1];
      return {
        type: "instagram",
        embedUrl: `https://www.instagram.com/p/${postId}/embed`,
        postId,
      };
    }

    // Google Drive detection
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return {
        type: "drive",
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        fileId,
      };
    }

    // Direct video URL (mp4, webm, etc.)
    if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
      return {
        type: "direct",
        embedUrl: url,
      };
    }

    return { type: "unknown", embedUrl: url };
  }, [url]);

  if (embedData.type === "unknown") {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Unsupported video format</p>
        <p className="text-muted-foreground text-xs mt-1">{url}</p>
      </div>
    );
  }

  if (embedData.type === "direct") {
    return (
      <div className="video-embed-container rounded-lg overflow-hidden">
        <video
          src={embedData.embedUrl}
          title={title}
          controls
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  if (embedData.type === "instagram") {
    return (
      <div className="video-embed-container rounded-lg overflow-hidden">
        <iframe
          src={`https://www.instagram.com/p/${embedData.postId}/embed`}
          title={title}
          className="w-full h-full rounded-lg"
          style={{ border: "none", minHeight: "540px" }}
          scrolling="no"
          allow="encrypted-media"
        />
      </div>
    );
  }

  return (
    <div className="video-embed-container rounded-lg overflow-hidden">
      <iframe
        src={embedData.embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg w-full"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default VideoEmbed;
