import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import LoadingSpinner from './LoadingSpinner'

const ChatWindow = ({ theme, toggleTheme, messages, isLoading, onSendMessage, hasDocuments, onOpenSidebar }) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const isDark = theme === 'dark'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) }
  }

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* Header */}
      <div className={`border-b px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0
        ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>

        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger - mobile only */}
          <button
            onClick={onOpenSidebar}
            className={`md:hidden p-2 rounded-lg text-lg flex-shrink-0
              ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            aria-label="Open menu"
          >☰</button>

          <div className="min-w-0">
            <h2 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Document Assistant
            </h2>
            <p className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${hasDocuments ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="hidden sm:inline">{hasDocuments ? 'Ready — ask anything!' : 'Upload a PDF to start'}</span>
              <span className="sm:hidden">{hasDocuments ? 'Ready' : 'Upload PDF'}</span>
            </p>
          </div>
        </div>

        {/* Right: badges + dark mode toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`hidden sm:inline px-2 py-1 text-xs rounded-full border font-medium
            ${isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-600 border-green-200'}`}>
            FREE
          </span>
          <span className={`hidden sm:inline px-2 py-1 text-xs rounded-full border font-medium
            ${isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
            RAG
          </span>
          {/* Dark/Light toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors
              ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} theme={theme} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">
              🤖
            </div>
            <div className={`rounded-2xl px-4 py-3 border
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" color={isDark ? 'purple' : 'blue'} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-3 sm:p-4 flex-shrink-0
        ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasDocuments ? 'Ask about your document...' : 'Upload a PDF first...'}
            disabled={isLoading}
            className={`flex-1 border rounded-xl px-4 py-3 text-sm
              focus:outline-none focus:ring-2 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isDark
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'}`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-base transition-all flex-shrink-0
              ${input.trim() && !isLoading
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow'
                : isDark ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {isLoading ? <LoadingSpinner size="sm" color="white" /> : '➤'}
          </button>
        </form>
        <p className={`text-xs text-center mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

export default ChatWindow
