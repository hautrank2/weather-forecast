# Weather Forecast Application - README

## 🌦️ Overview

This project is a **Weather Forecast Web Application** built using **Angular**. It allows users to search for weather information in different cities. The application is designed with a clean UI and integrates with external APIs to fetch weather data.

Result: https://weather-forecast-35f17.web.app/
## 🚀 Features

- View weather informations: temperature, humidity, cloudiness, visibility, UV, precipitation and wind speed.
- Today's temperature chart: display temperatures from 00 to 23h
- Today's weather condition: display weather situation by hours
- Weather for the next 4 days

## 🚀 Non-features

- **Search for city weather**: Users can search for weather information by entering a city name.
- **Temperature unit toggle**: Switch between Celsius (°C) and Fahrenheit (°F).
- **Autocomplete city suggestions**: Provides city suggestions while typing.
- **Light and Dark mode**: User can switch between light and dark mode.

## 📌 Technologies Used

| Technology                       | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| **Angular**                      | Frontend framework                       |
| **weatherapi**                   | Fetches weather data                     |
| **RxJS (Observable)**            | Handles asynchronous API calls           |
| **NgRx**                         | State management (optional)              |
| **Taiga**                        | UI components (cards, tables, dialogs)   |
| **Echart**                       | Charts components                        |
| **Firebase**                     | Hosting app                              |

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- Angular CLI installed (`npm install -g @angular/cli`)

### Installation Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/hautrank2/weather-forecast
   cd weather-forecast
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Obtain an API key from [weatherapi](https://www.weatherapi.com/docs/#intro-request).
4. Create an `/enviroment.ts` file and add:
   ```sh
   API_KEY=your_openweathermap_api_key
   ```
5. Run the application:
   ```sh
   ng serve
   ```
6. Open the browser and go to `http://localhost:4200/`.
