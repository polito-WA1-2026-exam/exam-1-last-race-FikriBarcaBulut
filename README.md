# Exam #1: "Last Race"
## Student: s351771 BULUT FIKRI BARCA
 
## React Client Application Routes
 
- Route `/`: home page. Anonymous users see the game instructions. Authenticated users are redirected to `/game`.
- Route `/login`: login form with username and password. Authenticated users are redirected to `/game`.
- Route `/game`: the full game flow (Setup, Planning, Execution, Result) for authenticated users. All four phases are managed with a single `phase` state without navigating away.
- Route `/ranking`: ranking table showing the best score per registered user. Requires authentication.

## API Server
 
- POST `/api/sessions`
  - request body: `{ username, password }`
  - response: `{ id, username }` on success, `401` on failure
- GET `/api/sessions/current`
  - no parameters
  - response: `{ id, username }` if authenticated, `401` otherwise
- DELETE `/api/sessions/current`
  - no parameters
  - response: `200`
- GET `/api/network`
  - authentication required, no parameters
  - response: `{ stations, lines, lineStations }` — full network data for the Setup phase and server-side validation
- POST `/api/games`
  - authentication required, no body
  - server randomly assigns start and destination (min 3 stops apart), creates a pending game record
  - response: `{ gameId, startStation, destStation, segments, stations }`
- PUT `/api/games/:id`
  - authentication required
  - request body: `{ route: [{ from, to }] }` — ordered list of segments
  - validates the route (start/end stations, valid connections, line changes only at interchanges), applies a random event per segment
  - response: `{ valid: true, steps, finalScore }` or `{ valid: false, reason, finalScore: 0 }`
- GET `/api/ranking`
  - authentication required, no parameters
  - response: `[{ username, bestScore }]` ordered by best score descending

## Database Tables
 
* Table `stations` - id, name
  Stores the unique name of each station in the network.
* Table `lines` - id, name
  Stores the unique name of each metro line.
* Table `lineStations` - lineId, stationId, position
  Join table connecting lines and stations in order. Connections are derived from adjacent positions; interchange stations appear on more than one line.
* Table `events` - id, description, effect
  Random events applied during execution. Effect is an integer from -4 to +4.
* Table `users` - id, username, hashedPassword, salt
  Registered users with scrypt-hashed credentials.
* Table `games` - id, userId, startStationId, destinationStationId, score, status, createdAt
  One row per game. Stores the server-assigned start and destination for route validation. Used for the ranking (best score per user).

## Main React Components
 
- `App` (in `App.jsx`): root component, manages user authentication state and defines the four routes
- `NavBar` (in `NavBar.jsx`): top navigation bar, shows username, ranking link and logout when authenticated
- `InstructionsPage` (in `InstructionsPage.jsx`): game instructions for anonymous users, no network map shown
- `LoginPage` (in `LoginPage.jsx`): login form with client-side validation
- `GamePage` (in `GamePage.jsx`): manages the four game phases via `phase` state, fetches network on mount
- `NetworkMap` (in `NetworkMap.jsx`): network visualisation, shows full lines with colours (`showLines=true`) or station badges only (`showLines=false`)
- `SetupPhase` (in `SetupPhase.jsx`): displays the full network map and the "I'm Ready" button
- `PlanningPhase` (in `PlanningPhase.jsx`): 90-second timer, segment list, route builder with auto-direction detection
- `ExecutionPhase` (in `ExecutionPhase.jsx`): step-by-step display of each segment, random event and coin total
- `ResultPhase` (in `ResultPhase.jsx`): final score and play again option
- `RankingPage` (in `RankingPage.jsx`): fetches and displays the best score per user

## Screenshot
 
![Ranking page](./img/screenshot-ranking.png)
 
![Planning phase during a game](./img/screenshot-game.png)
 
## Users Credentials
 
| Username | Password |
|---|---|
| barca | password |
| nilay | password |
| ender | password |
| askim | password |
| deha | password |

## Use of AI Tools
I used Claude to assist with the frontend side of the project. I had initially built a basic interface on my own but used Claude to improve its visual design and make it more user friendly. I also used it to help format and structure the README file. I reviewed and adapted the generated output to fit my project's needs. For the backend, I relied on course slides and Stack Overflow rather than AI tools.
