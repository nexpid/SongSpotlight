import { z } from "zod";
import { env } from "./env";
import { Cloudflare } from "./cloudflare";

export const UserDataSchema = z.array(
  z.object({
    service: z.enum(["spotify", "soundcloud", "applemusic"]),
    type: z.enum(["track", "album", "playlist", "artist"]),
    id: z.string(),
  }),
);
export type UserData = z.infer<typeof UserDataSchema>;

export type ApiUserData = {
  data: UserData;
  at: string;
};

type v1UserData = ({
  service: string;
  type: string;
  id: string;
} | null)[];

export async function sql<DataStructure>(
  query: string,
  params: string[],
): Promise<DataStructure> {
  return (
    await new Cloudflare(
      env.CLOUDFLARE_D1_BEARER_TOKEN,
      env.CLOUDFLARE_ACCOUNT_ID,
    ).d1(env.CLOUDFLARE_D1_DATABASE_ID, { sql: query, params })
  )[0].results[0] as any;
}

export async function saveUserData(userId: string, data: UserData, at: string) {
  await sql(
    "insert or replace into data (user, version, songs, at) values (?, ?, ?, ?)",
    [userId, "2", JSON.stringify(data), at],
  );
}

export async function deleteUserData(userId: string) {
  await sql("delete from data where user = ?", [userId]);
}

export async function getUserData(userId: string): Promise<ApiUserData | null> {
  const data = await sql<{
    user: string;
    version: number;
    songs: string;
    at: string | null;
  } | null>("select * from data where user = ?", [userId]);
  if (!data) return null;

  if (data.version === 1) {
    try {
      const oldData = JSON.parse(data.songs) as v1UserData;
      const newData = oldData.filter((x) => x !== null) as UserData;

      const at = new Date().toUTCString();
      saveUserData(userId, newData, at);
      return { data: newData, at };
    } catch (e) {
      throw new Error(`Failed to migrate your data to v2: ${e.message}`);
    }
  } else
    return {
      data: JSON.parse(data.songs),
      at: data.at ?? new Date().toUTCString(),
    };
}
