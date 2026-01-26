export type WeatherCondition = {
  main: string;
  description: string;
};

export type NormalizedWeather = {
  name: string;
  country?: string;
  temperature?: string;
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg?: number;
  };
};