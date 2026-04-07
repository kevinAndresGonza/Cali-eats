"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Restaurant, Review } from "@/lib/types"

// Hook para obtener restaurantes
export function useRestaurants(categoryId?: string) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true)
        
        let query = supabase
          .from('restaurants')
          .select(`
            *,
            category:categories(name)
          `)
          .order('rating', { ascending: false })
        
        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        // Transformar datos al formato de la app
        const transformed = data?.map(r => ({
          id: r.id,
          name: r.name,
          neighborhood: r.neighborhood,
          zone: r.zone,
          rating: r.rating,
          reviewCount: r.review_count,
          distance: r.distance || '0 km',
          category: r.category?.name || 'General',
          priceRange: r.price_range,
          images: r.images || [],
          description: r.description,
          address: r.address,
          hours: r.hours,
          phone: r.phone,
          isFavorite: false,
          isSaved: false,
          lat: r.lat,
          lng: r.lng,
        })) || []
        
        setRestaurants(transformed)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [categoryId])

  return { restaurants, loading, error }
}

// Hook para obtener reseñas de un restaurante
export function useReviews(restaurantId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(name, avatar_url)
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reviews:', error)
        return
      }

      const transformed = data?.map(r => ({
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
      })) || []

      setReviews(transformed)
      setLoading(false)
    }

    if (restaurantId) {
      fetchReviews()
    }
  }, [restaurantId])

  return { reviews, loading }
}

// Hook para manejar favoritos
export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      const { data, error } = await supabase
        .from('favorites')
        .select('restaurant_id')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching favorites:', error)
        return
      }

      setFavorites(data?.map(f => f.restaurant_id) || [])
      setLoading(false)
    }

    fetchFavorites()

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel(`favorites:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchFavorites()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const toggleFavorite = async (restaurantId: string) => {
    if (!userId) return false

    const isFav = favorites.includes(restaurantId)

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: userId, restaurant_id: restaurantId })
    }

    return !isFav
  }

  return { favorites, loading, toggleFavorite }
}

// Hook para subir imágenes
export function useImageUpload() {
  const uploadImage = async (file: File, bucket: string = 'review-images') => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  }

  return { uploadImage }
}

// Hook para obtener categorías
export function useCategories() {
  const [categories, setCategories] = useState<{id: string, name: string, icon: string}[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  return categories
}
