import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/favorites?userId=xxx - Obtener favoritos del usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        restaurant_id,
        restaurant:restaurants(*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    
    const restaurantIds = data?.map(f => f.restaurant_id) || []
    const restaurants = data?.map(f => f.restaurant) || []
    
    return NextResponse.json({ restaurantIds, restaurants })
    
  } catch (err) {
    console.error('Error fetching favorites:', err)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Agregar a favoritos
export async function POST(request: Request) {
  try {
    const { userId, restaurantId } = await request.json()
    
    if (!userId || !restaurantId) {
      return NextResponse.json(
        { error: 'User ID and Restaurant ID required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        restaurant_id: restaurantId
      }])
      .select()
    
    if (error) {
      // Si es error de duplicado, no es fatal
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: true, 
          message: 'Already in favorites' 
        })
      }
      throw error
    }
    
    return NextResponse.json({ 
      success: true, 
      favorite: data[0] 
    }, { status: 201 })
    
  } catch (err) {
    console.error('Error adding favorite:', err)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Eliminar de favoritos
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const restaurantId = searchParams.get('restaurantId')
    
    if (!userId || !restaurantId) {
      return NextResponse.json(
        { error: 'User ID and Restaurant ID required' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error removing favorite:', err)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
