# Pyroath

An event tracker for Punishing: Gray Raven and Wuthering Waves.<br>
Preceded by [PGRNow](https://pgrnow.github.io)

## Features

-   **Event timers**: ongoing and upcoming events with live countdowns and progress, plus a searchable archive of past events.
-   **Patch timeline**: a scrollable calendar of the current patch's banners, events and double drops, with a marker for today.
-   **Server time**: current server time, your local reset time and a countdown to the next daily reset. Wuthering Waves supports the America, Asia, Europe and SEA servers.
-   **Local time**: optionally show every event time in your own timezone.
-   **Add to calendar**: download any ongoing or upcoming event as an `.ics` file for Google Calendar, Apple Calendar or Outlook.
-   **Tools**:
    -   Wuthering Waves: Union Level calculator, and a Resonator ascension and Forte material calculator.
    -   Punishing: Gray Raven: S-Rank shard simulator and a link to PGR TL;DR Indonesia.
    -   Calculator inputs are remembered between visits.
-   **Light and dark themes**: follows your system setting, or pick one from the header.
-   Works on phones and desktops, and every control can be used with a keyboard.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (version 20.x or higher)
-   [npm](https://www.npmjs.com/)

### Installation & Running Locally

1.  Clone the repository:
    ```sh
    git clone https://github.com/ppyroath/ppyroath.github.io.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd ppyroath.github.io
    ```
3.  Install dependencies:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```

### Building

```sh
npm run build
```

The production build is written to `dist/`. Preview it locally with `npm run preview`.

## Built With

-   [Vue 3](https://vuejs.org/) and [Vue Router](https://router.vuejs.org/)
-   [Vite](https://vite.dev/)
-   [Day.js](https://day.js.org/) for time and timezone handling
