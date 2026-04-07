import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/addresses?userId=xxx - Obtener direcciones del usuario
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
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const addresses = data?.map(a => ({
      id: a.id,
      userId: a.user_id,
      name: a.name,
      address: a.address,
      lat: a.lat,
      lng: a.lng,
      isDefault: a.is_default,
      createdAt: a.created_at
    }))
    
    return NextResponse.json({ addresses: addresses || [] })
    
  } catch (err) {
    console.error('Error fetching addresses:', err)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST /api/addresses - Crear dirección
export async function POST(request: Request) {
  try {
    const { userId, name, address, lat, lng, isDefault } = await request.json()
    
    if (!userId || !name || !address) {
      return NextResponse.json(
        { error: 'User ID, name and address required' },
        { status: 400 }
      )
    }
    
    // Si es default, quitar default de otras direcciones
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
    }
    
    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        user_id: userId,
        name,
        address,
        lat,
        lng,
        is_default: isDefault || false
      }])
      .select()
    
    if (error) throw error
    
    const newAddress = {
      id: data[0].id,
      userId: data[0].user_id,
      name: data[0].name,
      address: data[0].address,
      lat: data[0].lat,
      lng: data[0].lng,
      isDefault: data[0].is_default,
      createdAt: data[0].created_at
    }
    
    return NextResponse.json({ 
      success: true, 
      address: newAddress 
    }, { status: 201 })
    
  } catch (err) {
    console.error('Error creating address:', err)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}

// PATCH /api/addresses - Actualizar dirección
export async function PATCH(request: Request) {
  try {
    const { id, userId, name, address, lat, lng, isDefault } = await request.json()
    
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID required' },
        { status: 400 }
      )
    }
    
    // Verificar que la dirección pertenece al usuario
    const { data: existing } = await supabase
      .from('addresses')
      .select('user_id')
      .eq('id', id)
      .single()
    
    if (!existing || existing.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Si es default, quitar default de otras direcciones
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
    }
    
    const updateData: any = {}
    if (name) updateData.name = name
    if (address) updateData.address = address
    if (lat !== undefined) updateData.lat = lat
    if (lng !== undefined) updateData.lng = lng
    if (isDefault !== undefined) updateData.is_default = isDefault
    
    const { data, error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ address: data[0] })
    
  } catch (err) {
    console.error('Error updating address:', err)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE /api/addresses?id=xxx&userId=xxx - Eliminar dirección
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID required' },
        { status: 400 }
      )
    }
    
    // Verificar que la dirección pertenece al usuario
    const { data: existing } = await supabase
      .from('addresses')
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
      .from('addresses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error deleting address:', err)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
