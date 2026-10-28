# ✈️ TripWise – AI-Powered Travel Planner

TripWise is an AI-powered travel planning application that helps users create personalized travel itineraries based on their destination, budget, travel dates, number of travelers, and travel preferences.

The application generates day-wise travel plans with recommended places, estimated expenses, packing suggestions, and useful travel tips. It also features an interactive map to explore destinations and view places according to each day of the trip.

## ✨ Features

- **AI-Powered Itinerary Generation** – Generate personalized travel plans using AI.
- **Day-Wise Travel Planning** – Organize activities into morning, afternoon, and evening schedules.
- **Dynamic Map Markers** – Display AI-generated places on an interactive map.
- **Day Filters** – View all places together or filter map markers by individual travel days.
- **Interactive Map Popups** – Click markers to view place names and their corresponding days.
- **Budget Visualization** – View a visual breakdown of estimated travel expenses.
- **Packing Checklist** – Get packing suggestions for your trip.
- **Travel Tips** – Receive useful recommendations for your destination.
- **Regenerate Daily Plans** – Regenerate an individual day's itinerary.
- **Responsive UI** – Built with Material UI for a clean and user-friendly interface.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- React Hook Form
- Zod
- React Query
- Leaflet and React Leaflet

**Backend**
- Node.js
- Express.js
- OpenRouter API for AI-powered itinerary generation

**Maps and Geocoding**
- Leaflet
- OpenStreetMap
- Nominatim Geocoding API

## 📁 Project Structure

```text
TripWise/
├── server/
│   ├── index.js
│   └── .env
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── schemes/
│   ├── services/
│   ├── types/
│   └── utils/
├── public/
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- pnpm
- API key for OpenRouter

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd travel-planner
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Keep API keys private. Never commit `.env` files to GitHub.

### 4. Start the backend

Open a terminal and run:

```bash
cd server
node index.js
```

### 5. Start the frontend

Open a separate terminal in the project root and run:

```bash
pnpm dev
```

Open the local URL displayed by Vite in your browser.

## 🗺️ Interactive Map

TripWise uses Leaflet and OpenStreetMap to display dynamically generated travel destinations.

Users can:
- View multiple places on the map.
- Filter markers by travel day.
- Click markers to see place names and day information.
- Explore the destinations included in their itinerary.

## 🔐 Security

- API keys are stored in backend environment variables.
- Sensitive environment files should be excluded from version control.
- AI requests are handled through the backend.

## 🌱 Future Enhancements

- Road-based route planning between destinations.
- Distance and travel-time estimates between places.
- Improved map navigation and route visualization.
- More personalized recommendations.

## 👩‍💻 Author

Developed as a personal project to explore AI integration, full-stack development, and interactive travel planning.

---

**TripWise – Plan smarter. Travel better. ✈️**
