# Weather Forecast Application - README

## 🌦️ Overview

This project is a **Weather Forecast Web Application** built using **Angular**. It allows users to search for weather information in different cities, view real-time weather data, and get a 5-day weather forecast. The application is designed with a clean UI and integrates with external APIs to fetch weather data.

## 🚀 Features

### ✅ Basic Features

- **Search for city weather**: Users can search for weather information by entering a city name.
- **Current weather details**: Displays temperature, weather conditions, humidity, and wind speed.
- **Temperature unit toggle**: Switch between Celsius (°C) and Fahrenheit (°F).
- **Autocomplete city suggestions**: Provides city suggestions while typing.

### 🔥 Advanced Features

- **5-day weather forecast**: View future weather predictions.
- **Live weather map integration**: Displays weather conditions on a map.
- **User location detection**: Automatically fetches weather data based on user’s geolocation.
- **Dark Mode / Light Mode**: Toggle between different themes for better UI experience.
- **Save favorite cities**: Users can save and quickly access weather information of their favorite locations.
- **Extreme weather alerts**: Notifies users about upcoming severe weather conditions.
- **Historical weather data**: Allows users to check past weather trends.
- **Progressive Web App (PWA) Support**: Enables offline functionality.

## 📌 Technologies Used

| Technology                       | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| **Angular**                      | Frontend framework                       |
| **OpenWeatherMap API**           | Fetches real-time weather data           |
| **RxJS (Observable)**            | Handles asynchronous API calls           |
| **NgRx**                         | State management (optional)              |
| **Angular Material**             | UI components (cards, tables, dialogs)   |
| **Leaflet.js / Google Maps API** | Displays weather maps                    |
| **Firebase / Supabase**          | Stores user preferences & authentication |
| **PWA (Progressive Web App)**    | Enables offline access                   |

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- Angular CLI installed (`npm install -g @angular/cli`)

### Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/weather-app.git
   cd weather-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Obtain an API key from [OpenWeatherMap](https://openweathermap.org/api).
4. Create an `.env` file and add:
   ```sh
   API_KEY=your_openweathermap_api_key
   ```
5. Run the application:
   ```sh
   ng serve
   ```
6. Open the browser and go to `http://localhost:4200/`.

## 📜 API Integration

The application fetches weather data using OpenWeatherMap API:

```ts
const API_KEY = "your_api_key";
const CITY = "Hanoi";
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
```

Example JSON response:

```json
{
  "weather": [{ "description": "clear sky" }],
  "main": { "temp": 30, "humidity": 70 },
  "wind": { "speed": 2.5 }
}
```

## 🛠️ Future Enhancements

- [ ] Add hourly weather forecast.
- [ ] Implement a more advanced caching system.
- [ ] Improve UI/UX with animations.
- [ ] Add more weather API providers for better accuracy.

## 📌 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-new-feature`.
3. Commit changes: `git commit -m "Add new feature"`.
4. Push the branch: `git push origin feature-new-feature`.
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 📩 Contact

For any issues or suggestions, feel free to create an issue on GitHub or contact me at `your-email@example.com`. 🚀
