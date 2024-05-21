# Timbiriche

A multiplayer game of Timbiriche ("dots and boxes"). Built to have some fun using Next.js / React and Firebase.

## Play

You can play the game online here: [play-timbiriche.vercel.app](play-timbiriche.vercel.app).

To quickly test the game by yourself, open the same game url in another browser (or incognito).

## Rules

The gameboard has rooms with four walls:

- Players take turns building a wall
- When a player builds the last wall of room, the player owns that room
- When all rooms are built, the player with the most rooms wins

## Local development

To run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser

## Firebase database

To play the game on your local environment, you need your own Firebase database.

- Create your own free Firebase database on [firebase.google.com](https://firebase.google.com/)
- Add the keys to `.env.local`
- The game will create the data structure on Firebase

# Attribution / credits

Thanks to:

- [mixkit.co](https://mixkit.co) for sound effects
- [udio.com](https://www.udio.com) for generating music
- [svgrepo.com](https://www.svgrepo.com) for svg icons
