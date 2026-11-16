import { useEffect, useRef, useState } from "react";
import { discographyQueue } from "@/data/playlist";

type QueueAlbum = (typeof discographyQueue)[number];
type YouTubePlayer = {
  loadPlaylist: (playlist: string[] | { list: string; listType?: string; index?: number }, index?: number, startSeconds?: number) => void;
  getPlaylist: () => string[];
  getPlaylistIndex: () => number;
  destroy: () => void;
};
type YouTubeEvent = { data: number; target: YouTubePlayer };
type YouTubeApi = {
  PlayerState: { ENDED: number; PLAYING: number };
  Player: new (
    iframe: HTMLIFrameElement,
    options: {
      events: {
        onReady: (event: YouTubeEvent) => void;
        onStateChange: (event: YouTubeEvent) => void;
        onAutoplayBlocked?: () => void;
      };
    },
  ) => YouTubePlayer;
};
type SoundCloudWidget = {
  bind: (event: string, listener: () => void) => void;
  unbind: (event: string) => void;
  getCurrentSoundIndex: (callback: (index: number) => void) => void;
  getSounds: (callback: (sounds: unknown[]) => void) => void;
  skip: (soundIndex: number) => void;
  play: () => void;
};
type SoundCloudApi = {
  Widget: {
    (iframe: HTMLIFrameElement): SoundCloudWidget;
    Events: { READY: string; PLAY: string; FINISH: string };
  };
};
type ApiWindow = Window & {
  YT?: YouTubeApi;
  SC?: SoundCloudApi;
  onYouTubeIframeAPIReady?: () => void;
};
type Props = {
  album: QueueAlbum;
  selectedTrackIndex: number;
  selectionRequestId: number;
  onTrackChange: (index: number) => void;
  onEnded: () => void;
};

let youtubePromise: Promise<YouTubeApi> | null = null;
let soundCloudPromise: Promise<SoundCloudApi> | null = null;

function loadYouTubeApi(): Promise<YouTubeApi> {
  const apiWindow = window as ApiWindow;
  if (apiWindow.YT?.Player) return Promise.resolve(apiWindow.YT);
  if (youtubePromise) return youtubePromise;

  youtubePromise = new Promise((resolve, reject) => {
    const previousReady = apiWindow.onYouTubeIframeAPIReady;
    apiWindow.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (apiWindow.YT) resolve(apiWindow.YT);
      else reject(new Error("No se pudo inicializar YouTube."));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.dataset.dobermanYoutubeApi = "true";
    script.onerror = () => reject(new Error("No se pudo cargar el control de YouTube."));
    document.head.appendChild(script);
  });
  return youtubePromise;
}

function loadSoundCloudApi(): Promise<SoundCloudApi> {
  const apiWindow = window as ApiWindow;
  if (apiWindow.SC) return Promise.resolve(apiWindow.SC);
  if (soundCloudPromise) return soundCloudPromise;

  soundCloudPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = () => {
      if (apiWindow.SC) resolve(apiWindow.SC);
      else reject(new Error("No se pudo inicializar SoundCloud."));
    };
    script.onerror = () => reject(new Error("No se pudo cargar el control de SoundCloud."));
    document.head.appendChild(script);
  });
  return soundCloudPromise;
}

function getYouTubeEmbedUrl(videoId: string): string {
  const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embedUrl.searchParams.set("autoplay", "0");
  embedUrl.searchParams.set("playsinline", "1");
  embedUrl.searchParams.set("controls", "1");
  embedUrl.searchParams.set("rel", "0");
  embedUrl.searchParams.set("enablejsapi", "1");
  embedUrl.searchParams.set("origin", window.location.origin);
  return embedUrl.toString();
}

function getSoundCloudEmbedUrl(sourceUrl: string, startTrack: number): string {
  const embedUrl = new URL("https://w.soundcloud.com/player/");
  embedUrl.searchParams.set("url", sourceUrl);
  embedUrl.searchParams.set("auto_play", "true");
  embedUrl.searchParams.set("visual", "true");
  embedUrl.searchParams.set("color", "d44b39");
  embedUrl.searchParams.set("hide_related", "true");
  embedUrl.searchParams.set("show_comments", "false");
  embedUrl.searchParams.set("show_reposts", "false");
  embedUrl.searchParams.set("show_user", "true");
  embedUrl.searchParams.set("start_track", String(startTrack));
  return embedUrl.toString();
}

