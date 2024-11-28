# Timbiriche

A multiplayer game of Timbiriche ("dots and boxes"). Built to have some fun using React, Firebase and AI.

## Play

You can play the game online here: [timbiriche-neon.vercel.app](https://timbiriche-neon.vercel.app/).

To test the game by yourself, either:

- open the provided game url in incognito
- play against the AI

## Development

This is just for a bit of fun. For a real game the board would be updated serverside.

## Rules

The gameboard has rooms with four walls:

- Players take turns building a wall
- When a player builds the last wall of room, the player wins a point for that room
- When all rooms are built, the player with the most points wins

## Local development

Check the .env file for required variables. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase database

To play the game on your local environment, you need your own Firebase database.

- Create your own free Firebase database on [firebase.google.com](https://firebase.google.com/)
- Add the keys to `.env.local`
- The game will create the data structure on Firebase

## Open AI

To play against the AI:

- Create your own API key on [platform.openai.com](https://platform.openai.com)
- Add the token and organisation to `.env.local`

# Attribution / credits

Thanks to:

- [mixkit.co](https://mixkit.co) for sound effects
- [svgrepo.com](https://www.svgrepo.com) for svg icons

## Example

### Two players

![Example of two players](https://timbiriche-neon.vercel.app/example-two-players.gif)

### Playing against AI

![Example of two players](https://timbiriche-neon.vercel.app/example-against-ai.gif)
