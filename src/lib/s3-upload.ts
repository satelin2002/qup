// lib/s3-upload.ts

export const fetchPresignedUrl = async (file: File, subdomain: string) => {
  const response = await fetch("/api/s3-presigned-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: `${subdomain}/${file.name}`,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get presigned URL");
  }

  const { url } = await response.json();
  return url;
};

export const uploadFileToS3 = async (file: File, url: string) => {
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
};
