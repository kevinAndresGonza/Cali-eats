import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/search?q=xxx&category=xxx&minRating=x&maxDistance=x&priceRange=x
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const minRating = searchParams.get('minRating')
    const maxDistance = searchParams.get('maxDistance')
    const priceRange = searchParams.get('priceRange')
    const userLat = searchParams.get('lat')
    const userLng = searchParams.get('lng')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(id, name, icon),
        reviews:reviews(rating)
      `)
      .limit(limit)
    
    // Búsqueda de texto
    if (q) {
      query = query.or(`
        name.ilike.%${q}%,
        description.ilike.%${q}%,
        neighborhood.ilike.%${q}%,
        zone.ilike.%${q}%,
        address.ilike.%${q}%
      `)
    }
    
    // Filtro por categoría
    if (category) {
      query = query.eq('category_id', category)
    }
    
    // Filtro por rating mínimo
    if (minRating) {
      query = query.gte('rating', parseFloat(minRating))
    }
    
    // Filtro por rango de precio
    if (priceRange) {
      const prices = priceRange.split(',')
      query = query.in('price_range', prices)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Calcular distancia si hay coordenadas del usuario
    let restaurants = data?.map(r => {
      let distance = null
      
      if (userLat && userLng && r.lat && r.lng) {
        const R = 6371 // Radio de la Tierra en km
        const dLat = (r.lat - parseFloat(userLat)) * (Math.PI / 180)
        const dLng = (r.lng - parseFloat(userLng)) * (Math.PI / 180)
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(parseFloat(userLat) * (Math.PI / 180)) * 
          Math.cos(r.lat * (Math.PI / 180)) *
          Math.sin(dLng/2) * Math.sin(dLng/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        distance = R * c
      }
      
      return {
        id: r.id,
        name: r.name,
        neighborhood: r.neighborhood,
        zone: r.zone,
        rating: r.rating,
        reviewCount: r.review_count || r.reviews?.length || 0,
        distance: distance 
          ? distance < 1 
            ? `${Math.round(distance * 1000)} m` 
            : `${distance.toFixed(1)} km`
          : r.distance || '0 km',
        distanceValue: distance,
        category: r.category?.name || 'General',
        categoryIcon: r.category?.icon,
        priceRange: r.price_range,
        images: r.images || [],
        description: r.description,
        address: r.address,
        hours: r.hours,
        phone: r.phone,
        isFavorite: false,
        isSaved: false,
        lat: r.lat,
        lng: r.lng,
      }
    })
    
    // Filtrar por distancia máxima
    if (maxDistance && userLat && userLng) {
      const maxDist = parseFloat(maxDistance)
      restaurants = restaurants?.filter(r => 
        r.distanceValue === null || r.distanceValue <= maxDist
      )
    }
    
    // Ordenar por distancia si hay ubicación del usuario
    if (userLat && userLng) {
      restaurants?.sort((a, b) => {
        if (a.distanceValue === null) return 1
        if (b.distanceValue === null) return -1
        return a.distanceValue - b.distanceValue
      })
    }
    
    return NextResponse.json({
      restaurants: restaurants || [],
      total: restaurants?.length || 0,
      query: q,
      filters: {
        category,
        minRating,
        maxDistance,
        priceRange
      }
    })
    
  } catch (err) {
    console.error('Error searching:', err)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}

// POST /api/search - Guardar búsqueda en historial
export async function POST(request: Request) {
  try {
    const { userId, query, category, resultsCount } = await request.json()
    
    if (!userId || !query) {
      return NextResponse.json(
        { error: 'User ID and query required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('search_history')
      .insert([{
        user_id: userId,
        query,
        category,
        results_count: resultsCount || 0
      }])
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      search: data[0] 
    }, { status: 201 })
    
  } catch (err) {
    console.error('Error saving search:', err)
    return NextResponse.json(
      { error: 'Failed to save search' },
      { status: 500 }
    )
  }
}
