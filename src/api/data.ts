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

    return parsed.data;
  }),
  async (c) => {
    const data = c.req.valid("json");

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
