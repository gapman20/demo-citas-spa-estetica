const gallery = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80',
    alt: 'Sala de espera principal con iluminación cálida',
    category: 'facilities',
    caption: 'Nuestra recepción — el primer contacto con la tranquilidad',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80',
    alt: 'Cabina de tratamiento con camilla profesional',
    category: 'facilities',
    caption: 'Cabinas equipadas para tu comodidad',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80',
    alt: 'Aplicación de mascarilla facial',
    category: 'treatments',
    caption: 'Limpieza facial profunda con productos premium',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    alt: 'Masaje de espalda con aceites esenciales',
    category: 'treatments',
    caption: 'Masaje descontracturante en acción',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    alt: 'Aceites esenciales y piedras calientes',
    category: 'treatments',
    caption: 'Nuestros aceites esenciales importados',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
    alt: 'Manos con esmaltado semipermanente',
    category: 'treatments',
    caption: 'Manicura Spa con esmaltado semipermanente',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    alt: 'Productos de skincare importados',
    category: 'treatments',
    caption: 'Línea de productos que utilizamos en cada tratamiento',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80',
    alt: 'Valentina Moreno, directora de Serenity Spa',
    category: 'staff',
    caption: 'Valentina Moreno — Directora & Esteticista Principal',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=600&q=80',
    alt: 'Catalina Rodríguez realizando un masaje',
    category: 'staff',
    caption: 'Catalina Rodríguez — Masoterapeuta',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80',
    alt: 'Sofía Martínez en cabina de depilación láser',
    category: 'staff',
    caption: 'Sofía Martínez — Especialista en Depilación Láser',
  },
];

export default gallery;

export function getGalleryByCategory(category) {
  return gallery.filter((g) => g.category === category);
}
