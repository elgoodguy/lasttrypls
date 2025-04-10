interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  // Agrega aquí otras variables de entorno si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 