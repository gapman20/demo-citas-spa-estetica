const staff = [
  {
    id: 1,
    slug: 'valentina-moreno',
    name: 'Valentina Moreno',
    title: 'Directora & Esteticista Principal',
    specialty: 'Faciales avanzados, tratamientos corporales',
    bio: 'Con más de 10 años de experiencia en estética integral, Valentina fundó Serenity Spa con la visión de crear un espacio donde la ciencia del cuidado de la piel se encuentra con el arte del bienestar. Especialista en tratamientos faciales personalizados.',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80',
    services: [1, 2, 8],
  },
  {
    id: 2,
    slug: 'catalina-rodriguez',
    name: 'Catalina Rodríguez',
    title: 'Masoterapeuta',
    specialty: 'Masajes terapéuticos y descontracturantes',
    bio: 'Catalina se formó en masoterapia clásica y técnicas orientales de relajación. Su enfoque combina precisión técnica con una sensibilidad única para detectar y liberar tensiones musculares.',
    photo: 'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=400&q=80',
    services: [3, 4],
  },
  {
    id: 3,
    slug: 'sofia-martinez',
    name: 'Sofía Martínez',
    title: 'Especialista en Depilación Láser',
    specialty: 'Depilación láser, cuidado facial',
    bio: 'Sofía es técnica en depilación láser y cosmiatría. Su trato cálido y su meticulosidad la convierten en la favorita de nuestras clientas para tratamientos de depilación y limpieza facial.',
    photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80',
    services: [5, 1],
  },
  {
    id: 4,
    slug: 'lucia-perez',
    name: 'Lucía Pérez',
    title: 'Nail Artist & Pedicura',
    specialty: 'Manicura, pedicura, diseños personalizados',
    bio: 'Lucía es nuestra nail artist con formación en diseño de uñas y cuidado del pie. Apasionada por el detalle, crea diseños únicos mientras garantiza la salud de uñas y manos.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    services: [6, 7],
  },
];

export default staff;

export function getStaffBySlug(slug) {
  return staff.find((s) => s.slug === slug) || null;
}
