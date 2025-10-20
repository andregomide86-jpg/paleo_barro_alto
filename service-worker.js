// Define um nome e versão para o cache
const CACHE_NAME = 'ficha-paleo-cache-v1';

// Lista de arquivos que o Service Worker deve salvar em cache
const urlsToCache = [
  'index.html',  // O arquivo HTML principal
  'proj4.js',      // A biblioteca de coordenadas local
  'jszip.min.js',  // A biblioteca de ZIP local
  'manifest.json'  // O arquivo de manifesto
];

// Evento de 'install': Salva os arquivos no cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de 'fetch': Responde com os arquivos do cache se estiverem disponíveis
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Se encontrar no cache, retorna o arquivo do cache
        if (response) {
          return response;
        }
        // Se não, busca na rede (se houver internet)
        return fetch(event.request);
      }
    )
  );
});

// Evento de 'activate': Limpa caches antigos se a versão mudar
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
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