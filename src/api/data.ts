import {
  getUserData,
  saveUserData,
  deleteUserData,
  UserDataSchema,
} from "src/lib/db";
import { getUser } from "src/lib/auth";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { HttpStatus } from "src/lib/http-status";
import { validateSong } from "src/lib/songs/validate";

const data = new Hono<{ Bindings: Env }>();

const DISCORD_EPOCH = 1420070400000;

data.get("/", async function getData(c) {
  const user = await getUser(c.req.header("Authorization"));
  if (!user) return c.text("Unauthorized", HttpStatus.UNAUTHORIZED);

  try {
    const data = await getUserData(user.userId);

    c.header("Last-Modified", data?.at);
    return c.json(data?.data || null);
  } catch (e) {
    return c.text(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

data.get("/:id", async function listData(c) {
  const id = c.req.param("id");

  // validate snowflake based on https://github.com/vegeta897/snow-stamp/blob/8908d48bcee4883a7c4146bb17aa73b73a9009ba/src/convert.js
  if (!Number.isInteger(+id))
    return c.text("User ID is not a valid snowflake", HttpStatus.BAD_REQUEST);

  const snowflake = BigInt(id) >> 22n;
  if (snowflake < 2592000000n)
    return c.text("User ID is not a valid snowflake", HttpStatus.BAD_REQUEST);

  const biggest = BigInt(Date.now() - DISCORD_EPOCH) << 22n;
  if (snowflake > biggest)
    return c.text("User ID is not a valid snowflake", HttpStatus.BAD_REQUEST);

  if (Number.isNaN(new Date(Number(snowflake) + DISCORD_EPOCH).getTime()))
    return c.text("User ID is not a valid snowflake", HttpStatus.BAD_REQUEST);

  try {
    const data = await getUserData(id, true);

    c.header("Last-Modified", data?.at);
    return c.json(data?.data || null);
  } catch (e) {
    return c.text(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

// saveData
data.put(
  "/",
  validator("json", (value, c) => {
    const parsed = UserDataSchema.safeParse(value);
    if (parsed.error)
      return c.text(parsed.error.toString(), HttpStatus.BAD_REQUEST);

    return parsed.data.filter((x, i, a) => !a.slice(0, i).includes(x));
  }),
  async function saveData(c) {
    const data = c.req.valid("json");

    const allValidated = await Promise.all(
      data.map((song) => validateSong(song)),
    );
    if (!allValidated.every((x) => x === true))
      return c.json(allValidated.map((valid, i) => [valid, data[i]]));

    const user = await getUser(c.req.header("Authorization"));
    if (!user) return c.text("Unauthorized", HttpStatus.UNAUTHORIZED);

    try {
      await saveUserData(user.userId, data, new Date().toUTCString());
      return c.json(true);
    } catch (e) {
      return c.text(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  },
);

data.delete("/", async function deleteData(c) {
  const user = await getUser(c.req.header("Authorization"));
  if (!user) return c.text("Unauthorized", HttpStatus.UNAUTHORIZED);

  try {
    await deleteUserData(user.userId);
    return c.json(true);
  } catch (e) {
    return c.text(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

export default data;
