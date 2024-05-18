const audioTypes = {
  "build-wall": "sfx-2925.mp3",
  "build-room": "sfx-2313.mp3",
  "music-1": "music-fiesta-quest.mp3",
  "lost-game": "sfx-2042.mp3",
  "won-game": "sfx-2063.mp3",
  "start-game": "sfx-2041.mp3",
  "new-player": "sfx-605.mp3",
  button: "sfx-2358.mp3",
};

type AudioFile = keyof typeof audioTypes;

/**
 * Play a sound
 *
 * @param type what type of sound should be played
 * @param volume optional volume, for example 0.5
 */
export const playSound = (type: AudioFile, volume?: number) => {
  let audio = new Audio(`/sound/${audioTypes[type]}`);

  audio.volume = volume || 1;

  audio.play();
};

/**
 * Play music on repeat
 * Chrome requires interaction before it allows sound
 */
export const playMusic = () => {
  let audio = new Audio(`/sound/${audioTypes["music-1"]}`);
  audio.volume = 0.2;

  audio.addEventListener("canplaythrough", () => {
    audio.play();

    // Replay music
    setTimeout(() => {
      audio.currentTime = 0;
      audio.play();
    }, audio.duration * 1000);
  });
};
