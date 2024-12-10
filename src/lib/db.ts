import { z } from "zod";
import { env } from "./env";
import { Cloudflare } from "./cloudflare";

// platforms
const SpotifySong = z.object({
  service: z.literal("spotify"),
  type: z.union([
    z.literal("track"),
    z.literal("album"),
    z.literal("playlist"),
    z.literal("artist"),
  ]),
  id: z.string(),
});
export type SpotifySong = z.infer<typeof SpotifySong>;

const SoundcloudSong = z.object({
  service: z.literal("soundcloud"),
  type: z.union([z.literal("user"), z.literal("track"), z.literal("playlist")]),
  id: z.string(),
});
export type SoundcloudSong = z.infer<typeof SoundcloudSong>;

const AppleMusicSong = z.object({
  service: z.literal("applemusic"),
  type: z.union([
    z.literal("artist"),
    z.literal("song"),
    z.literal("album"),
    z.literal("playlist"),
  ]),
  id: z.string(),
});
export type AppleMusicSong = z.infer<typeof AppleMusicSong>;

const Song = z.union([SpotifySong, SoundcloudSong, AppleMusicSong]);
export type Song = z.infer<typeof Song>;

export const UserDataSchema = z.array(Song).max(6);
export type UserData = Song[];

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

export async function getUserData(
  userId: string,
  isExternal?: boolean,
): Promise<ApiUserData | null> {
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
      const newData = oldData.filter((x) => x !== null).slice(0, 6) as UserData;

      const at = new Date().toUTCString();
      if (!isExternal) saveUserData(userId, newData, at);
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
