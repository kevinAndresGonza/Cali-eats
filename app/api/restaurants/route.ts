import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/restaurants - Listar restaurantes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parámetros de filtro
    const categoryId = searchParams.get('category')
    const minRating = searchParams.get('minRating')
    const priceRange = searchParams.get('priceRange')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')
    
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(id, name, icon),
        reviews(count)
      `)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Aplicar filtros
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    
    if (minRating) {
      query = query.gte('rating', parseFloat(minRating))
    }
    
    if (priceRange) {
      const prices = priceRange.split(',')
      query = query.in('price_range', prices)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,neighborhood.ilike.%${search}%`)
    }
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    // Transformar datos
    const restaurants = data?.map(r => ({
      id: r.id,
      name: r.name,
      neighborhood: r.neighborhood,
      zone: r.zone,
      rating: r.rating,
      reviewCount: r.review_count || r.reviews?.[0]?.count || 0,
      distance: r.distance || '0 km',
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
    }))
    
    return NextResponse.json({
      restaurants,
      total: count,
      hasMore: data?.length === limit
    })
    
  } catch (err) {
    console.error('Error fetching restaurants:', err)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

// POST /api/restaurants - Crear restaurante (solo admins)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('restaurants')
      .insert([body])
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ restaurant: data[0] }, { status: 201 })
    
  } catch (err) {
    console.error('Error creating restaurant:', err)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
