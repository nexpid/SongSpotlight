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

// getData
data.get("/", async (c) => {
  const user = await getUser(c.req.header("Authorization"));
  if (!user) return c.text("Unauthorized", HttpStatus.UNAUTHORIZED);

  try {
    const data = await getUserData(user.userId);

    c.header("Last-Modified", data?.at);
    return c.json(data?.data);
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
  async (c) => {
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

// deleteData
data.delete("/", async (c) => {
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
