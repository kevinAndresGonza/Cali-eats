import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/saved?userId=xxx - Obtener restaurantes guardados
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
      .from('saved_restaurants')
      .select(`
        restaurant_id,
        restaurant:restaurants(*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    
    const restaurantIds = data?.map(s => s.restaurant_id) || []
    const restaurants = data?.map(s => s.restaurant) || []
    
    return NextResponse.json({ restaurantIds, restaurants })
    
  } catch (err) {
    console.error('Error fetching saved:', err)
    return NextResponse.json(
      { error: 'Failed to fetch saved restaurants' },
      { status: 500 }
    )
  }
}

// POST /api/saved - Guardar restaurante
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
      .from('saved_restaurants')
      .insert([{
        user_id: userId,
        restaurant_id: restaurantId
      }])
      .select()
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: true, 
          message: 'Already saved' 
        })
      }
      throw error
    }
    
    return NextResponse.json({ 
      success: true, 
      saved: data[0] 
    }, { status: 201 })
    
  } catch (err) {
    console.error('Error saving restaurant:', err)
    return NextResponse.json(
      { error: 'Failed to save restaurant' },
      { status: 500 }
    )
  }
}

// DELETE /api/saved - Eliminar de guardados
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
      .from('saved_restaurants')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error removing saved:', err)
    return NextResponse.json(
      { error: 'Failed to remove saved restaurant' },
      { status: 500 }
    )
  }
}
