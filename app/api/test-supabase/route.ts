import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Crear cliente de Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Probar conexión con una query simple
    const { data, error } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Error conectando a Supabase',
        error: error.message,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      }, { status: 500 })
    }

    // Verificar si hay restaurantes
    const { count } = await supabase
      .from('restaurants')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      status: 'success',
      message: 'Conexión exitosa a Supabase',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      restaurants_count: count || 0,
      has_data: count ? count > 0 : false,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    return NextResponse.json({
      status: 'error',
      message: 'Error inesperado',
      error: err instanceof Error ? err.message : 'Unknown error',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    }, { status: 500 })
  }
}
