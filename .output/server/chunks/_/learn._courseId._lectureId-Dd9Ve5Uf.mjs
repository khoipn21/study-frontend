import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, AlertCircle, ChevronLeft, List, ChevronRight, X, BookOpen, Clock, CheckCircle2, MessageSquare, Download, Pause, Play, SkipBack, SkipForward, VolumeX, Volume2, Settings, Minimize, Maximize } from 'lucide-react';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { e as Route$a, u as useAuth, B as Button, c as cn } from './ssr.mjs';
import { P as Progress } from './progress-B-kuOVqI.mjs';
import { S as Slider } from './slider-DCssR2_R.mjs';
import '@tanstack/router-ssr-query-core';
import '@tanstack/react-devtools';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-dropdown-menu';
import '@tanstack/react-query-devtools';
import 'node:fs';
import 'tiny-invariant';
import 'tiny-warning';
import '@tanstack/router-core';
import '@tanstack/router-core/ssr/client';
import 'node:async_hooks';
import '@modelcontextprotocol/sdk/server/mcp.js';
import 'zod';
import '@modelcontextprotocol/sdk/server/streamableHttp.js';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';
import '@tanstack/react-router/ssr/server';
import '@radix-ui/react-progress';
import '@radix-ui/react-slider';

function VideoPlayer({
  src,
  onProgress,
  onComplete,
  initialProgress = 0,
  className
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      if (initialProgress > 0) {
        video.currentTime = initialProgress / 100 * video.duration;
      }
    };
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = video.currentTime / video.duration * 100;
      onProgress(video.currentTime, progress);
      if (progress >= 90) {
        onComplete();
      }
    };
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercentage = bufferedEnd / video.duration * 100;
        setBuffered(bufferedPercentage);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onComplete();
    };
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onProgress, onComplete, initialProgress]);
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleSeek = (value) => {
    const video = videoRef.current;
    if (!video) return;
    const time = value[0] / 100 * duration;
    video.currentTime = time;
    setCurrentTime(time);
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  const handleVolumeChange = (value) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };
  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("relative group bg-black rounded-lg overflow-hidden", className), onMouseMove: showControlsTemporarily, onMouseEnter: () => setShowControls(true), onMouseLeave: () => isPlaying && setShowControls(false), children: [
    /* @__PURE__ */ jsx("video", { ref: videoRef, src, className: "w-full h-full object-contain", onClick: togglePlay, onLoadStart: () => setIsLoading(true), onCanPlay: () => setIsLoading(false) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-white" }) }),
    /* @__PURE__ */ jsxs("div", { className: cn("absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300", showControls ? "opacity-100" : "opacity-0"), children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "lg", className: "w-16 h-16 rounded-full bg-black/50 text-white hover:bg-black/70", onClick: togglePlay, children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: "h-8 w-8" }) : /* @__PURE__ */ jsx(Play, { className: "h-8 w-8" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/20 rounded-full h-1", children: /* @__PURE__ */ jsx("div", { className: "bg-white/40 h-full rounded-full transition-all duration-300", style: {
            width: `${buffered}%`
          } }) }),
          /* @__PURE__ */ jsx(Slider, { value: [duration > 0 ? currentTime / duration * 100 : 0], onValueChange: handleSeek, max: 100, step: 0.1, className: "relative z-10" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: togglePlay, children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => skipTime(-10), children: /* @__PURE__ */ jsx(SkipBack, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => skipTime(10), children: /* @__PURE__ */ jsx(SkipForward, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: toggleMute, children: isMuted || volume === 0 ? /* @__PURE__ */ jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("div", { className: "w-20", children: /* @__PURE__ */ jsx(Slider, { value: [isMuted ? 0 : volume * 100], onValueChange: handleVolumeChange, max: 100, step: 1 }) })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-mono", children: [
              formatTime(currentTime),
              " / ",
              formatTime(duration)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("select", { value: playbackRate, onChange: (e) => changePlaybackRate(Number(e.target.value)), className: "bg-black/50 text-white text-sm rounded px-2 py-1", children: [
              /* @__PURE__ */ jsx("option", { value: 0.5, children: "0.5x" }),
              /* @__PURE__ */ jsx("option", { value: 0.75, children: "0.75x" }),
              /* @__PURE__ */ jsx("option", { value: 1, children: "1x" }),
              /* @__PURE__ */ jsx("option", { value: 1.25, children: "1.25x" }),
              /* @__PURE__ */ jsx("option", { value: 1.5, children: "1.5x" }),
              /* @__PURE__ */ jsx("option", { value: 2, children: "2x" })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: toggleFullscreen, children: isFullscreen ? /* @__PURE__ */ jsx(Minimize, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Maximize, { className: "h-4 w-4" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function LectureSidebar({
  lectures,
  currentLectureId,
  courseId,
  onLectureSelect
}) {
  return /* @__PURE__ */ jsxs("div", { className: "w-80 bg-card border-r flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(List, { className: "h-5 w-5" }),
      "Course Content"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "p-2", children: lectures.map((lecture, index) => {
      const isActive = lecture.id === currentLectureId;
      return /* @__PURE__ */ jsxs(Link, { to: "/learn/$courseId/$lectureId", params: {
        courseId,
        lectureId: lecture.id
      }, className: cn("flex items-start gap-3 p-3 rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"), onClick: () => onLectureSelect == null ? void 0 : onLectureSelect(lecture.id), children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("div", { className: cn("w-4 h-4 rounded-full border-2 text-xs font-bold flex items-center justify-center", isActive ? "border-primary-foreground text-primary-foreground" : "border-muted-foreground text-muted-foreground"), children: lecture.order_number || index + 1 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h4", { className: cn("font-medium text-sm line-clamp-2", isActive ? "text-primary-foreground" : "text-foreground"), children: lecture.title }),
          lecture.duration_minutes && /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-1 mt-1 text-xs", isActive ? "text-primary-foreground/80" : "text-muted-foreground"), children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxs("span", { children: [
              lecture.duration_minutes,
              "m"
            ] })
          ] })
        ] })
      ] }, lecture.id);
    }) }) })
  ] });
}
function LearnPage() {
  const {
    courseId,
    lectureId
  } = Route$a.useParams();
  const {
    token,
    user
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showSidebar, setShowSidebar] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const {
    data: course,
    isLoading: courseLoading
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => (await api.getCourse(courseId)).data
  });
  const {
    data: lecturesData,
    isLoading: lecturesLoading
  } = useQuery({
    queryKey: ["lectures", courseId],
    queryFn: async () => (await api.listLectures(courseId, {
      page: 1,
      page_size: 200
    })).data
  });
  const {
    data: progressData
  } = useQuery({
    queryKey: ["progress", courseId, lectureId],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await api.getUserProgress(token, courseId, lectureId);
        return res.data;
      } catch {
        return null;
      }
    },
    enabled: !!user && !!token
  });
  const currentLecture = useMemo(() => {
    return lecturesData == null ? void 0 : lecturesData.lectures.find((l) => l.id === lectureId);
  }, [lecturesData, lectureId]);
  const currentIndex = useMemo(() => {
    var _a;
    return (_a = lecturesData == null ? void 0 : lecturesData.lectures.findIndex((l) => l.id === lectureId)) != null ? _a : -1;
  }, [lecturesData, lectureId]);
  const {
    data: video,
    isLoading: videoLoading
  } = useQuery({
    queryKey: ["video", currentLecture == null ? void 0 : currentLecture.video_id],
    queryFn: async () => {
      if (!(currentLecture == null ? void 0 : currentLecture.video_id)) return null;
      const res = await api.getVideo(currentLecture.video_id);
      return res.data;
    },
    enabled: !!(currentLecture == null ? void 0 : currentLecture.video_id)
  });
  const updateProgressMutation = useMutation({
    mutationFn: async ({
      time,
      percentage
    }) => {
      if (!token) return;
      return api.updateProgress(token, {
        course_id: courseId,
        lecture_id: lectureId,
        progress_percentage: percentage,
        watch_time_seconds: Math.floor(time),
        is_completed: percentage >= 90
      });
    }
  });
  const completeLectureMutation = useMutation({
    mutationFn: async () => {
      if (!token) return;
      return api.completeLecture(token, {
        course_id: courseId,
        lecture_id: lectureId,
        watch_time_seconds: Math.floor(watchTime)
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["progress"]
      });
    }
  });
  const handleProgress = (time, percentage) => {
    setWatchTime(time);
    updateProgressMutation.mutate({
      time,
      percentage
    });
  };
  const handleComplete = () => {
    completeLectureMutation.mutate();
  };
  const navigateToLecture = (direction) => {
    if (!(lecturesData == null ? void 0 : lecturesData.lectures)) return;
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < lecturesData.lectures.length) {
      const nextLecture = lecturesData.lectures[newIndex];
      navigate({
        to: "/learn/$courseId/$lectureId",
        params: {
          courseId,
          lectureId: nextLecture.id
        }
      });
    }
  };
  if (courseLoading || lecturesLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Loading course content..." })
    ] }) });
  }
  if (!course || !currentLecture) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-destructive mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Content not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "The course or lecture you're looking for doesn't exist or has been removed." }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/courses", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 mr-2" }),
        "Back to Courses"
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex", children: [
    showSidebar && /* @__PURE__ */ jsx(LectureSidebar, { lectures: (lecturesData == null ? void 0 : lecturesData.lectures) || [], currentLectureId: lectureId, courseId }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-card border-b px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowSidebar(!showSidebar), children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Link, { to: "/courses/$courseId", params: {
              courseId
            }, className: "hover:text-foreground transition-colors", children: course.title }),
            /* @__PURE__ */ jsx("span", { children: "/" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: currentLecture.title })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => navigateToLecture("prev"), disabled: currentIndex <= 0, children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => navigateToLecture("next"), disabled: currentIndex >= ((lecturesData == null ? void 0 : lecturesData.lectures.length) || 0) - 1, children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/courses/$courseId", params: {
            courseId
          }, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 p-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [
        (video == null ? void 0 : video.stream_url) ? /* @__PURE__ */ jsx(VideoPlayer, { src: video.stream_url, onProgress: handleProgress, onComplete: handleComplete, initialProgress: (progressData == null ? void 0 : progressData.progress_percentage) || 0, className: "aspect-video w-full" }) : /* @__PURE__ */ jsx("div", { className: "aspect-video w-full bg-muted rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No Video Available" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "This lecture doesn't have a video yet." })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold font-academic mb-2", children: currentLecture.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground mb-4", children: [
              currentLecture.duration_minutes && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  currentLecture.duration_minutes,
                  " minutes"
                ] })
              ] }),
              progressData && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-success" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  Math.round(progressData.progress_percentage),
                  "% complete"
                ] })
              ] })
            ] }),
            progressData && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Your Progress" }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  Math.round(progressData.progress_percentage),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: progressData.progress_percentage, className: "h-2" })
            ] })
          ] }),
          currentLecture.description && /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-3", children: "About this lecture" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: currentLecture.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs(Button, { onClick: () => completeLectureMutation.mutate(), disabled: completeLectureMutation.isPending, className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
              completeLectureMutation.isPending ? "Marking Complete..." : "Mark Complete"
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/forum", search: {
              course_id: courseId
            }, children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4 mr-2" }),
              "Discuss"
            ] }) }),
            video && /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
              "Resources"
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}

export { LearnPage as component };
//# sourceMappingURL=learn._courseId._lectureId-Dd9Ve5Uf.mjs.map
