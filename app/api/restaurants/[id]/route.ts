import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/restaurants/[id] - Obtener detalle de restaurante
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Obtener restaurante con categoría
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(id, name, icon)
      `)
      .eq('id', id)
      .single()
    
    if (restaurantError) throw restaurantError
    
    // Obtener reseñas del restaurante
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(name, avatar_url)
      `)
      .eq('restaurant_id', id)
      .order('created_at', { ascending: false })
    
    if (reviewsError) throw reviewsError
    
    // Transformar datos
    const transformedReviews = reviews?.map(r => ({
      id: r.id,
      restaurantId: r.restaurant_id,
      userName: r.user?.name || 'Usuario',
      userAvatar: r.user?.avatar_url || '',
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.created_at).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      images: r.images || []
    }))
    
    const transformedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      neighborhood: restaurant.neighborhood,
      zone: restaurant.zone,
      rating: restaurant.rating,
      reviewCount: restaurant.review_count || reviews?.length || 0,
      distance: restaurant.distance || '0 km',
      category: restaurant.category?.name || 'General',
      categoryIcon: restaurant.category?.icon,
      priceRange: restaurant.price_range,
      images: restaurant.images || [],
      description: restaurant.description,
      address: restaurant.address,
      hours: restaurant.hours,
      phone: restaurant.phone,
      isFavorite: false,
      isSaved: false,
      lat: restaurant.lat,
      lng: restaurant.lng,
    }
    
    return NextResponse.json({
      restaurant: transformedRestaurant,
      reviews: transformedReviews
    })
    
  } catch (err) {
    console.error('Error fetching restaurant:', err)
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}

// PATCH /api/restaurants/[id] - Actualizar restaurante
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('restaurants')
      .update(body)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ restaurant: data[0] })
    
  } catch (err) {
    console.error('Error updating restaurant:', err)
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    )
  }
}

// DELETE /api/restaurants/[id] - Eliminar restaurante
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error deleting restaurant:', err)
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    )
  }
}
