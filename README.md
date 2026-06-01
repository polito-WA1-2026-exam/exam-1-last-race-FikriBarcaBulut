# Exam #1: "Last Race"
## Student: s351771 BULUT FIKRI BARCA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

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
  
  One row per game. Used for the ranking (best score per user).

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

| Username | Password |
|---|---|
| barca | password |
| nilay | password |
| ender | password |
| askim | password |
| deha | password |

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
