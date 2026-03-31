import type { Restaurant, Review, Category } from './types'

export const categories: Category[] = [
  { id: '1', name: 'Hamburguesas', icon: '🍔' },
  { id: '2', name: 'Salar', icon: '🥗' },
  { id: '3', name: 'Pizzas', icon: '🍕' },
  { id: '4', name: 'Perros', icon: '🌭' },
  { id: '5', name: 'Sushi', icon: '🍣' },
  { id: '6', name: 'Mexicana', icon: '🌮' },
  { id: '7', name: 'Postres', icon: '🍰' },
  { id: '8', name: 'Cafe', icon: '☕' },
  { id: '9', name: 'Parrilla', icon: '🥩' },
  { id: '10', name: 'Mariscos', icon: '🦐' },
]

// Base image collections for different food types
const foodImages = {
  Hamburguesas: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop',
  ],
  Pizzas: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=600&fit=crop',
  ],
  Sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&h=600&fit=crop',
  ],
  Mexicana: [
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800&h=600&fit=crop',
  ],
  Salar: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540914124281-342587941389?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop',
  ],
  Perros: [
    'https://images.unsplash.com/photo-1612392062631-94e9b1c9b40f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1619740455993-9e612b50c54d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496410497022-eff5fcf4bcdf?w=800&h=600&fit=crop',
  ],
  Postres: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
  ],
  Cafe: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
  ],
  Parrilla: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  ],
  Mariscos: [
    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585546204756-9e7ac06f5a1c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&h=600&fit=crop',
  ],
}

// Cali neighborhoods and zones
const neighborhoods = [
  { name: 'Valle del Lili', zone: 'Sur' },
  { name: 'Ciudad Jardin', zone: 'Sur' },
  { name: 'El Ingenio', zone: 'Sur' },
  { name: 'Pance', zone: 'Sur' },
  { name: 'Melendez', zone: 'Sur' },
  { name: 'Granada', zone: 'Norte' },
  { name: 'Chipichape', zone: 'Norte' },
  { name: 'Flora', zone: 'Norte' },
  { name: 'Versalles', zone: 'Norte' },
  { name: 'Santa Monica', zone: 'Norte' },
  { name: 'El Penon', zone: 'Oeste' },
  { name: 'San Antonio', zone: 'Oeste' },
  { name: 'Centenario', zone: 'Oeste' },
  { name: 'Normandia', zone: 'Oeste' },
  { name: 'San Fernando', zone: 'Centro' },
  { name: 'Santa Rosa', zone: 'Centro' },
  { name: 'San Bosco', zone: 'Centro' },
  { name: 'El Cedro', zone: 'Centro' },
  { name: 'Tequendama', zone: 'Sur' },
  { name: 'Limonar', zone: 'Sur' },
]

// Restaurant name components
const prefixes = [
  'El', 'La', 'Don', 'Dona', 'Sabor', 'Casa', 'Cafe', 'Bar', 'Parrilla', 'Rincon',
  'Punto', 'Asadero', 'Pizzeria', 'Burguer', 'Taqueria', 'Sushi', 'Restaurante', 'Fonda',
]

const suffixes = [
  'del Sabor', 'Criollo', 'Caleno', 'Express', 'Premium', 'Gourmet', 'Artesanal',
  'Original', 'Tradicional', 'Urbano', 'Fusion', 'Street', 'House', 'Kitchen', 'Lab',
]

const names = [
  'Marco', 'Carlos', 'Juan', 'Pedro', 'Maria', 'Ana', 'Sofia', 'Lucia', 'Diego', 'Andres',
  'Paisa', 'Cali', 'Valle', 'Salsa', 'Fuego', 'Brasa', 'Leña', 'Humo', 'Sol', 'Luna',
]

// Generate a restaurant name
function generateRestaurantName(category: string, index: number): string {
  const seed = index * 17
  const prefix = prefixes[seed % prefixes.length]
  const name = names[(seed + 3) % names.length]
  const suffix = suffixes[(seed + 7) % suffixes.length]
  
  const patterns = [
    `${prefix} ${name}`,
    `${name} ${suffix}`,
    `${prefix} ${name} ${suffix}`,
    `${category} ${name}`,
    `${name}'s ${category}`,
  ]
  
  return patterns[seed % patterns.length]
}

