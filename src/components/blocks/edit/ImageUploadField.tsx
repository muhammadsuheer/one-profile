'use client'

import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing-client'
import { Input } from '@/components/ui/input'
import { EditField } from '@/components/blocks/edit/field'

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  hint?: string
}) {
  const [error, setError] = useState('')
  const { startUpload, isUploading } = useUploadThing('blockImage', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.serverData?.url
      if (url) onChange(url)
    },
    onUploadError: (e) => setError(e.message || 'Upload failed. Check UPLOADTHING_TOKEN.'),
  })

  return (
    <EditField label={label} hint={hint}>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          placeholder={placeholder ?? 'https://…'}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 text-neutral-500 transition-colors hover:bg-neutral-50"
          title="Upload an image"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setError('')
                void startUpload([file])
              }
            }}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </EditField>
  )
}
