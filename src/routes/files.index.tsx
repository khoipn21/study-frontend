import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/files/')({
  component: FilesPage,
})

function FilesPage() {
  const { token } = useAuth()
  const qc = useQueryClient()
  const files = useQuery({
    queryKey: ['files'],
    queryFn: async () => await api.listFiles(token || '', { page: 1, limit: 20 }),
    enabled: !!token,
  })

  const upload = useMutation({
    mutationFn: async (fd: FormData) => api.uploadFile(token || '', fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files'] }),
  })

  const del = useMutation({
    mutationFn: async (fileId: string) => api.deleteFile(token || '', fileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files'] }),
  })

  const onUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    upload.mutate(fd)
    e.currentTarget.reset()
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Files</h1>
      <form onSubmit={onUpload} className="flex items-center gap-2 mb-4">
        <input type="file" name="file" required />
        <select name="bucket" className="border p-1 rounded">
          <option value="general">general</option>
          <option value="avatars">avatars</option>
          <option value="course-assets">course-assets</option>
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" name="is_public" value="true" /> Public
        </label>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" disabled={upload.isPending}>
          {upload.isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      <ul className="divide-y bg-white rounded border">
        {files.data?.files?.map((f: any) => (
          <li key={f.file_id || f.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{f.filename || f.name}</p>
              <p className="text-xs text-gray-600">{f.content_type} • {Math.round((f.size || 0) / 1024)} KB</p>
            </div>
            <button className="text-red-600" onClick={() => del.mutate(f.file_id || f.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
