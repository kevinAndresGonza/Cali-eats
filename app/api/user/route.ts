import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/user?id=xxx - Obtener perfil de usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')
    
    if (!id && !email) {
      return NextResponse.json(
        { error: 'User ID or email required' },
        { status: 400 }
      )
    }
    
    let query = supabase
      .from('profiles')
      .select(`
        *,
        favorites:favorites(count),
        saved:saved_restaurants(count),
        reviews:reviews(count)
      `)
    
    if (id) {
      query = query.eq('id', id)
    } else {
      query = query.eq('email', email)
    }
    
    const { data, error } = await query.single()
    
    if (error) throw error
    
    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const user = {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar_url,
      phone: data.phone,
      stats: {
        favorites: data.favorites?.[0]?.count || 0,
        saved: data.saved?.[0]?.count || 0,
        reviews: data.reviews?.[0]?.count || 0
      },
      createdAt: data.created_at
    }
    
    return NextResponse.json({ user })
    
  } catch (err) {
    console.error('Error fetching user:', err)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/user - Actualizar perfil
export async function PATCH(request: Request) {
  try {
    const { id, name, avatar_url, phone } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    const updateData: any = {}
    if (name) updateData.name = name
    if (avatar_url) updateData.avatar_url = avatar_url
    if (phone) updateData.phone = phone
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user: data[0] })
    
  } catch (err) {
    console.error('Error updating user:', err)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// POST /api/user - Crear perfil (usado por trigger de auth)
export async function POST(request: Request) {
  try {
    const { id, email, name, avatar_url } = await request.json()
    
    if (!id || !email) {
      return NextResponse.json(
        { error: 'ID and email required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id,
        email,
        name: name || email.split('@')[0],
        avatar_url: avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
      }])
      .select()
    
    if (error) {
      // Si ya existe, no es error
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: true, 
          message: 'Profile already exists' 
        })
      }
      throw error
    }
    
    return NextResponse.json({ 
      success: true, 
      user: data[0] 
    }, { status: 201 })
    
  } catch (err) {
    console.error('Error creating user:', err)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// DELETE /api/user - Eliminar cuenta
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Eliminar perfil (esto también elimina datos relacionados por CASCADE)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error deleting user:', err)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
