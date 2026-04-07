import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/history?userId=xxx - Obtener historial de búsquedas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    const history = data?.map(h => ({
      id: h.id,
      query: h.query,
      category: h.category,
      resultsCount: h.results_count,
      date: new Date(h.created_at).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: h.created_at
    }))
    
    return NextResponse.json({ history: history || [] })
    
  } catch (err) {
    console.error('Error fetching search history:', err)
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}

// DELETE /api/history - Eliminar del historial
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    const clearAll = searchParams.get('clearAll')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Eliminar todo el historial
    if (clearAll === 'true') {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', userId)
      
      if (error) throw error
      
      return NextResponse.json({ 
        success: true, 
        message: 'All history cleared' 
      })
    }
    
    // Eliminar item específico
    if (id) {
      const { data: existing } = await supabase
        .from('search_history')
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
        .from('search_history')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: 'ID or clearAll parameter required' },
      { status: 400 }
    )
    
  } catch (err) {
    console.error('Error deleting from history:', err)
    return NextResponse.json(
      { error: 'Failed to delete from history' },
      { status: 500 }
    )
  }
}
