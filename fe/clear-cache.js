// Clear browser cache script
console.log('🧹 Clearing browser cache...')

// Clear localStorage
if (typeof localStorage !== 'undefined') {
  localStorage.clear()
  console.log('✅ localStorage cleared')
}

// Clear sessionStorage
if (typeof sessionStorage !== 'undefined') {
  sessionStorage.clear()
  console.log('✅ sessionStorage cleared')
}

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister()
      console.log('✅ Service worker unregistered')
    }
  })
}

// Clear cache storage
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name)
      console.log('✅ Cache storage cleared:', name)
    }
  })
}

console.log('🎉 Cache clearing complete! Please refresh the page.')
