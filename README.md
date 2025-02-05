# PWA 2D Snake Game

This is a Progressive Web Application (PWA) implementation of the classic 2D Snake Game.

## Features

- Offline support using Service Workers
- Push notifications
- Simple and intuitive UI
- High score tracking

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ilhandag1/snake-game.git
    ```
2. Navigate to the project directory:
    ```sh
    cd snake-game
    ```
3. Install dependencies (if any):
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Service Worker

The service worker is responsible for caching assets and enabling offline functionality. It also handles push notifications.

## Database Design

The database design includes the following tables:
- **Users**: Stores user information.
- **GameSessions**: Stores information about game sessions.
- **Scores**: Stores scores for each game session.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.