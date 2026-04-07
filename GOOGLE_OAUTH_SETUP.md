# Cali Eats - Google OAuth Setup

## Pasos para configurar Google OAuth:

### 1. Crear proyecto en Google Cloud Console
- Ir a: https://console.cloud.google.com/
- Crear nuevo proyecto o usar existente
- Habilitar "Google+ API" o "Google People API"

### 2. Configurar Pantalla de Consentimiento OAuth
- APIs & Services → OAuth consent screen
- Tipo: External (para pruebas) o Internal
- Completar información básica:
  - App name: Cali Eats
  - User support email: tu-email@gmail.com
  - Developer contact: tu-email@gmail.com

### 3. Crear Credenciales OAuth 2.0
- APIs & Services → Credentials
- Create Credentials → OAuth client ID
- Application type: Web application
- Authorized JavaScript origins:
  - http://localhost:3000 (desarrollo)
  - https://tu-dominio.com (producción)
- Authorized redirect URIs:
  - http://localhost:3000/api/auth/callback/google
  - https://tu-dominio.com/api/auth/callback/google

### 4. Copiar Client ID y Client Secret
- Guardar en archivo `.env.local`:
```
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
NEXTAUTH_SECRET=un-secreto-largo-y-aleatorio-minimo-32-caracteres
NEXTAUTH_URL=http://localhost:3000
```

### 5. Generar NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
O usar cualquier string largo aleatorio

## Nota importante:
Para desarrollo local, las credenciales funcionan inmediatamente.
Para producción, Google requiere verificar la app si quieres que usuarios externos puedan usarla.
