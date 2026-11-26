import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { cloudinaryFiles } from "./cloudinary-loader";

export async function mediaFiles(directory) {
  const local = await readdir(join(cwd(), "public", directory)).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  return [...new Set([...local, ...cloudinaryFiles(directory)])].sort();
}
