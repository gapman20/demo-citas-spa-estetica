const clinic = {
  name: 'Serenity Spa',
  address: 'Av. del Bienestar 1234, CABA, Argentina',
  phone: '+54 11 5555-0123',
  email: 'info@serenityspa.com.ar',
  socialLinks: [
    { platform: 'instagram', url: '#' },
    { platform: 'facebook', url: '#' },
    { platform: 'whatsapp', url: '#' },
  ],
  hours: [
    { day: 'Lunes a Viernes', hours: '09:00 – 20:00' },
    { day: 'Sábados', hours: '10:00 – 18:00' },
    { day: 'Domingos', hours: 'Cerrado' },
  ],
  mapCoordinates: {
    lat: -34.603722,
    lng: -58.381592,
  },
};

export default clinic;
