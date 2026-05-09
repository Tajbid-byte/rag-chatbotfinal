import { useState } from 'react'
import { useChat } from './hooks/useChat'
import { useTheme } from './hooks/useTheme'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    messages, isLoading, isUploading, uploadProgress,
    uploadedDocs, error,
    sendMessage, uploadDocument, clearChat, clearDocuments
  } = useChat()

  return (
    <div className={`flex h-screen overflow-hidden relative ${theme}`}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 md:z-auto h-full
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <Sidebar
          theme={theme}
          uploadedDocs={uploadedDocs}
          onUpload={uploadDocument}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onClearDocs={clearDocuments}
          onClearChat={clearChat}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden min-w-0">
        <ChatWindow
          theme={theme}
          toggleTheme={toggleTheme}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          hasDocuments={uploadedDocs.length > 0}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-xs z-50 animate-slide-up">
          <div className="bg-red-900/90 border border-red-700 rounded-xl p-3 shadow-2xl">
            <p className="text-sm font-semibold text-red-200">Error</p>
            <p className="text-xs text-red-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
