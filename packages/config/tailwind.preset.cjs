// Preset Tailwind compartido del monorepo forestalpark-web.
// Contiene la paleta canónica de marca + fuentes. Overrides locales
// (typography, etc.) en cada app.
//
// ESQUELETO fase `estructura`: paleta provisional orientada a naturaleza
// (parque de aventura en los árboles). Los valores definitivos y la
// verificación de contraste AAA (>=7:1) se fijan en la fase de diseño/migración.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Verde bosque — provisional, pendiente de validación AAA en fase diseño.
        primary: {
          DEFAULT: '#1B5E20', // Verde bosque oscuro
          dark: '#0F3D14',
          light: '#4C8C50',
        },
        secondary: {
          DEFAULT: '#2D2D2D', // Texto principal sobre blanco (12.6:1, AAA)
          dark: '#1a1a1a',
          light: '#4a4a4a',
        },
        accent: '#F57F17', // Naranja aventura — provisional
        error: '#B00020',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
