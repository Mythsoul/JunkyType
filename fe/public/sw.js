const CACHE_NAME = 'junkeytype-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.log('Cache install failed:', error)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response for caching
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/')
          }
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for typing results when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-typing-results') {
    event.waitUntil(syncTypingResults())
  }
})

async function syncTypingResults() {
  try {
    // Get pending results from IndexedDB
    const pendingResults = await getPendingResults()
    
    for (const result of pendingResults) {
      try {
        // Attempt to sync with server
        await fetch('/api/typing-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result)
        })
        
        // Remove from pending if successful
        await removePendingResult(result.id)
      } catch (error) {
        console.log('Failed to sync result:', error)
        // Keep in pending for next sync attempt
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error)
  }
}

// Helper functions for IndexedDB operations
function getPendingResults() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JunkeyTypeDB', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['pendingResults'], 'readonly')
      const store = transaction.objectStore('pendingResults')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || [])
      }
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error)
      }
    }
    
    request.onerror = () => {
      reject(request.error)
    }
  })
}

function removePendingResult(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JunkeyTypeDB', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['pendingResults'], 'readwrite')
      const store = transaction.objectStore('pendingResults')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => {
        resolve()
      }
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error)
      }
    }
    
    request.onerror = () => {
      reject(request.error)
    }
  })
}

// Show notification when app is updated
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
