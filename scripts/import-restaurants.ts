# Script para importar restaurantes a Supabase
# Ejecutar con: npx ts-node scripts/import-restaurants.ts

import { createClient } from '@supabase/supabase-js'
import { restaurants } from '../lib/data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importRestaurants() {
  console.log(`Importing ${restaurants.length} restaurants...`)

  // Obtener mapeo de categorías
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map(categories?.map(c => [c.name, c.id]))

  // Transformar y subir restaurantes
  const restaurantsToInsert = restaurants.map(r => ({
    name: r.name,
    neighborhood: r.neighborhood,
    zone: r.zone,
    rating: r.rating,
    review_count: r.reviewCount,
    category_id: categoryMap.get(r.category),
    price_range: r.priceRange,
    images: r.images,
    description: r.description,
    address: r.address,
    hours: r.hours,
    phone: r.phone,
    lat: r.lat,
    lng: r.lng,
  }))

  const { data, error } = await supabase
    .from('restaurants')
    .upsert(restaurantsToInsert, { onConflict: 'name' })

  if (error) {
    console.error('Error importing restaurants:', error)
    process.exit(1)
  }

  console.log(`✅ Imported ${restaurantsToInsert.length} restaurants`)
  process.exit(0)
}

importRestaurants()
