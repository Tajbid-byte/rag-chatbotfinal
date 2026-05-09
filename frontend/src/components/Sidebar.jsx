import FileUpload from './FileUpload'

const Sidebar = ({ theme, uploadedDocs, onUpload, isUploading, uploadProgress, onClearDocs, onClearChat, onClose }) => {
  const isDark = theme === 'dark'

  return (
    <div className={`w-72 flex flex-col h-full border-r flex-shrink-0
      ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between
        ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg shadow">
            🤖
          </div>
          <div>
            <h1 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>RAG Chatbot</h1>
            <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Groq AI · Free
            </p>
          </div>
        </div>
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className={`md:hidden p-1.5 rounded-lg text-xl
            ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
          aria-label="Close sidebar"
        >✕</button>
      </div>

      {/* Upload */}
      <FileUpload theme={theme} onUpload={onUpload} isUploading={isUploading} uploadProgress={uploadProgress} />

      {/* Documents */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {uploadedDocs.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-semibold uppercase tracking-wider
                ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Documents</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                {uploadedDocs.length}
              </span>
            </div>
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className={`rounded-lg p-3 border
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">📕</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {doc.filename}
                    </p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {doc.chunks} chunks
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-4xl mb-2 opacity-30">📂</div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No documents yet</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Upload a PDF above</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`p-3 border-t space-y-2 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        {uploadedDocs.length > 0 && (
          <button onClick={onClearDocs}
            className={`w-full text-xs px-3 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium border
              ${isDark
                ? 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-800/40'
                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'}`}>
            🗑️ Clear All Documents
          </button>
        )}
        <button onClick={onClearChat}
          className={`w-full text-xs px-3 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium border
            ${isDark
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200'}`}>
          💬 Clear Chat
        </button>
        <p className={`text-xs text-center pt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          ⚡ Llama 3.1 70B
        </p>
      </div>
    </div>
  )
}

export default Sidebar
