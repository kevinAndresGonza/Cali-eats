import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// API para sincronizar favoritos
export async function POST(request: Request) {
  try {
    const { userId, favorites, saved, reviews } = await request.json()

    // Sincronizar favoritos
    if (favorites?.length > 0) {
      const { error } = await supabase
        .from('favorites')
        .upsert(
          favorites.map((restaurantId: string) => ({
            user_id: userId,
            restaurant_id: restaurantId,
          })),
          { onConflict: 'user_id,restaurant_id' }
        )
      
      if (error) console.error('Sync favorites error:', error)
    }

    // Sincronizar guardados
    if (saved?.length > 0) {
      const { error } = await supabase
        .from('saved_restaurants')
        .upsert(
          saved.map((restaurantId: string) => ({
            user_id: userId,
            restaurant_id: restaurantId,
          })),
          { onConflict: 'user_id,restaurant_id' }
        )
      
      if (error) console.error('Sync saved error:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}
