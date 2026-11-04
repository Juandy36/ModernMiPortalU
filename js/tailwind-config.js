// Guía de estilo (escritorio 1280 px) convertida en tokens de Tailwind.
// Se carga justo después del script del CDN de Tailwind.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        unab: {
          DEFAULT: '#FFA400', // naranja principal
          dark: '#E58E00',    // naranja oscuro (fondos, bordes, hover)
          text: '#A35F00',    // naranja para texto sobre blanco o crema (contraste ≥ 4,5:1)
          cream: '#FFF3D6',   // fondos suaves
        },
        ink: '#333333',       // texto
        surface: '#F4F4F4',   // fondo claro
        // Solo para estados de clase / solicitudes (verde oscurecido para contraste con blanco)
        ok: '#23794A',
        danger: '#D64545',
        pending: '#FFA400',
      },
      fontFamily: {
        sans: ['Montserrat', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      fontSize: {
        h1: ['40px', { lineHeight: '1.2', fontWeight: '800' }],
        h2: ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        h3: ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      maxWidth: { page: '1280px' },
    },
  },
};
