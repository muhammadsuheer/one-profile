import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'

/**
 * Client-upload handler for Vercel Blob. The browser uploads the file directly
 * to Blob storage (bypassing the serverless body limit); this route only issues
 * a short-lived, scoped upload token — and only to authenticated users.
 * Reads BLOB_READ_WRITE_TOKEN from the environment (auto-injected on Vercel).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const user = await getCurrentUser()
        if (!user) throw new Error('Unauthorized')
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif',
          ],
          maximumSizeInBytes: 4 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id }),
        }
      },
      onUploadCompleted: async () => {
        // Vercel pings this after upload; the client already has the URL, so no-op.
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
