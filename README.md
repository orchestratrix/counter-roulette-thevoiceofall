# La Voz de Todos — Marcador

Scoreboard SPA proyectado al público durante las semifinales y la gran final
del reality educativo **La Voz de Todos** (Fundación Maryarte · Canal Trece ·
Congreso de la República). La aplicación NO maneja preguntas — un moderador
opera los puntajes desde su pantalla y la audiencia ve el marcador en vivo.

## Stack

- Vue 3.5 (`<script setup>` / Composition API)
- Vite 7
- Quasar 2.18 (componentes UI + iconos MDI)
- Pinia 3 + `pinia-plugin-persistedstate`
- pnpm

## Comandos

```bash
pnpm install      # instala dependencias
pnpm dev          # servidor de desarrollo en http://localhost:5173
pnpm build        # build de producción → dist/
pnpm preview      # sirve el build localmente para verificar
```

## Deploy

El deploy es automático vía la integración **GitHub → Vercel**. Cada push a
`main` dispara un build. El `vercel.json` incluido configura los rewrites
para que las rutas SPA (`/semifinal-caribe`, `/final`, etc.) funcionen al
recargar.

No se requieren pasos manuales desde el contenedor o desde la orquesta.

## Operación durante el evento

### Antes de empezar
1. Abrir la app en pantalla completa proyectada (1920×1080+ recomendado).
2. Verificar que las 8 fotos cargan correctamente en cada semifinal.
3. Si quedaron puntajes de pruebas previas, usar el botón de reinicio total
   (icono ↻ en la esquina superior derecha del header).

### Durante una semifinal
- Navegar a **Semifinal Caribe** o **Semifinal Andina**.
- Cada card tiene controles al lado derecho:
  - **✓ verde:** suma un acierto
  - **✗ rojo:** suma un error
  - **− gris:** resta uno (corregir si se equivocó)
  - **estrellas:** asignar nota oral de 1 a 5 (ronda final argumentativa)
  - **↻ gris:** reiniciar puntajes de ese participante (con confirmación)
- El header muestra el líder actual de la región o "Sin definir" si hay empate.
- Los puntajes persisten al recargar la página.

### Resolver empates
Si dos o más participantes terminan empatados en una semifinal, la app
**no avanza a la final**. El moderador hace preguntas extra fuera de la
aplicación y registra los nuevos aciertos en la card del ganador hasta
romper el empate.

### Gran Final
- Cuando ambas semifinales tienen ganador único, navegar a **Gran Final**.
- Si falta resolver algún empate, la vista lo indica y ofrece atajos a la
  semifinal pendiente.
- Los dos finalistas aparecen lado a lado. Mismos controles que en semifinal.
- El líder tiene un brillo dorado animado.
- Al hacer click en **Coronar Campeón**, se pide confirmación y se dispara
  la animación de confetti.
- Si quedan empatados, no se permite coronar — aplicar la misma regla de
  preguntas extra.

### Reiniciar
- **Reinicio individual:** botón ↻ dentro de los controles de cada card.
- **Reinicio total:** botón ↻ en el header (limpia los 8 puntajes + campeón).

## Estructura

```
src/
├── components/
│   ├── ParticipantCard.vue       # card Panini con foto + scores
│   ├── ParticipantControls.vue   # botones de scoring del moderador
│   └── ConfettiCelebration.vue   # animación de coronación
├── composables/
│   └── useAnimatedNumber.js      # interpolación numérica suave
├── layouts/
│   └── mainLayout.vue            # header + drawer
├── store/
│   └── participants.js           # Pinia store (datos + getters + actions)
├── views/
│   ├── homeView.vue              # selector + mini-marcador de estado
│   ├── semifinalView.vue         # 4 cards de una región
│   └── finalView.vue             # 2 finalistas + coronación
├── router/
│   └── router.js
├── quasar-variables.sass         # paleta Colombia
├── main.js
└── style.css

public/
└── officials/                    # fotos de los 8 participantes
```