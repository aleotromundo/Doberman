import { useEffect, useRef, useState } from "react";
import { discographyQueue } from "@/data/playlist";

type QueueAlbum = (typeof discographyQueue)[number];
type YouTubePlayer = { playVideo: () => void; destroy: () => void };
type YouTubeEvent = { data: number; target: YouTubePlayer };
type YouTubeApi = {
  PlayerState: { ENDED: number };
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
};
type SoundCloudApi = {
  Widget: {
    (iframe: HTMLIFrameElement): SoundCloudWidget;
    Events: { READY: string; FINISH: string };
  };
};
type SpotifyUpdate = {
  isPaused?: boolean;
  isBuffering?: boolean;
  duration?: number;
  position?: number;
  playingURI?: string;
};
type SpotifyController = {
  addListener: (event: "ready" | "playback_update" | "playback_started", listener: (event?: { data?: SpotifyUpdate }) => void) => void;
  play: () => void;
  destroy: () => void;
};
type SpotifyApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: SpotifyController) => void,
  ) => void;
};
type ApiWindow = Window & {
  YT?: YouTubeApi;
  SC?: SoundCloudApi;
  __dobermanSpotifyApi?: SpotifyApi;
  onYouTubeIframeAPIReady?: () => void;
  onSpotifyIframeApiReady?: (api: SpotifyApi) => void;
};

type Props = { album: QueueAlbum; onEnded: () => void };

let youtubePromise: Promise<YouTubeApi> | null = null;
let soundCloudPromise: Promise<SoundCloudApi> | null = null;
let spotifyPromise: Promise<SpotifyApi> | null = null;

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

function loadSpotifyApi(): Promise<SpotifyApi> {
  const apiWindow = window as ApiWindow;
  if (apiWindow.__dobermanSpotifyApi) return Promise.resolve(apiWindow.__dobermanSpotifyApi);
  if (spotifyPromise) return spotifyPromise;

  spotifyPromise = new Promise((resolve, reject) => {
    const previousReady = apiWindow.onSpotifyIframeApiReady;
    apiWindow.onSpotifyIframeApiReady = (api) => {
      apiWindow.__dobermanSpotifyApi = api;
      previousReady?.(api);
      resolve(api);
    };
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => reject(new Error("No se pudo cargar el control de Spotify."));
    document.head.appendChild(script);
  });
  return spotifyPromise;
}

function getYouTubeEmbedUrl(sourceUrl: string): string {
  const videoId = new URL(sourceUrl).searchParams.get("v");
  if (!videoId) return sourceUrl;
  const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embedUrl.searchParams.set("autoplay", "1");
  embedUrl.searchParams.set("playsinline", "1");
  embedUrl.searchParams.set("rel", "0");
  embedUrl.searchParams.set("enablejsapi", "1");
  embedUrl.searchParams.set("origin", window.location.origin);
  return embedUrl.toString();
}

function getSpotifyUri(sourceUrl: string): string {
  const id = new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1);
  return `spotify:album:${id ?? ""}`;
}

