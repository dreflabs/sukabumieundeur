import { NextResponse } from 'next/server';
import { verifyServerActionAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Basic Authentication Check
    await verifyServerActionAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, message: "File exceeds maximum size of 5MB." }, { status: 400 });
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Sanitize and create filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${originalName}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // directory already exists or cannot be created (handled by write)
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
  }
}
