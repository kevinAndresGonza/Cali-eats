// Helper para generar coordenadas de restaurantes en Cali
// Cali centro: 3.4516, -76.5320

interface Coordinates {
  lat: number
  lng: number
}

// Coordenadas base por zona de Cali
const zoneCoordinates: Record<string, { lat: number; lng: number }> = {
  Sur: { lat: 3.38, lng: -76.54 },      // Valle del Lili, Ciudad Jardín, El Centenario
  Norte: { lat: 3.48, lng: -76.52 },   // Granada, Chipichape
  Oeste: { lat: 3.45, lng: -76.55 },   // San Antonio, El Peñón, Versalles
  Centro: { lat: 3.45, lng: -76.53 }, // San Fernando, Juanambú
}

export function generateCoordinates(zone: string, index: number): Coordinates {
  const base = zoneCoordinates[zone] || zoneCoordinates.Centro
  
  // Generar variación aleatoria pero consistente basada en el índice
  const latVariation = Math.sin(index * 0.5) * 0.02 + Math.cos(index * 0.3) * 0.01
  const lngVariation = Math.cos(index * 0.7) * 0.02 + Math.sin(index * 0.4) * 0.01
  
  return {
    lat: base.lat + latVariation,
    lng: base.lng + lngVariation,
  }
}

// Coordenadas específicas para restaurantes conocidos
export const specificCoordinates: Record<string, Coordinates> = {
  '1': { lat: 3.3731, lng: -76.5405 },   // Valle del Lili
  '2': { lat: 3.4589, lng: -76.5312 },   // Granada
  '3': { lat: 3.3634, lng: -76.5287 },   // Ciudad Jardín
  '4': { lat: 3.4487, lng: -76.5456 },   // San Antonio
  '5': { lat: 3.4423, lng: -76.5523 },   // Versalles
  '6': { lat: 3.4778, lng: -76.5276 },   // Chipichape
  '7': { lat: 3.3856, lng: -76.5389 },   // El Centenario
  '8': { lat: 3.4521, lng: -76.5345 },   // Juanambú
  '9': { lat: 3.4585, lng: -76.5318 },   // Granada
  '10': { lat: 3.4512, lng: -76.5334 },  // San Fernando
  '11': { lat: 3.3723, lng: -76.5412 },  // Valle del Lili
  '12': { lat: 3.4476, lng: -76.5467 },  // El Peñón
  '13': { lat: 3.3645, lng: -76.5298 },  // Ciudad Jardín
  '14': { lat: 3.4434, lng: -76.5512 },  // Versalles
  '15': { lat: 3.3845, lng: -76.5376 },  // El Centenario
  '16': { lat: 3.4767, lng: -76.5267 },  // Chipichape
  '17': { lat: 3.3656, lng: -76.5301 },  // Ciudad Jardín
  '18': { lat: 3.4598, lng: -76.5323 },  // Granada
  '19': { lat: 3.3745, lng: -76.5423 },  // Valle del Lili
  '20': { lat: 3.4498, lng: -76.5445 },  // San Antonio
}

export function getRestaurantCoordinates(id: string, zone: string, index: number): Coordinates {
  // Si tenemos coordenada específica, usarla
  if (specificCoordinates[id]) {
    return specificCoordinates[id]
  }
  
  // Si no, generar una basada en la zona
  return generateCoordinates(zone, index)
}
