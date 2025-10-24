interface OrbitHallConfig {
  apiKey: string;
  locale?: 'ko' | 'en';
}

interface OrbitHall {
  init: (config: OrbitHallConfig) => void;
  destroy?: () => void;
}

interface Window {
  OrbitHall?: OrbitHall;
}