// Generate restaurant description
function generateDescription(category: string, name: string): string {
  const descriptions: Record<string, string[]> = {
    Hamburguesas: [
      'Las mejores hamburguesas artesanales de Cali con ingredientes frescos y locales.',
      'Hamburguesas gourmet con carne 100% angus y pan brioche recien horneado.',
      'Experiencia burger unica con combinaciones innovadoras y salsas caseras.',
      'Hamburguesas clasicas y creativas en un ambiente urbano y moderno.',
    ],
    Pizzas: [
      'Autentica pizza italiana al horno de lena con masa madre fermentada 48 horas.',
      'Pizzas artesanales con ingredientes importados y recetas tradicionales.',
      'La mejor pizza de Cali con bordes crujientes y queso derretido perfecto.',
      'Pizzeria gourmet con opciones vegetarianas y sin gluten.',
    ],
    Sushi: [
      'El mejor sushi de la ciudad con pescado fresco importado diariamente.',
      'Fusion japonesa-colombiana con rolls creativos y sabores unicos.',
      'Experiencia omakase con chef japones y ingredientes premium.',
      'Sushi contemporaneo en un ambiente minimalista y elegante.',
    ],
    Mexicana: [
      'Tacos autenticos mexicanos con salsas hechas en casa.',
      'Comida mexicana tradicional con recetas de abuela.',
      'Taqueria urbana con los mejores tacos al pastor de Cali.',
      'Sabores de Mexico con un toque caleno unico.',
    ],
    Salar: [
      'Comida saludable y deliciosa con ingredientes organicos.',
      'Bowls nutritivos y ensaladas frescas para un estilo de vida activo.',
      'Opciones veganas y vegetarianas con sabor excepcional.',
      'Alimentacion consciente sin sacrificar el sabor.',
    ],
    Perros: [
      'Los perros calientes mas generosos de Cali con todas las salsas.',
      'Hot dogs estilo americano con ingredientes premium.',
      'Perros artesanales con combinaciones unicas y pan recien horneado.',
      'El clasico perro caleno reinventado con ingredientes gourmet.',
    ],
    Postres: [
      'Postres artesanales hechos con amor y los mejores ingredientes.',
      'Reposteria francesa con tecnicas tradicionales y sabores locales.',
      'Helados artesanales y postres creativos para endulzar tu dia.',
      'Pasteleria gourmet con opciones sin azucar y sin gluten.',
    ],
    Cafe: [
      'Cafe de origen colombiano con metodos de preparacion artesanales.',
      'Experiencia barista con granos seleccionados del eje cafetero.',
      'Cafeteria de especialidad con ambiente acogedor para trabajar.',
      'El mejor cafe de Cali con reposteria casera y brunch.',
    ],
    Parrilla: [
      'Carnes a la brasa con cortes premium y punto perfecto.',
      'Parrilla argentina con chorizos artesanales y chimichurri casero.',
      'Asadero tradicional con el mejor lomo y costilla de Cali.',
      'Carnes maduradas y ahumados artesanales en ambiente rustico.',
    ],
    Mariscos: [
      'Mariscos frescos del Pacifico preparados con tecnicas tradicionales.',
      'Ceviche peruano y cocina del mar con ingredientes de primera.',
      'Pescados y mariscos en su punto con sazón calena.',
      'Experiencia marina con ostras, langostinos y pescado del dia.',
    ],
  }
  
  const catDescriptions = descriptions[category] || descriptions.Hamburguesas
  return catDescriptions[Math.abs(name.length) % catDescriptions.length]
}

