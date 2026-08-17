'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  webm?: string;
  mp4?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  style?: React.CSSProperties;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayer = ({
  src,
  poster,
  webm,
  mp4,
  autoplay = false,
  loop = false,
  muted = true,
  playsInline = true,
  preload = 'metadata',
  className,
  style,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    onTimeUpdate?.(video.currentTime, video.duration);
  }, [onTimeUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const [hasError, setHasError] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setHasError(true);
      const video = e.currentTarget;
      onError?.(new Error(video.error?.message || 'Video playback error'));
    },
    [onError]
  );

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseFloat(e.target.value);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isHovered) setShowControls(false);
    }, 3000);
  }, [isHovered]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    video.loop = loop;
    video.playsInline = playsInline;
    video.preload = preload;

    if (autoplay && !isPlaying) {
      video.play().catch(console.error);
    }
  }, [autoplay, loop, muted, playsInline, preload, isPlaying]);

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn('bg-bg-elevated relative overflow-hidden rounded-xl', className)}
      style={style}
      onMouseEnter={() => {
        setIsHovered(true);
        showControlsTemporarily();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowControls(false);
      }}
      onMouseMove={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        playsInline={playsInline}
        preload={preload}
        muted={muted}
        loop={loop}
      >
        {webm && <source src={webm} type="video/webm" />}
        {mp4 && <source src={mp4} type="video/mp4" />}
        {src && !webm && !mp4 && <source src={src} />}
        Your browser does not support the video tag.
      </video>

      {poster && !isPlaying && !posterError && (
        <div className="absolute inset-0 z-10">
          <Image
            src={poster}
            alt="Video preview poster"
            fill
            className="object-cover transition-opacity duration-300"
            aria-hidden="true"
            onError={() => setPosterError(true)}
          />
          {!hasError && (
            <div className="bg-bg-primary/30 absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="glass text-foreground hover:bg-accent/20 hover:text-accent transition-base group rounded-full p-4"
                aria-label="Play video"
              >
                <Play className="ml-1 h-8 w-8" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}

      {(hasError || posterError || (!src && !mp4 && !webm && !poster)) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[#141414] to-[#0A0A0A] p-6 text-center">
          <div className="mb-3 rounded-full border border-[rgba(255,107,74,0.2)] bg-[rgba(255,107,74,0.1)] p-3 text-[#FF6B4A]">
            <Play className="h-6 w-6 opacity-60" />
          </div>
          <p className="mb-1 text-sm font-medium text-[#F5F5F3]">Interactive Video Walkthrough</p>
          <p className="max-w-md text-xs text-[#888883]">
            Product demonstration video preview is currently being updated. See system architecture
            and feature breakdown below.
          </p>
        </div>
      )}

      {(isHovered || showControls) && (
        <div
          className="glass-strong absolute right-0 bottom-0 left-0 z-20 transform px-4 py-3 transition-transform duration-300"
          style={{ transform: isHovered || showControls ? 'translateY(0)' : 'translateY(100%)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="bg-bg-elevated hover:bg-surface text-foreground rounded-lg p-2 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </button>

            <div className="flex flex-1 items-center gap-2">
              <span className="text-muted w-10 text-right font-mono text-xs tabular-nums">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="bg-bg-elevated accent-accent h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
                aria-label="Video progress"
              />
              <span className="text-muted w-10 font-mono text-xs tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="bg-bg-elevated hover:bg-surface text-foreground rounded-lg p-2 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-bg-elevated border-subtle text-foreground focus:border-accent rounded-lg border px-2 py-1 text-xs focus:outline-none"
                aria-label="Playback speed"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              <button
                onClick={toggleFullscreen}
                className="bg-bg-elevated hover:bg-surface text-foreground rounded-lg p-2 transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {duration > 0 && (
        <div className="bg-accent/20 absolute right-0 bottom-0 left-0 h-0.5">
          <div
            className="bg-accent h-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

VideoPlayer.displayName = 'VideoPlayer';
