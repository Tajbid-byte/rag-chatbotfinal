import axios from 'axios'

// Reads from .env file locally, or from Vercel environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

console.log('API connected to:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.detail || error.message || 'Something went wrong'
    return Promise.reject(new Error(errorMessage))
  }
)

export const documentAPI = {
  upload: async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      }
    })
    return response.data
  },
  list: async () => (await api.get('/api/documents/list')).data,
  delete: async (docId) => (await api.delete(`/api/documents/${docId}`)).data,
  clear: async () => (await api.delete('/api/documents/clear/all')).data
}

export const chatAPI = {
  sendMessage: async (message, sessionId) =>
    (await api.post('/api/chat/message', { message, session_id: sessionId })).data,
  clearHistory: async (sessionId) =>
    (await api.delete(`/api/chat/history/${sessionId}`)).data,
  getStatus: async () => (await api.get('/api/chat/status')).data
}

export default api
