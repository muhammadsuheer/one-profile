'use client'

import { useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Upload, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label?: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  hint?: string
}) {
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function uploadFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const blob = await upload(safeName, file, {
        access: 'public',
        handleUploadUrl: '/api/blob/upload',
      })
      onChange(blob.url)
    } catch (e) {
      const msg = (e as Error).message || ''
      // Never surface raw provider/config internals to the user.
      if (/token|unauthorized|forbidden|blob_read_write|not.*found|store/i.test(msg)) {
        setError('Image uploads aren’t set up yet — paste an image URL instead.')
      } else if (/size|large|big|maximum/i.test(msg)) {
        setError('That image is too large (max 4 MB).')
      } else {
        setError('Couldn’t upload that image. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const control = (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!dragging) setDragging(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void uploadFile(e.dataTransfer.files?.[0])
        }}
        className="relative flex items-center gap-2"
      >
        <Input
          value={value}
          placeholder={placeholder ?? 'https://…'}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50/80 text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700"
          title="Upload or drag an image"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void uploadFile(e.target.files?.[0] ?? undefined)}
          />
        </label>

        {dragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#F5124A] bg-[#F5124A]/[0.06] text-sm font-medium text-[#F5124A]">
            <Upload className="h-4 w-4" /> Drop image to upload
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </>
  )

  if (!label) return <div>{control}</div>
  return (
    <EditField label={label} hint={hint}>
      {control}
    </EditField>
  )
}
