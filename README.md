# 🚑 RapAid: Rapid Response & Aid Coordination



**[ 🚀 View Live Demo ](https://disaster-relief-hub.vercel.app/)**

-----

## 🎯 The Problem

In many regions, communication during localized emergencies—like flash floods, heatwaves, or industrial incidents—is often fragmented. Information is slow to travel, and citizens lack a single, reliable platform to receive alerts, find safe zones, or request immediate help. **RapAid** aims to bridge this gap by creating a unified digital ecosystem for community safety and rapid response.

## 📜 Table of Contents

  - [Core Features](https://www.google.com/search?q=%23-core-features)
  - [Tech Stack](https://www.google.com/search?q=%23-tech-stack--tools)
  - [Architecture Overview](https://www.google.com/search?q=%23-architecture-overview)
  - [Getting Started](https://www.google.com/search?q=%23-getting-started)
  - [How to Contribute](https://www.google.com/search?q=%23-how-to-contribute)
  - [License](https://www.google.com/search?q=%23-license)
  - [Acknowledgements](https://www.google.com/search?q=%23-acknowledgements)

-----

## ✨ Core Features

  - **📢 Real-Time Alerts:** Push notifications for weather warnings from the IMD (Indian Meteorological Department), local incident reports, and official government advisories.
  - **🆘 One-Tap SOS:** An emergency button that broadcasts a user's location and help request to nearby registered volunteers and emergency services.
  - **🗺️ Interactive Safety Map:** A live map showing relief centers, hospitals, police stations, fire stations, and user-reported hazards.
  - **🤝 Volunteer Network:** A portal for citizens to register as volunteers, receive training materials, and get alerted to nearby incidents where their help is needed.
  - **📦 Resource Locator:** Helps users find and check the availability of essential resources like clean water, first-aid, and shelter during a crisis.
  - **📚 Knowledge Base:** A section with multilingual safety guides, best practices, and emergency contact lists for various scenarios.

-----

## 🛠️ Tech Stack & Tools

This project is built using a modern, scalable technology stack.

  - **Frontend:** React.js, Vite, TypeScript, Tailwind CSS
  - **State Management:** Redux Toolkit
  - **Mapping:** Leaflet / Mapbox
  - **Backend & DB:** Firebase (Authentication, Firestore, Cloud Functions)
  - **Notifications:** Firebase Cloud Messaging (FCM)
  - **Deployment:** Vercel / Netlify (Frontend), Firebase Hosting
  - **Code Quality:** ESLint, Prettier

-----

## 🏗️ Architecture Overview

*(Optional, but highly recommended for complex projects)*

The application uses a client-server architecture with Firebase acting as the Backend-as-a-Service (BaaS).

1.  **Client (React App):** Handles all UI/UX. Interacts with Firebase services directly for authentication, data fetching (Firestore), and real-time updates.
2.  **Firebase Auth:** Manages user registration, login, and role-based access (User, Volunteer, Admin).
3.  **Firestore:** A NoSQL database storing user data, incident reports, resource locations, and volunteer information.
4.  **Firebase Cloud Functions:** Used for server-side logic, such as sending out notifications via FCM when an SOS is triggered or a new official alert is published.

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:

  - Node.js (v18.x or higher)
  - npm or yarn
  - Git

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/rapaid.git
    ```

2.  **Navigate into the project folder:**

    ```bash
    cd rapaid
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Set up your environment variables:**

      - Create a file named `.env.local` in the root of the project.
      - Add your Firebase project configuration and any other API keys.

    <!-- end list -->

    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY="YOUR_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
    VITE_FIREBASE_APP_ID="YOUR_APP_ID"

    # Mapbox/Leaflet API Key
    VITE_MAPBOX_TOKEN="YOUR_MAPBOX_PUBLIC_TOKEN"
    ```

    *Note: Using the `VITE_` prefix is necessary for Vite to expose these variables to the client-side code.*

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

-----

## 🤝 How to Contribute

Contributions are the lifeblood of open source. We welcome any contributions that improve the platform for our communities.

1.  **Fork the Project.**
2.  **Create a new branch** for your feature or bug fix (`git checkout -b feature/NewFeature` or `fix/BugName`).
3.  **Make your changes** and commit them with a descriptive message (`git commit -m 'Add some amazing new feature'`).
4.  **Push your branch** to your fork (`git push origin feature/NewFeature`).
5.  **Open a Pull Request** against our `main` branch.

Please ensure your code follows our style guidelines and that all tests pass.


-----

## 🙏 Acknowledgements

  - Open-source libraries that made this project possible.
  - Inspiration from disaster management portals across the globe.
