import React, { memo, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, CheckCheck, Play, Pause } from "lucide-react";
import Image from "@/foundation/components/icons/Image";
import type { ChatMessage, ChatConversation } from "@/core/api/chat/type";

interface MessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
  currentUserId?: string;
  conversation?: ChatConversation | null;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn, conversation, currentUserId }) => {
  const messageDate = new Date(message.createdAt);
  const isToday = messageDate.toDateString() === new Date().toDateString();
  const timeStr = format(messageDate, isToday ? "HH:mm" : "dd/MM/yyyy HH:mm", {
    locale: vi,
  });

  // Get sender avatar - with special handling for CSKH/admin conversations
  const getSenderAvatar = () => {
    if (!conversation || !currentUserId) {
      return message.senderAvatar || null;
    }

    const isCSKHConversation =
      conversation.type === "admin" &&
      (conversation as any).metadata?.context === "CSKH";

    // In CSKH conversations on admin side:
    // - Messages from user: always use the "other participant" avatar (the user),
    //   because backend may send CSKH avatar in senderAvatar for all messages.
    if (isCSKHConversation && message.senderId !== currentUserId) {
      const otherParticipant =
        conversation.participants.find(
          (p: { userId: string }) => p.userId !== currentUserId
        ) || conversation.participants[0];

      if (otherParticipant?.avatar) {
        return otherParticipant.avatar;
      }
    }

    // Default behavior: prefer message.senderAvatar
    if (message.senderAvatar) {
      return message.senderAvatar;
    }

    // Fallback: find participant by senderId
    if (message.senderId) {
      const senderParticipant = conversation.participants.find(
        (p: { userId: string }) => p.userId === message.senderId
      );
      if (senderParticipant?.avatar) {
        return senderParticipant.avatar;
      }
    }

    return null;
  };

  const senderAvatar = getSenderAvatar();

  return (
    <div
      className={clsx(
        "flex gap-3 mb-3 group",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && (
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary-5 to-primary-7 flex items-center justify-center shadow-sm">
            {senderAvatar ? (
              <Image
                src={senderAvatar}
                alt={message.senderName || "User"}
                rounded
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-6 text-white flex items-center justify-center text-sm font-semibold">
                {(message.senderName || "U")[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={clsx("flex flex-col max-w-[75%] sm:max-w-[65%]", isOwn ? "items-end" : "items-start")}>
        {!isOwn && (
          <span className="text-xs text-neutral-7 mb-1.5 px-1 font-medium">
            {message.senderName || "Người dùng"}
          </span>
        )}

        {/* Audio Player Component */}
        {(() => {
          const AudioPlayer = ({ url, isOwn }: { url: string; isOwn: boolean }) => {
            const [isPlaying, setIsPlaying] = useState(false);
            const [duration, setDuration] = useState(0);
            const [currentTime, setCurrentTime] = useState(0);
            const audioRef = useRef<HTMLAudioElement>(null);
            const animationFrameRef = useRef<number | null>(null);

            useEffect(() => {
              const audio = audioRef.current;
              if (!audio) return;

              const updateDuration = () => setDuration(audio.duration);
              const updateTime = () => {
                setCurrentTime(audio.currentTime);
                if (isPlaying) {
                  animationFrameRef.current = requestAnimationFrame(updateTime);
                }
              };
              const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
              };
              const handlePlay = () => setIsPlaying(true);
              const handlePause = () => setIsPlaying(false);

              audio.addEventListener("loadedmetadata", updateDuration);
              audio.addEventListener("timeupdate", updateTime);
              audio.addEventListener("ended", handleEnded);
              audio.addEventListener("play", handlePlay);
              audio.addEventListener("pause", handlePause);

              return () => {
                audio.removeEventListener("loadedmetadata", updateDuration);
                audio.removeEventListener("timeupdate", updateTime);
                audio.removeEventListener("ended", handleEnded);
                audio.removeEventListener("play", handlePlay);
                audio.removeEventListener("pause", handlePause);
                if (animationFrameRef.current) {
                  cancelAnimationFrame(animationFrameRef.current);
                }
              };
            }, [url, isPlaying]);

            const togglePlay = (e?: React.MouseEvent) => {
              e?.stopPropagation();
              const audio = audioRef.current;
              if (!audio) return;

              if (isPlaying) {
                audio.pause();
              } else {
                audio.play();
              }
            };

            const formatTime = (seconds: number) => {
              if (isNaN(seconds)) return "0:00";
              const mins = Math.floor(seconds / 60);
              const secs = Math.floor(seconds % 60);
              return `${mins}:${secs.toString().padStart(2, "0")}`;
            };

            // Generate waveform bars (simulated - in real app, you'd analyze audio)
            const waveformBars = Array.from({ length: 40 }, (_, i) => {
              const progress = currentTime / duration || 0;
              const isActive = i / 40 < progress;
              const height = isPlaying && isActive 
                ? 20 + Math.sin((Date.now() / 100 + i * 10) % (Math.PI * 2)) * 8
                : isActive 
                  ? 20 
                  : 4 + Math.random() * 8;
              return { height, isActive };
            });

            return (
              <div
                onClick={togglePlay}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                  isOwn
                    ? "bg-gradient-to-br from-primary-6 to-primary-7 text-white shadow-lg"
                    : "bg-gradient-to-br from-background-2 to-background-1 text-neutral-10 border border-neutral-3 shadow-sm"
                )}
              >
                <audio ref={audioRef} src={url} preload="metadata" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className={clsx(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl",
                    isOwn
                      ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      : "bg-primary-6 hover:bg-primary-7 text-white"
                  )}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  {/* Waveform visualization */}
                  <div className="flex items-center gap-0.5 mb-2 h-6">
                    {waveformBars.map((bar, idx) => (
                      <div
                        key={idx}
                        className={clsx(
                          "w-0.5 rounded-full transition-all duration-150",
                          isOwn
                            ? bar.isActive
                              ? "bg-white/80"
                              : "bg-white/30"
                            : bar.isActive
                              ? "bg-primary-6"
                              : "bg-neutral-4"
                        )}
                        style={{
                          height: `${bar.height}px`,
                          minHeight: "4px",
                        }}
                      />
                    ))}
                  </div>
                  {/* Time display */}
                  <div className={clsx(
                    "text-xs font-medium flex items-center justify-between",
                    isOwn ? "text-white/90" : "text-neutral-7"
                  )}>
                    <span>{formatTime(currentTime)}</span>
                    <span className="opacity-70">/ {formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            );
          };

          const hasText = message.message && typeof message.message === 'string' && message.message.trim();
          const hasAttachments = message.attachments && message.attachments.length > 0;
          const hasAudio = hasAttachments && message.attachments?.some((att) => att.type?.startsWith("audio/"));
          const onlyImages = hasAttachments && !hasText && !hasAudio;
          const onlyAudio = hasAttachments && !hasText && hasAudio && message.attachments?.every((att) => att.type?.startsWith("audio/"));

          // If only audio, render without background bubble
          if (onlyAudio) {
            return (
              <div className="space-y-2">
                {message.attachments?.map((attachment, idx) => (
                  attachment.type?.startsWith("audio/") ? (
                    <div key={idx} className="w-full max-w-sm">
                      <AudioPlayer url={attachment.url} isOwn={isOwn} />
                    </div>
                  ) : null
                ))}
              </div>
            );
          }

          // If only images, render without background bubble
          if (onlyImages && message.attachments) {
            return (
              <div className="space-y-2">
                {message.attachments.map((attachment, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden">
                    {attachment.type?.startsWith("image/") ? (
                      <Image
                        src={attachment.url}
                        alt={attachment.name || "Attachment"}
                        className="max-w-full h-auto rounded-lg"
                      />
                    ) : (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-neutral-2 rounded hover:bg-neutral-3 transition-colors"
                      >
                        <span className="text-sm">{attachment.name || "File"}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // If has text or both text and attachments, render with background bubble
          return (
            <div
              className={clsx(
                "rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200",
                isOwn
                  ? "bg-gradient-to-br from-primary-6 to-primary-7 text-white rounded-br-md"
                  : "bg-gradient-to-br from-background-2 to-background-1 text-neutral-10 rounded-bl-md border border-neutral-3"
              )}
            >
              {hasText && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
              )}

              {hasAttachments && message.attachments && (
                <div className={clsx("space-y-2", hasText ? "mt-2" : "")}>
                  {message.attachments.map((attachment, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden">
                      {attachment.type?.startsWith("image/") ? (
                        <Image
                          src={attachment.url}
                          alt={attachment.name || "Attachment"}
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : attachment.type?.startsWith("audio/") ? (
                        <div className="w-full max-w-sm">
                          <AudioPlayer url={attachment.url} isOwn={isOwn} />
                        </div>
                      ) : (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-neutral-2 rounded hover:bg-neutral-3 transition-colors"
                        >
                          <span className="text-sm">{attachment.name || "File"}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <div className={clsx("flex items-center gap-1.5 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity", isOwn ? "flex-row-reverse" : "")}>
          <span className="text-xs text-neutral-5">{timeStr}</span>
          {isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-primary-6" />
              ) : message.isDelivered ? (
                <CheckCheck className="w-3.5 h-3.5 text-neutral-5" />
              ) : (
                <Check className="w-3.5 h-3.5 text-neutral-5" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MessageItem);

