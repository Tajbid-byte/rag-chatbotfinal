import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import LoadingSpinner from './LoadingSpinner'

const FileUpload = ({ theme, onUpload, isUploading, uploadProgress }) => {
  const [dragError, setDragError] = useState(null)
  const isDark = theme === 'dark'

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setDragError(null)
    if (rejectedFiles.length > 0) {
      const code = rejectedFiles[0].errors[0].code
      if (code === 'file-too-large') setDragError('File too large. Max 10MB.')
      else if (code === 'file-invalid-type') setDragError('Only PDF files allowed.')
      else setDragError('Invalid file. PDF under 10MB only.')
      return
    }
    if (acceptedFiles.length > 0) {
      try { await onUpload(acceptedFiles[0]) }
      catch (err) { setDragError(err.message) }
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isUploading
  })

  return (
    <div className="p-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? isDark ? 'border-blue-400 bg-blue-500/10' : 'border-blue-400 bg-blue-50'
            : isDark ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-800/40' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }
          ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="space-y-3">
            <div className="flex justify-center"><LoadingSpinner size="md" color="blue" /></div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Processing...</p>
            <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="text-3xl">{isDragActive ? '📂' : '📄'}</div>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {isDragActive ? 'Drop here!' : 'Upload PDF'}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Drag & drop or click</p>
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full
              ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
              PDF · Max 10MB
            </span>
          </div>
        )}
      </div>
      {dragError && (
        <div className={`mt-2 p-2 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>⚠️ {dragError}</p>
        </div>
      )}
    </div>
  )
}

export default FileUpload
