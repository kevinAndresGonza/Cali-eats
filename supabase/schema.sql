-- Schema completo para Cali Eats en Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (Perfiles de usuario)
-- ============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- CATEGORIES (Categorías de restaurantes)
-- ============================================
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insertar categorías
INSERT INTO categories (name, icon) VALUES
    ('Hamburguesas', '🍔'),
    ('Ensaladas', '🥗'),
    ('Pizzas', '🍕'),
    ('Perros Calientes', '🌭'),
    ('Sushi', '🍣'),
    ('Mexicana', '🌮'),
    ('Postres', '🍰'),
    ('Café', '☕'),
    ('Colombiana', '🍛'),
    ('Italiana', '🍝'),
    ('Mariscos', '🦐'),
    ('Árabe', '🥙'),
    ('Vegetariana', '🥬'),
    ('Parrilla', '🥩'),
    ('Desayunos', '🍳');

-- ============================================
-- RESTAURANTS (Restaurantes)
-- ============================================
CREATE TABLE restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    zone TEXT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    category_id UUID REFERENCES categories(id),
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    images TEXT[] DEFAULT '{}',
    description TEXT,
    address TEXT NOT NULL,
    hours TEXT,
    phone TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS: Restaurants son públicos
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurants are viewable by everyone"
    ON restaurants FOR SELECT
    USING (true);

-- Solo admins pueden crear/editar (opcional)
CREATE POLICY "Enable insert for authenticated users only"
    ON restaurants FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- REVIEWS (Reseñas)
-- ============================================
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies para reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FAVORITES (Favoritos)
-- ============================================
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, restaurant_id)
);

-- RLS: Solo el usuario ve sus favoritos
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SAVED_RESTAURANTS (Guardados para después)
-- ============================================
CREATE TABLE saved_restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, restaurant_id)
);

-- RLS: Solo el usuario ve sus guardados
ALTER TABLE saved_restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved"
    ON saved_restaurants FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add saved"
    ON saved_restaurants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own saved"
    ON saved_restaurants FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- ADDRESSES (Direcciones del usuario)
-- ============================================
CREATE TABLE addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- ej: "Casa", "Trabajo"
    address TEXT NOT NULL,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
    ON addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses"
    ON addresses FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- SEARCH_HISTORY (Historial de búsquedas)
-- ============================================
CREATE TABLE search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    query TEXT NOT NULL,
    category TEXT,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history"
    ON search_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add search history"
    ON search_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own search history"
    ON search_history FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Función para calcular rating promedio de restaurante
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE restaurant_id = NEW.restaurant_id), 0),
        review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = NEW.restaurant_id)
    WHERE id = NEW.restaurant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar rating
CREATE TRIGGER update_restaurant_rating_on_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_rating();

CREATE TRIGGER update_restaurant_rating_on_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_rating();

CREATE TRIGGER update_restaurant_rating_on_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_rating();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_restaurants_category ON restaurants(category_id);
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX idx_restaurants_location ON restaurants(lat, lng);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_saved_user ON saved_restaurants(user_id);
CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
