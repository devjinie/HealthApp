const CACHE_NAME = 'health-tracker-v1';
// 앱 작동에 필요한 모든 파일 목록 (캐시할 파일)
const urlsToCache = [
  './', 
  'index.html',
  'manifest.json',
  'icon-192x192.png', 
  'icon-512x512.png'
];

// 설치 단계: 필요한 파일들을 캐시에 저장
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// 요청 가로채기 단계: 네트워크 대신 캐시에서 파일 제공
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 업데이트 단계: 이전 캐시 삭제
self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});