import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

export default defineConfig({
  plugins: [react(), ckeditor5({})],
});
