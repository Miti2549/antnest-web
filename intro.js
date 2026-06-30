(function () {
  const introConfig = {
    fullIntroDuration: 8000,
    shortIntroDuration: 1800,
    localStorageKey: "ants_intro_seen_at",
    replayAfterHours: 24
  };

  window.antsIntroConfig = introConfig;

  const HOUR = 60 * 60 * 1000;
  const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

  function readStoredState() {
    try {
      const raw = localStorage.getItem(introConfig.localStorageKey);
      if (!raw) return {};
      if (/^\d+$/.test(raw)) return { seenAt: Number(raw) };
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeStoredState(update) {
    try {
      const current = readStoredState();
      localStorage.setItem(
        introConfig.localStorageKey,
        JSON.stringify({
          ...current,
          ...update
        })
      );
    } catch {
      /* localStorage can be unavailable in private modes. The intro should still close. */
    }
  }

  function shouldSuppressIntro(now) {
    const stored = readStoredState();
    const skippedUntil = Number(stored.skippedUntil || 0);
    return skippedUntil > now;
  }

  function forceIntroRequested() {
    try {
      return new URLSearchParams(window.location.search).get("intro") === "force";
    } catch {
      return false;
    }
  }

  function resolveIntroMode(now, forceIntro) {
    if (window.matchMedia && window.matchMedia(reduceMotionQuery).matches) return "reduced";
    if (forceIntro) return "full";
    const stored = readStoredState();
    const seenAt = Number(stored.seenAt || 0);
    const expired = !seenAt || now - seenAt > introConfig.replayAfterHours * HOUR;
    return expired ? "full" : "short";
  }

  function durationForMode(mode) {
    if (mode === "reduced") return 500;
    if (mode === "short") return introConfig.shortIntroDuration;
    return introConfig.fullIntroDuration;
  }

  function closeIntro(gate, reason) {
    if (!gate || gate.dataset.introState === "closing") return;
    const now = Date.now();
    const update = reason === "skip"
      ? { seenAt: now, skippedAt: now, skippedUntil: now + introConfig.replayAfterHours * HOUR }
      : { seenAt: now, completedAt: now };

    writeStoredState(update);
    try {
      sessionStorage.setItem(`${introConfig.localStorageKey}_session`, "1");
    } catch {
      /* no-op */
    }

    gate.dataset.introState = "closing";
    window.setTimeout(() => {
      gate.remove();
    }, 620);
  }

  function prepareIntroVideos(gate, mode) {
    const videos = gate.querySelectorAll("[data-ants-intro-video]");
    videos.forEach((video) => {
      if (mode === "reduced") {
        video.pause();
        video.removeAttribute("src");
        video.load();
        return;
      }

      video.muted = true;
      video.playsInline = true;
      video.addEventListener("error", () => {
        gate.dataset.videoFailed = "true";
      }, { once: true });

      const playPromise = video.play && video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          gate.dataset.videoFailed = "true";
        });
      }
    });
  }

  function prepareIntroAudio(gate) {
    const audio = gate.querySelector("[data-ants-intro-audio]");
    const soundButton = gate.querySelector("[data-ants-intro-sound]");
    if (!audio || !soundButton) return;

    audio.addEventListener("error", () => {
      gate.dataset.soundState = "failed";
      soundButton.textContent = "Sound unavailable";
      soundButton.disabled = true;
    }, { once: true });

    soundButton.addEventListener("click", async () => {
      try {
        audio.currentTime = 0;
        audio.volume = 0.72;
        await audio.play();
        gate.dataset.soundState = "on";
        soundButton.textContent = "เสียงเปิดอยู่";
      } catch {
        gate.dataset.soundState = "blocked";
        soundButton.textContent = "กดอีกครั้ง";
      }
    });
  }

  function initIntroGate() {
    const gate = document.querySelector("[data-ants-intro-gate]");
    if (!gate) return;

    const now = Date.now();
    const forceIntro = forceIntroRequested();
    if (!forceIntro && shouldSuppressIntro(now)) {
      gate.remove();
      return;
    }

    const mode = resolveIntroMode(now, forceIntro);
    const duration = durationForMode(mode);
    const skipButton = gate.querySelector("[data-ants-intro-skip]");
    const logo = gate.querySelector("[data-ants-intro-logo]");

    gate.dataset.introMode = mode;
    prepareIntroVideos(gate, mode);
    prepareIntroAudio(gate);

    if (logo) {
      logo.addEventListener("error", () => {
        gate.dataset.logoFailed = "true";
      }, { once: true });
    }

    if (skipButton) {
      skipButton.addEventListener("click", () => closeIntro(gate, "skip"));
    }

    window.setTimeout(() => {
      gate.dataset.introState = "active";
    }, 30);

    window.setTimeout(() => closeIntro(gate, "complete"), duration);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIntroGate, { once: true });
  } else {
    initIntroGate();
  }
})();
