# Cali Eats - Configuración de Supabase

## 🚀 Despliegue en Vercel + Supabase

### 1. Configurar Variables de Entorno en Vercel

Ve al dashboard de Vercel y agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ylcqugvpsrdfyhxtmzhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3F1Z3Zwc3JkZnloeHRtemhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDM2MDAsImV4cCI6MjA1OTU3OTYwMH0.SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXTAUTH_URL=https://v0-cali-eats.vercel.app
NEXTAUTH_SECRET=genera-un-secreto-largo
```

### 2. Configurar Supabase

1. Ir a: https://app.supabase.com/project/ylcqugvpsrdfyhxtmzhc
2. SQL Editor → New Query
3. Copiar y pegar el contenido de `supabase/schema.sql`
4. Click **Run**

### 3. Configurar Storage Buckets

En el dashboard de Supabase:
- Storage → New bucket: `restaurant-images` (público)
- Storage → New bucket: `review-images` (público)
- Configurar policies para permitir lectura pública

### 4. Configurar OAuth (Opcional)

Para login con Google:
1. Authentication → Providers → Google
2. Habilitar Google provider
3. Configurar Client ID y Secret desde Google Cloud Console
4. Configurar redirect URL: `https://v0-cali-eats.vercel.app/auth/callback`

### 5. Importar Datos

```bash
# Instalar dependencia para script
npm install -D ts-node

# Importar restaurantes
npx ts-node scripts/import-restaurants.ts
```

### 6. Probar la Conexión

Visita:
```
https://v0-cali-eats.vercel.app/api/test-supabase
```

Debería mostrar:
```json
{
  "status": "success",
  "tables": {
    "profiles": true,
    "restaurants": true,
    "reviews": true,
    ...
  }
}
```

### 7. Endpoints API Disponibles

- `GET /api/restaurants` - Listar restaurantes
- `GET /api/restaurants/[id]` - Detalle de restaurante
- `POST /api/reviews` - Crear reseña
- `GET /api/favorites?userId=xxx` - Obtener favoritos
- `POST /api/favorites` - Agregar favorito
- `GET /api/saved?userId=xxx` - Obtener guardados
- `POST /api/upload` - Subir imagen
- `GET /api/test-supabase` - Probar conexión

## 📋 Resumen de Funcionalidades

✅ **Implementadas:**
- 100+ restaurantes con datos completos
- Scroll infinito
- Mapa interactivo con Leaflet
- Geolocalización real
- Filtros avanzados (precio, rating, distancia)
- Autenticación con Supabase Auth
- Favoritos y guardados
- Reseñas con imágenes
- Subida de fotos
- Notificaciones push
- PWA offline
- Perfil de usuario editable
- Historial de búsquedas
- Direcciones de usuario

## 🔧 Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (DB + Auth + Storage)
- Framer Motion (animaciones)
- Leaflet (mapas)
- Zustand (estado local)
- Vercel (hosting)

## 📱 PWA

La app funciona como PWA:
- Instalable en dispositivos móviles
- Funciona offline
- Service Worker para cache
- Notificaciones push

## 🗺️ Mapa

Integración con Leaflet:
- Marcadores de restaurantes
- Ubicación del usuario
- Cálculo de distancias reales
- Popup con información

## 🔔 Notificaciones

Sistema de notificaciones:
- Push notifications nativas
- Configuración de preferencias
- Notificaciones locales para testing