export function PlaybackQueuePlayer({ album, selectedTrackIndex, selectionRequestId, onTrackChange, onEnded }: Props) {
  const youtubeFrame = useRef<HTMLIFrameElement>(null);
  const soundCloudFrame = useRef<HTMLIFrameElement>(null);
  const youtubePlayer = useRef<YouTubePlayer | undefined>(undefined);
  const soundCloudWidget = useRef<SoundCloudWidget | undefined>(undefined);
  const selectedTrackRef = useRef(selectedTrackIndex);
  const onTrackChangeRef = useRef(onTrackChange);
  const onEndedRef = useRef(onEnded);
  const processedRequest = useRef(selectionRequestId);
  const advanced = useRef(false);
  const [notice, setNotice] = useState("");

  selectedTrackRef.current = selectedTrackIndex;
  onTrackChangeRef.current = onTrackChange;
  onEndedRef.current = onEnded;

  const finishBlock = () => {
    if (advanced.current) return;
    advanced.current = true;
    onEndedRef.current();
  };

  useEffect(() => {
    advanced.current = false;
    setNotice("");
    processedRequest.current = selectionRequestId;
    youtubePlayer.current = undefined;
    soundCloudWidget.current = undefined;
  }, [album.id]);

  useEffect(() => {
    if (album.playback.provider !== "YouTube" || !youtubeFrame.current) return;
    let cancelled = false;
    let player: YouTubePlayer | undefined;
    const videoIds = album.playback.videoIds ?? [];

    loadYouTubeApi().then((api) => {
      if (cancelled || !youtubeFrame.current) return;
      player = new api.Player(youtubeFrame.current, {
        events: {
          onReady: (event) => {
            youtubePlayer.current = event.target;
            event.target.loadPlaylist(videoIds, selectedTrackRef.current, 0);
          },
          onStateChange: (event) => {
            if (event.data === api.PlayerState.PLAYING) {
              const currentIndex = event.target.getPlaylistIndex();
              if (currentIndex >= 0) onTrackChangeRef.current(currentIndex);
            }
            if (event.data === api.PlayerState.ENDED) {
              const playlist = event.target.getPlaylist();
              const currentIndex = event.target.getPlaylistIndex();
              if (currentIndex >= 0) onTrackChangeRef.current(currentIndex);
              if (currentIndex >= 0 && currentIndex === playlist.length - 1) finishBlock();
            }
          },
          onAutoplayBlocked: () => setNotice("El navegador bloqueó el inicio automático. Tocá Play en el reproductor; las canciones siguen dentro de la página."),
        },
      });
      youtubePlayer.current = player;
    }).catch(() => setNotice("No se pudo cargar la lista de YouTube. Podés abrir la playlist de origen desde el enlace superior."));

    return () => {
      cancelled = true;
      youtubePlayer.current = undefined;
      player?.destroy();
    };
  }, [album.id, album.playback.provider]);

  useEffect(() => {
    if (album.playback.provider !== "SoundCloud" || !soundCloudFrame.current) return;
    let cancelled = false;
    let widget: SoundCloudWidget | undefined;
    let readyEvent = "";
    let playEvent = "";
    let finishEvent = "";
    let started = false;

    const startPlayback = () => {
      if (cancelled || started || !widget) return;
      started = true;
      if (selectedTrackRef.current > 0) widget.skip(selectedTrackRef.current);
      widget.play();
    };

    const onPlay = () => {
      widget?.getCurrentSoundIndex((currentIndex) => {
        if (!cancelled && currentIndex >= 0) onTrackChangeRef.current(currentIndex);
      });
    };
    const onFinish = () => {
      widget?.getCurrentSoundIndex((currentIndex) => {
        widget?.getSounds((sounds) => {
          if (!cancelled && currentIndex >= 0) onTrackChangeRef.current(currentIndex);
          if (!cancelled && currentIndex >= 0 && currentIndex === sounds.length - 1) finishBlock();
        });
      });
    };

    loadSoundCloudApi().then((api) => {
      if (cancelled || !soundCloudFrame.current) return;
      widget = api.Widget(soundCloudFrame.current);
      soundCloudWidget.current = widget;
      readyEvent = api.Widget.Events.READY;
      playEvent = api.Widget.Events.PLAY;
      finishEvent = api.Widget.Events.FINISH;
      widget.bind(readyEvent, startPlayback);
      widget.bind(playEvent, onPlay);
      widget.bind(finishEvent, onFinish);
      widget.getSounds((sounds) => {
        if (sounds.length > 0) startPlayback();
      });
    }).catch(() => setNotice("No se pudo cargar el set de SoundCloud. Podés abrir el álbum de origen desde el enlace superior."));

    return () => {
      cancelled = true;
      if (widget && readyEvent) widget.unbind(readyEvent);
      if (widget && playEvent) widget.unbind(playEvent);
      if (widget && finishEvent) widget.unbind(finishEvent);
      soundCloudWidget.current = undefined;
    };
  }, [album.id, album.playback.provider]);

  useEffect(() => {
    if (selectionRequestId === processedRequest.current) return;
    processedRequest.current = selectionRequestId;
    const trackIndex = selectedTrackRef.current;
    if (album.playback.provider === "YouTube" && youtubePlayer.current) {
      youtubePlayer.current.loadPlaylist(album.playback.videoIds ?? [], trackIndex, 0);
    } else if (album.playback.provider === "SoundCloud" && soundCloudWidget.current) {
      soundCloudWidget.current.skip(trackIndex);
      soundCloudWidget.current.play();
    }
  }, [album.playback.provider, selectionRequestId]);

  if (album.playback.provider === "YouTube") {
    const firstVideoId = album.playback.videoIds?.[0] ?? "";
    return (
      <>
        <iframe
          ref={youtubeFrame}
          className="playlist-embed youtube-embed"
          src={getYouTubeEmbedUrl(firstVideoId)}
          title={`${album.title} · reproductor de YouTube`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {notice && <p className="player-status" role="status">{notice}</p>}
      </>
    );
  }

  return (
    <>
      <iframe
        ref={soundCloudFrame}
        className="playlist-embed soundcloud-embed"
        src={getSoundCloudEmbedUrl(album.playback.sourceUrl, selectedTrackIndex)}
        title={`${album.title} · reproductor de SoundCloud con selector de canciones`}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {notice && <p className="player-status" role="status">{notice}</p>}
    </>
  );
}
