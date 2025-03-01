// This API receives a grid and returns a choice made by Open AI.
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data: { grid: Room[] } = await req.json();

  if (!data.grid) {
    return Response.json({ error: "No game data provided" });
  }

  // The AI doesn't always guess a proper move. Try several times.
  for (let i = 0; i < 5; i++) {
    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "OpenAI-Organization": `${process.env.OPENAI_ORGANISATION}`,
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(openAiPayload(data.grid)),
      }
    );

    const openAiData = await openAiResponse.json();

    // Check if the answer by openAI is possible
    const choice = checkAnswer(
      openAiData?.choices?.[0].message?.content,
      data.grid
    );

    // Return a valid choice
    if (choice) {
      return Response.json({ data: choice });
    }
  }

  // Return a failure
  return Response.json({ error: "AI did not generate proper response" });
}

// Check if the answer chosen by the AI is valid
const checkAnswer = (data: string, gameboard: Gameboard) => {
  try {
    const choice: { id: string; side: Side } = JSON.parse(data);

    const chosenRoom = gameboard.find((room) => room.id === choice.id);

    // Valid choice
    if (chosenRoom?.[choice.side] === "") {
      return choice;
    }

    // Choice was not valid
    return undefined;
  } catch (e: unknown) {
    console.error(e);
    return undefined;
  }
};

// Simplify the gameboard data for Open AI
const simplifyData = (grid: Gameboard) =>
  grid.map((room) => ({
    id: room.id,
    top: room.top ? "built" : "",
    right: room.right ? "built" : "",
    bottom: room.bottom ? "built" : "",
    left: room.left ? "built" : "",
    wallsBuilt:
      0 +
      Number(!!room.top) +
      Number(!!room.right) +
      Number(!!room.bottom) +
      Number(!!room.left),
  }));

// OpenAI schema and prompt
const openAiPayload = (grid: Gameboard) => ({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content:
        "You are a bot playing a game, you will receive an array of rooms. Each room has 4 walls. First always a room that has 'wallsBuilt:3', else 'wallsBuilt:1', else 'wallsBuilt:0', or as a last choice 'wallsBuilt:2'. You can never choose a side (top,right,bottom,left) that is already built.",
    },
    {
      role: "user",
      content: JSON.stringify(simplifyData(grid)),
    },
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "wall_choice",
      strict: true,
      schema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The id of the chosen room",
          },
          side: {
            type: "string",
            description: "Which wall of the room to build",
            enum: ["top", "right", "bottom", "left"],
          },
        },
        required: ["id", "side"],
        additionalProperties: false,
      },
    },
  },
});
