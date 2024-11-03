import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Allowed file types and maximum file size (100 MB)
const ALLOWED_FILE_TYPES = ["application/pdf", "application/zip", "text/html"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { fileName, fileType, fileSize } = await request.json();

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 100 MB limit" },
        { status: 400 }
      );
    }

    // S3 putObject command with presigned URL parameters
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    // Generate the pre-signed URL
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate URL" },
      { status: 500 }
    );
  }
}
