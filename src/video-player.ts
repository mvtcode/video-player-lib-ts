interface VideoPlayerOptions {
    url: string;
    token?: string;
    autoplay?: boolean;
    muted?: boolean;
  }
  
  // Định nghĩa các event types
  type VideoPlayerEventType = 
    | 'canPlay'
    | 'ready'
    | 'error'
    | 'timeupdate'
    | 'pause'
    | 'play';
  
  class VideoPlayer {
    private video: HTMLVideoElement;
    private container: HTMLElement | null = null;
    private eventListeners: Map<VideoPlayerEventType, Set<Function>> = new Map();
    private options: VideoPlayerOptions;
  
    constructor(options: VideoPlayerOptions) {
      this.options = options;
      this.video = document.createElement('video');
      this.setupVideoElement();
    }
  
    private setupVideoElement() {
      // Cấu hình video element
      this.video.src = this.options.url;
      this.video.crossOrigin = 'anonymous'; // Hỗ trợ CORS
      
      if (this.options.token) {
        // Nếu có token, thêm vào header request
        fetch(this.options.url, {
          headers: {
            'Authorization': `Bearer ${this.options.token}`
          }
        });
      }
  
      // Đăng ký các sự kiện mặc định
      this.video.addEventListener('canplay', () => this.triggerEvent('canPlay'));
      this.video.addEventListener('loadedmetadata', () => this.triggerEvent('ready'));
      this.video.addEventListener('error', () => this.triggerEvent('error'));
      this.video.addEventListener('timeupdate', () => this.triggerEvent('timeupdate'));
      this.video.addEventListener('pause', () => this.triggerEvent('pause'));
      this.video.addEventListener('play', () => this.triggerEvent('play'));
  
      // Tùy chọn autoplay và muted
      this.video.autoplay = this.options.autoplay || false;
      this.video.muted = this.options.muted || false;
    }
  
    // Phương thức inject video vào một target element
    injectTo(target: HTMLElement) {
      this.container = target;
      this.container.appendChild(this.video);
      return this;
    }
  
    // Các phương thức điều khiển video
    play() {
      return this.video.play();
    }
  
    pause() {
      this.video.pause();
    }
  
    destroy() {
      // Xóa tất cả event listeners
      this.eventListeners.forEach((listeners, eventName) => {
        listeners.forEach(listener => {
          this.video.removeEventListener(eventName, listener as EventListener);
        });
      });
  
      // Loại bỏ video khỏi DOM
      if (this.container) {
        this.container.removeChild(this.video);
      }
    }
  
    // Lấy độ dài video
    getDuration(): number {
      return this.video.duration;
    }
  
    // Lấy kích thước video
    getSize(): { width: number, height: number } {
      return {
        width: this.video.videoWidth,
        height: this.video.videoHeight
      };
    }
  
    // Điều chỉnh vị trí video
    seek(time: number) {
      this.video.currentTime = time;
    }
  
    // Điều chỉnh âm lượng
    setVolume(volume: number) {
      this.video.volume = Math.max(0, Math.min(1, volume));
    }
  
    getVolume(): number {
      return this.video.volume;
    }
  
    // Đăng ký sự kiện
    on(eventName: VideoPlayerEventType, callback: Function) {
      if (!this.eventListeners.has(eventName)) {
        this.eventListeners.set(eventName, new Set());
      }
      this.eventListeners.get(eventName)?.add(callback);
      
      // Ánh xạ event
      const eventMap: Record<VideoPlayerEventType, string> = {
        'timeupdate': 'timeupdate',
        'canPlay': 'canplay',
        'ready': 'loadedmetadata',
        'error': 'error',
        'pause': 'pause',
        'play': 'play'
      };
  
      this.video.addEventListener(eventMap[eventName], callback as EventListener);
      return this;
    }
  
    // Trigger event
    private triggerEvent(eventName: VideoPlayerEventType) {
      const listeners = this.eventListeners.get(eventName);
      listeners?.forEach(callback => callback());
    }
  }
  
  // Xuất VideoPlayer để có thể sử dụng như một module
  export default VideoPlayer;
  