import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// POST /api/upload - Subir imagen
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'review-images'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files allowed' },
        { status: 400 }
      )
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      )
    }
    
    // Generar nombre único
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    
    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }
    
    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName
    })
    
  } catch (err) {
    console.error('Error uploading:', err)
    return NextResponse.json(
      { error: 'Failed to upload' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Eliminar imagen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')
    const bucket = searchParams.get('bucket') || 'review-images'
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'File name required' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error('Error deleting file:', err)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
