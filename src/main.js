// src/main.js — ponto de entrada do Vite

// ── Fontes self-hosted (substituem o Google Fonts externo) ──
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/500.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';
import '@fontsource/share-tech-mono/400.css';
import '@fontsource/exo-2/300.css';
import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/500.css';
import '@fontsource/exo-2/600.css';
import '@fontsource/exo-2/300-italic.css';

// ── Estilos: Tailwind v4 + tema Datapad Imperial existente ──
import './styles/main.css';

// ── Alpine.js (disponível para migração incremental dos componentes) ──
import Alpine from 'alpinejs';
window.Alpine = Alpine; // expõe para o DevTools
// Componentes Alpine (registrados antes do start), um por vez:
import './components/attributes.js';

// ── Lógica principal da ficha (importa os dados via ES Modules) ──
import '../js/script.js';

// Inicia o Alpine após registrar componentes e carregar a lógica.
Alpine.start();
