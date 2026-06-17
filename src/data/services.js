const services = [
  {
    id: 1,
    slug: 'limpieza-facial-profunda',
    name: 'Limpieza Facial Profunda',
    category: 'facial',
    duration: 60,
    price: 3500,
    description:
      'Tratamiento completo de higiene facial que incluye limpieza de poros, extracción de comedones, exfoliación suave y mascarilla nutritiva. Ideal para eliminar impurezas y renovar la piel.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  },
  {
    id: 2,
    slug: 'hidratacion-facial-avanzada',
    name: 'Hidratación Facial Avanzada',
    category: 'facial',
    duration: 45,
    price: 2800,
    description:
      'Tratamiento intensivo con ácido hialurónico y vitaminas que restaura la barrera cutánea, devuelve la luminosidad y combate la deshidratación.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80',
  },
  {
    id: 3,
    slug: 'masaje-descontracturante',
    name: 'Masaje Descontracturante',
    category: 'massage',
    duration: 60,
    price: 4000,
    description:
      'Masaje terapéutico enfocado en nudos y contracturas musculares. Técnicas de amasamiento profundo y presión sostenida para aliviar tensiones acumuladas.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
  },
  {
    id: 4,
    slug: 'masaje-relajante-con-aceites',
    name: 'Masaje Relajante con Aceites Esenciales',
    category: 'massage',
    duration: 75,
    price: 4500,
    description:
      'Un viaje sensorial con aceites esenciales seleccionados. Movimientos suaves y envolventes que inducen un estado profundo de relajación y bienestar.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
  },
  {
    id: 5,
    slug: 'depilacion-definitiva-laser',
    name: 'Depilación Definitiva Láser',
    category: 'hair-removal',
    duration: 30,
    price: 2500,
    description:
      'Tecnología láser de última generación para eliminación definitiva del vello. Tratamiento indoloro y efectivo para todas las zonas del cuerpo.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80',
  },
  {
    id: 6,
    slug: 'manicura-spa',
    name: 'Manicura Spa',
    category: 'nails',
    duration: 45,
    price: 2200,
    description:
      'Experiencia completa de cuidado de manos que incluye exfoliación, mascarilla hidratante, cutículas y esmaltado semipermanente.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  },
  {
    id: 7,
    slug: 'pedicura-spa',
    name: 'Pedicura Spa',
    category: 'nails',
    duration: 50,
    price: 2600,
    description:
      'Cuidado integral de pies con exfoliación, mascarilla reconfortante, cutículas y esmaltado semipermanente. Tus pies merecen este mimo.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80',
  },
  {
    id: 8,
    slug: 'tratamiento-corporal-reductor',
    name: 'Tratamiento Corporal Reductor',
    category: 'body',
    duration: 75,
    price: 5200,
    description:
      'Combinación de radiofrecuencia y cavitación para reducir medidas y mejorar la textura de la piel. Resultados visibles desde la primera sesión.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80',
  },
];

export default services;

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug) || null;
}

export function getServicesByCategory(category) {
  return services.filter((s) => s.category === category);
}

export const categories = [
  { id: 'facial', label: 'Faciales' },
  { id: 'body', label: 'Corporales' },
  { id: 'massage', label: 'Masajes' },
  { id: 'hair-removal', label: 'Depilación' },
  { id: 'nails', label: 'Manicura & Pedicura' },
];
