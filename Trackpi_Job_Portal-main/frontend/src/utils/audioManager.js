import challengeMusic from "../assets/Talent league/ui ux/challenge music.mp3.mp3";

class AudioManager {
  constructor() {
    this.audio = new Audio(challengeMusic);
    this.audio.loop = true;
    this.isPlaying = false;
    this.isUserMuted = false;
    
    this.listeners = new Set();

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
    });
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isPlaying));
  }

  async play() {
    if (this.isUserMuted) return false;
    
    try {
      await this.audio.play();
      return true;
    } catch (err) {
      console.error("Autoplay prevented:", err);
      return false;
    }
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    if (this.isPlaying) {
      this.isUserMuted = true;
      this.pause();
    } else {
      this.isUserMuted = false;
      this.play();
    }
  }
  
  // Useful for when modals open
  forcePause() {
    this.audio.pause();
  }
  
  // Useful for when modals close
  forceResume() {
    if (!this.isUserMuted) {
      this.play();
    }
  }
}

export const challengeAudio = new AudioManager();
