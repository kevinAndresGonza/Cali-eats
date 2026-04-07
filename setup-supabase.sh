#!/bin/bash
# Script para configurar variables de Supabase
# Ejecutar: chmod +x setup-supabase.sh && ./setup-supabase.sh

echo "🔧 Configurando Supabase para Cali Eats..."
echo ""
echo "Pega tus credenciales de Vercel (desde el dashboard):"
echo ""

# Crear archivo .env.local
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ylcqugvpsrdfyhxtmzhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3F1Z3Zwc3JkZnloeHRtemhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDM2MDAsImV4cCI6MjA1OTU3OTYwMH0.SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY3F1Z3Zwc3JkZnloeHRtemhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDAwMzYwMCwiZXhwIjoyMDU5NTc5NjAwfQ.SERVICE_ROLE_KEY_HERE

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-in-production-minimum-32-chars
EOF

echo "✅ Archivo .env.local creado"
echo ""
echo "⚠️ IMPORTANTE: Reemplaza las claves en .env.local con las reales de tu dashboard de Vercel"
echo ""
echo "Próximos pasos:"
echo "1. Ve al SQL Editor de Supabase"
echo "2. Carga supabase/schema.sql"
echo "3. Ejecuta el SQL"
echo "4. Corre: npm run dev"
