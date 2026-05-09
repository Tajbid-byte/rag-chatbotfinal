import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MessageBubble = ({ message, theme }) => {
  const isUser = message.role === 'user'
  const isError = message.isError
  const isDark = theme === 'dark'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className="max-w-[90%] sm:max-w-[80%]">
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

          {/* Avatar */}
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0
            ${isUser
              ? 'bg-blue-600'
              : isError
                ? 'bg-red-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
            {isUser ? '👤' : '🤖'}
          </div>

          {/* Bubble */}
          <div className={`rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm
            ${isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : isError
                ? isDark
                  ? 'bg-red-900/30 border border-red-800/50 text-red-200'
                  : 'bg-red-50 border border-red-200 text-red-700'
                : isDark
                  ? 'bg-gray-800 text-gray-100 border border-gray-700/50'
                  : 'bg-white text-gray-800 border border-gray-200'}`}>
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : (
              <div className="markdown-content text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 ml-9 sm:ml-10">
            <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📎 Sources:</p>
            <div className="flex flex-wrap gap-1.5">
              {message.sources.map((source, idx) => (
                <span key={idx} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border
                  ${isDark ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  📄 <span className="max-w-[100px] truncate">{source.filename}</span>
                  <span className="text-green-500">{(source.relevance_score * 100).toFixed(0)}%</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Time */}
        <p className={`text-xs mt-1 ${isUser ? 'text-right mr-9 sm:mr-10' : 'ml-9 sm:ml-10'}
          ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble
