import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
export async function POST(req) {
  const data = await req.formData();
  const filename = data.get("filename");
  const folder = data.get("folder");
  const file = data.get(filename);

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const byteData = await file.arrayBuffer();
  const buffer = Buffer.from(byteData);

  // Get the current timestamp
  const timestamp = Date.now();

  // Extract the file extension from the original filename
  const originalExtension = file.name.split('.').pop();

  // Construct the new filename using the timestamp and original extension
  const newFilename = `${timestamp}.${originalExtension}`;

  const path = `./public/upload/${folder}/${newFilename}`;
  await writeFile(path, buffer);
  const imageUrl = `/public/upload/${folder}/${newFilename}`;
  return NextResponse.json({ message: "File uploaded", imageUrl: imageUrl}, { status: 200 });
}