// Generate 100 restaurants
function generateRestaurants(): Restaurant[] {
  const categoryNames = categories.map(c => c.name)
  const priceRanges: Array<'$' | '$$' | '$$$' | '$$$$'> = ['$', '$$', '$$$', '$$$$']
  const restaurants: Restaurant[] = []
  
  for (let i = 0; i < 100; i++) {
    const category = categoryNames[i % categoryNames.length]
    const neighborhood = neighborhoods[i % neighborhoods.length]
    const name = generateRestaurantName(category, i)
    const images = foodImages[category as keyof typeof foodImages] || foodImages.Hamburguesas
    
    // Shuffle images for variety
    const shuffledImages = [...images].sort(() => Math.random() - 0.5).slice(0, 3)
    
    const restaurant: Restaurant = {
      id: String(i + 1),
      name,
      neighborhood: neighborhood.name,
      zone: neighborhood.zone,
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(50 + Math.random() * 500),
      distance: `${(0.3 + Math.random() * 5).toFixed(1)} km`,
      category,
      priceRange: priceRanges[i % priceRanges.length],
      images: shuffledImages,
      description: generateDescription(category, name),
      address: `Cra ${Math.floor(Math.random() * 100)} #${Math.floor(Math.random() * 50)}-${Math.floor(Math.random() * 99)}, ${neighborhood.name}`,
      hours: i % 3 === 0 ? '24 horas' : `${8 + (i % 4)}:00 AM - ${9 + (i % 3)}:00 PM`,
      phone: `+57 3${Math.floor(10 + Math.random() * 10)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      isFavorite: i % 7 === 0,
      isSaved: i % 11 === 0,
    }
    
    restaurants.push(restaurant)
  }
  
  return restaurants
}

export const restaurants: Restaurant[] = generateRestaurants()

// Generate more diverse reviews
const reviewTemplates = [
  { rating: 5, comments: [
    'Increible experiencia! La comida estaba deliciosa y el servicio fue excelente. Definitivamente volvere.',
    'El mejor lugar de la zona. Cada plato es una obra de arte. Super recomendado.',
    'Ambiente perfecto y comida espectacular. Se nota la calidad en cada detalle.',
    'De lo mejor que he probado en Cali. Los sabores son autenticos y la atencion es de primera.',
    'Superó todas mis expectativas. El chef es un genio. 100% recomendado.',
  ]},
  { rating: 4, comments: [
    'Muy buena comida, aunque el lugar estaba un poco lleno. Las hamburguesas son espectaculares.',
    'Excelente relacion calidad-precio. El ambiente es muy agradable para ir en familia.',
    'Me gusto mucho, solo el tiempo de espera fue un poco largo. La comida lo vale.',
    'Buena experiencia en general. La presentacion de los platos es muy cuidada.',
    'Rico todo, volveria sin duda. El postre estuvo increible.',
  ]},
  { rating: 3, comments: [
    'Esta bien, pero he probado mejores. El servicio puede mejorar.',
    'Cumple con lo basico. Nada extraordinario pero tampoco malo.',
    'La comida esta buena pero el lugar necesita una renovacion.',
  ]},
]

const reviewerNames = [
  'Maria Garcia', 'Carlos Rodriguez', 'Ana Martinez', 'Juan Perez', 'Sofia Lopez',
  'Diego Hernandez', 'Valentina Sanchez', 'Andres Gomez', 'Isabella Diaz', 'Sebastian Torres',
  'Camila Ramirez', 'Nicolas Flores', 'Daniela Castro', 'Alejandro Moreno', 'Paula Vargas',
  'David Ruiz', 'Laura Jimenez', 'Felipe Ortiz', 'Natalia Silva', 'Santiago Mendoza',
  'Mariana Rojas', 'Julian Navarro', 'Catalina Guerrero', 'Miguel Ramos', 'Andrea Paredes',
]

const timesAgo = [
  'Hace 1 hora', 'Hace 3 horas', 'Hace 5 horas', 'Hace 1 dia', 'Hace 2 dias',
  'Hace 3 dias', 'Hace 1 semana', 'Hace 2 semanas', 'Hace 3 semanas', 'Hace 1 mes',
]

function generateReviews(): Review[] {
  const reviews: Review[] = []
  
  for (let i = 0; i < 50; i++) {
    const template = reviewTemplates[i % reviewTemplates.length]
    const comment = template.comments[i % template.comments.length]
    const name = reviewerNames[i % reviewerNames.length]
    
    reviews.push({
      id: String(i + 1),
      userName: name,
      userAvatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      rating: template.rating,
      comment,
      date: timesAgo[i % timesAgo.length],
    })
  }
  
  return reviews
}

export const reviews: Review[] = generateReviews()
