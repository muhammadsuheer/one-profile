import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { getCurrentUser } from '@/lib/auth/session'

const f = createUploadthing()

/** UploadThing file router. Only authenticated users may upload block images. */
export const ourFileRouter = {
  blockImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getCurrentUser()
      if (!user) throw new UploadThingError('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
