# Wumpus World

A web-based implementation of the classic AI game, Wumpus World.

## Overview
This project is built using HTML, CSS, and JavaScript for the frontend and served by a Node.js backend using Express. It is also configured for deployment on Google App Engine.

## Running Locally

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the port specified by your server).

## Deployment
This application includes an `app.yaml` file and can be deployed directly to Google Cloud App Engine using the `gcloud` CLI:

```bash
gcloud app deploy
```
