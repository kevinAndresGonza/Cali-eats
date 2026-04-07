# Supabase Configuration

**Proyecto:** `ylcqugvpsrdfyhxtmzhc`  
**URL:** https://ylcqugvpsrdfyhxtmzhc.supabase.co  
**Dashboard:** https://supabase.com/dashboard/project/ylcqugvpsrdfyhxtmzhc

## 1. Crear Proyecto en Supabase (Ya completado ✅)

1. Ir a https://supabase.com/
2. Crear cuenta o iniciar sesión
3. Click "New Project"
4. Nombre: cali-eats
5. Plan: Free tier
6. Region: (elige la más cercana a Cali, Colombia - probablemente us-east-1)
7. Esperar a que se cree (toma ~2 minutos)

## 2. Obtener Credenciales

En el Dashboard de Supabase:
- Ir a Settings → API
- Copiar:
  - Project URL: `https://xxxx.supabase.co`
  - anon public: `eyJhbG...`

- Ir a Settings → Data API → JWT Settings
- Copiar JWT Secret (para NextAuth si lo usas)

## 3. Configurar Variables de Entorno

Crear archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Opcional: Para usar Supabase Auth en lugar de NextAuth
SUPABASE_JWT_SECRET=tu-jwt-secret
```

## 4. Habilitar Proveedores de Auth (Opcional)

Si quieres usar Supabase Auth en lugar de NextAuth:
- Authentication → Providers
- Habilitar Google
- Configurar Client ID y Secret de Google Cloud Console
- Agregar redirect URL: `https://tu-proyecto.supabase.co/auth/v1/callback`

## 5. Configurar Storage para Fotos

- Storage → New bucket
- Nombre: `restaurant-images`
- Public: true
- Policies: Permitir read para todos, write solo para authenticated

- Crear otro bucket: `review-images`
- Public: true
- Policies: Permitir read para todos, write solo para authenticated

## 6. Ejecutar SQL para Crear Tablas

Ir a SQL Editor → New query → Pegar el contenido de `supabase/schema.sql`

## 7. Configurar Vercel

En el dashboard de Vercel:
- Settings → Environment Variables
- Agregar todas las variables de `.env.local`
- Redeploy

## Tablas Creadas

1. **profiles** - Perfiles de usuario (extiende auth.users)
2. **restaurants** - Datos de restaurantes
3. **reviews** - Reseñas con ratings
4. **favorites** - Relación usuario-restaurante favorito
5. **saved_restaurants** - Guardados para después
6. **addresses** - Direcciones de usuarios
7. **search_history** - Historial de búsquedas

## Políticas de Seguridad (RLS)

Todas las tablas tienen Row Level Security (RLS) habilitado:
- Usuarios solo ven/editan sus propios datos
- Restaurantes son públicos
- Reseñas son públicas pero solo el autor puede editarlas
- Favoritos y guardados son privados
