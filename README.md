# VetCareUI

VetCareUI is the frontend of the VetCare veterinary management system. It is a modern React-based web application built with Vite, providing a responsive UI to manage veterinary clinic operations.

## 🧩 Overview

* Built with **React** and **Vite**
* Interfaces with the **VetCareBE** RESTful API
* Deployed on **Vercel**
* Supports CRUD operations for Customers, Doctors, Animals, Appointments, and Vaccines

## 🔧 Technologies

* React
* Vite
* Axios
* React Icons
* React Toastify
* Tailwind CSS or custom styles (depending on setup)

## 📂 Project Structure

```
VetCareUI/
├── src/
│   ├── components/          # Feature components
│   ├── assets/              # Static files like cities.js, styles
│   ├── App.jsx              # Main app router
│   └── main.jsx             # Entry point
├── .env                    # API base URL config
├── package.json            # Project dependencies
```

## 🔑 .env Configuration

The frontend reads its API endpoint from a `.env` file.

### Local development:

```env
VITE_APP_BASE_URL=http://localhost:8080
```

### Production (Vercel):

```env
VITE_APP_BASE_URL=https://vetcarebe.onrender.com
```

> Be sure to restart the dev server after changing `.env`.

## 🧪 Running Locally

### Prerequisites:

* Node.js 16+
* npm or yarn

### Steps:

```bash
git clone https://github.com/ayseerarslan/VetCareUI.git
cd VetCareUI
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🌐 Deployment

VetCareUI is deployed on **[Vercel](https://vercel.com/)**. It fetches data from the Render-hosted backend (VetCareBE).

---

## 🚦 E2E Tests (Selenium)

This repo contains a basic set of Selenium-based smoke tests.

To run:

```bash
npm run test:e2e
```

Make sure the frontend is running locally and accessible.

