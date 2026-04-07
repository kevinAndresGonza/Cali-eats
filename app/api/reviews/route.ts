import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/reviews?restaurantId=xxx - Obtener reseñas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const userId = searchParams.get('userId')
    
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(name, avatar_url),
        restaurant:restaurants(name, images)
      `)
      .order('created_at', { ascending: false })
    
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    const reviews = data?.map(r => ({
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
      images: r.images || [],
      restaurantName: r.restaurant?.name,
      restaurantImage: r.restaurant?.images?.[0]
    }))
    
    return NextResponse.json({ reviews })
    
  } catch (err) {
    console.error('Error fetching reviews:', err)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Crear reseña
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { restaurant_id, user_id, rating, comment, images } = body
    
    // Validar datos
    if (!restaurant_id || !user_id || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        restaurant_id,
        user_id,
        rating,
        comment,
        images: images || []
      }])
      .select(`
        *,
        user:profiles(name, avatar_url)
      `)
    
    if (error) throw error
    
    const review = {
      id: data[0].id,
      restaurantId: data[0].restaurant_id,
      userName: data[0].user?.name,
      userAvatar: data[0].user?.avatar_url,
      rating: data[0].rating,
      comment: data[0].comment,
      date: new Date(data[0].created_at).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      images: data[0].images || []
    }
    
    return NextResponse.json({ review }, { status: 201 })
    
  } catch (err) {
    console.error('Error creating review:', err)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews - Eliminar reseña
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Review ID and User ID required' },
        { status: 400 }
      )
    }
    
    // Verificar que la reseña pertenece al usuario
    const { data: existing } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single()
    
    if (!existing || existing.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error deleting review:', err)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
