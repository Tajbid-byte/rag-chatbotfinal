const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-5 h-5 border-2', lg: 'w-7 h-7 border-[3px]' }
  const colors = {
    blue: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    purple: 'border-purple-400 border-t-transparent'
  }
  return <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
}

export default LoadingSpinner