export function PlaybackQueuePlayer({ album, onEnded }: Props) {
  const youtubeFrame = useRef<HTMLIFrameElement>(null);
  const soundCloudFrame = useRef<HTMLIFrameElement>(null);
  const spotifyMount = useRef<HTMLDivElement>(null);
  const onEndedRef = useRef(onEnded);
  const advanced = useRef(false);
  const [notice, setNotice] = useState("");
  onEndedRef.current = onEnded;

  useEffect(() => {
    advanced.current = false;
    setNotice("");
  }, [album.id]);

  const finishBlock = () => {
    if (advanced.current) return;
    advanced.current = true;
    onEndedRef.current();
  };

  useEffect(() => {
    if (album.playback.provider !== "YouTube" || !youtubeFrame.current) return;
    let cancelled = false;
    let player: YouTubePlayer | undefined;

    loadYouTubeApi().then((api) => {
      if (cancelled || !youtubeFrame.current) return;
      player = new api.Player(youtubeFrame.current, {
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === api.PlayerState.ENDED) finishBlock();
          },
          onAutoplayBlocked: () => setNotice("El navegador bloqueó el inicio automático. Tocá Play en el reproductor y la cola seguirá al terminar."),
        },
      });
    }).catch(() => setNotice("No se pudo activar el pase automático de YouTube. El botón “Siguiente” queda disponible."));

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [album.id, album.playback.provider, album.playback.sourceUrl]);

  useEffect(() => {
    if (album.playback.provider !== "SoundCloud" || !soundCloudFrame.current) return;
    let cancelled = false;
    let widget: SoundCloudWidget | undefined;
    let finishEvent = "";
    const onFinish = () => {
      widget?.getCurrentSoundIndex((currentIndex) => {
        widget?.getSounds((sounds) => {
          if (!cancelled && currentIndex >= 0 && currentIndex === sounds.length - 1) finishBlock();
        });
      });
    };

    loadSoundCloudApi().then((api) => {
      if (cancelled || !soundCloudFrame.current) return;
      widget = api.Widget(soundCloudFrame.current);
      finishEvent = api.Widget.Events.FINISH;
      widget.bind(finishEvent, onFinish);
    }).catch(() => setNotice("No se pudo activar el pase automático de SoundCloud. El botón “Siguiente” queda disponible."));

    return () => {
      cancelled = true;
      if (widget && finishEvent) widget.unbind(finishEvent);
    };
  }, [album.id, album.playback.provider, album.playback.sourceUrl]);

  useEffect(() => {
    if (album.playback.provider !== "Spotify" || !spotifyMount.current) return;
    let cancelled = false;
    let controller: SpotifyController | undefined;
    let spotifyTrackStarts = 0;

    loadSpotifyApi().then((api) => {
      if (cancelled || !spotifyMount.current) return;
      api.createController(spotifyMount.current, { uri: getSpotifyUri(album.playback.sourceUrl), width: "100%", height: 352 }, (createdController) => {
        if (cancelled) {
          createdController.destroy();
          return;
        }
        controller = createdController;
        controller.addListener("ready", () => {
          try {
            controller?.play();
          } catch {
            setNotice("Spotify necesita que inicies la reproducción desde sus controles; la cola seguirá cuando detecte el final.");
          }
        });
        controller.addListener("playback_started", (event) => {
          if (event?.data?.playingURI) spotifyTrackStarts += 1;
        });
        controller.addListener("playback_update", (event) => {
          const playback = event?.data;
          if (!playback || playback.isBuffering || !playback.isPaused || !playback.duration || playback.position === undefined) return;
          if (spotifyTrackStarts < album.trackCount) return;
          // Spotify exposes track updates, not a guaranteed album-finished event; keep this end check narrow.
          if (playback.position >= playback.duration - 400) finishBlock();
        });
      });
    }).catch(() => setNotice("No se pudo activar el pase automático de Spotify. El botón “Siguiente” queda disponible."));

    return () => {
      cancelled = true;
      controller?.destroy();
    };
  }, [album.id, album.playback.provider, album.playback.sourceUrl]);

  if (album.playback.provider === "YouTube") {
    return (
      <>
        <iframe
          ref={youtubeFrame}
          className="playlist-embed"
          src={getYouTubeEmbedUrl(album.playback.sourceUrl)}
          title={`${album.title} · reproductor de YouTube`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {notice && <p className="player-status" role="status">{notice}</p>}
      </>
    );
  }

  if (album.playback.provider === "SoundCloud") {
    return (
      <>
        <iframe
          ref={soundCloudFrame}
          className="playlist-embed"
          src={album.playback.embedUrl}
          title={`${album.title} · reproductor de SoundCloud`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {notice && <p className="player-status" role="status">{notice}</p>}
      </>
    );
  }

  return (
    <>
      <div ref={spotifyMount} className="playlist-embed spotify-embed" aria-label={`${album.title} · reproductor de Spotify`} />
      {notice && <p className="player-status" role="status">{notice}</p>}
    </>
  );
}
