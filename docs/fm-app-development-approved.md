# FM - Desarrollo aprobado hasta ahora

Documento conciso para continuar el desarrollo de la app FM / Funnel Manager.

## Enlaces

- App local: `http://127.0.0.1:4173/index.html#audiences`
- Audience Builder local: `http://127.0.0.1:4173/index.html?audienceDemo=1&audienceStep=review&builderSource=profiles#audienceBuilder`
- GitHub Pages: `https://mourdoch.github.io/funnel-manager/`
- Repositorio GitHub: `https://github.com/Mourdoch/funnel-manager`
- Figma Audience Section: `https://www.figma.com/design/piEDC1hdb7InydmUeaVdrs/TEG--.-Audience-Section`

## Estructura de la app

- `index.html`: shell principal de la SPA.
- `script.js`: estado, rutas, renderizado e interacciones.
- `styles.css`: tokens visuales, layouts, responsive, dark mode y componentes.
- Rutas actuales: `#home`, `#profiles`, `#audiences`, `#audienceBuilder`, `#aggregation`.

## Principios de UI aprobados

- La app usa patrones inspirados en Vuetify: tabs, cards, text fields, data tables, chips, menus y buttons.
- Mantener una interfaz compacta, operativa y orientada al trabajo.
- Usar tablas para lectura densa y cards para exploracion visual.
- Las acciones secundarias van en el menu `...`.
- Mantener soporte responsive en desktop y mobile.
- Mantener compatibilidad con dark mode.
- Si hay diseno de Figma, Figma es la referencia visual principal.
- Si no hay diseno de Figma, implementar manteniendo coherencia visual con la app existente.

## Variantes de componentes

- Chips: `tonal`.
- Avatars con iconos o texto: `tonal`.
- Acciones primarias: `flat`.
- Acciones secundarias: `tonal`.
- Cancelar, cerrar y acciones similares: `text`.
- Icon buttons: `text`, salvo que Figma indique otra cosa.
- Iconos dentro de icon buttons, radios y checkboxes: `16px x 16px`.
- Popups/modals: usar el estandar de Figma con header, body y footer. Evitar modales de resultado con icono grande centrado; los resultados deben resolverse con el flujo principal y snackbar/toast cuando sea suficiente.
- Botones dentro de cards/tables:
  - Primary action: `tonal`.
  - Secondary actions: `text`, dentro del menu `...`.

## Home

- Pantalla de entrada de Funnel Manager.
- Mantiene el rail/drawer de navegacion y el estilo visual general de la app.
- Debe conservar jerarquia compacta, sin composicion tipo landing page.

## Profile Explorer

- Permite buscar perfiles por identificador o atributos.
- Incluye filtros laterales, KPIs, tabla de perfiles y estados de carga.
- Filtros aprobados: categoria, fuente, actividad, fecha y edad.
- Puede iniciar Audience Builder desde una busqueda o filtros existentes.
- Si se entra al Builder desde Profile Explorer sin seleccion previa, no se muestra `Starting Audience`.

## Audience Viewer

- Vista por defecto: `table`.
- Tabs aprobados: `All`, `Active`, `Drafts`, `Paused`, `Error`.
- Cada tab puede mostrarse en `table` o `cards`.
- Incluye search por audiencia y sort por `Recently updated`, `Name` y `Profiles`.
- Secciones principales: `Needs attention` y `All audiences`.
- No debe existir color azul claro estatico en rows.
- En tabla, el boton principal permanece oculto hasta hover/focus del row.
- En cards, el boton principal queda visible dentro de la card.

### Mapeo de acciones por estado

| Estado | Boton principal | Acciones secundarias |
| --- | --- | --- |
| Draft | Continue editing | Delete, Duplicate |
| Ready | Activate | Edit |
| Active | View audience o Manage activation | Pause, Edit, Duplicate |
| Paused | Resume | Edit, Archive |
| Error / Needs attention | Resolve issue | View details, Edit |
| Archived | Restore | Delete permanently |

Reglas:

- Solo debe existir un boton principal visible por card o row.
- Las acciones secundarias van en el menu `...`.
- El boton principal representa el proximo paso logico.
- Una audiencia `Active` no muestra `Activate`.
- Una audiencia `Draft` no muestra `View audience` como accion principal.

## Audience Builder

- Soporta flujo desde cero y flujo desde Profile Explorer.
- Cuando viene desde Profile Explorer, conserva los criterios base.
- Estados principales: `compose` y `review`.
- La pantalla review muestra criterios base, audiencia estimada, condiciones generadas, breakdowns visuales y opciones de activacion.
- Acciones principales: cancelar flujo, guardar draft y activar audiencia.
- Save draft debe abrir flujo de guardado con nombre editable.
- Activate debe pedir nombre y frecuencia antes de activar.

### Activation options aprobadas

- Inline Campaign: Profile Attribute.
- Paid Media: CM360, DV360, GA360, Google Ads, Meta.
- App Push: Airship, 2Scale.
- Messaging: Cheetah (Email/SMS).

## Aggregations

- Vista con tabla de metricas.
- Incluye filtros por estado, metrica, periodo y tag.
- Permite crear nuevas agregaciones y alternar estados basicos.
- Las acciones secundarias deben mantenerse en menu `...`.

## Entrega y validacion

- Validaciones recomendadas:
  - `node --check script.js`
  - `git diff --check -- script.js styles.css`
  - QA local contra `http://127.0.0.1:4173/index.html#audiences`
- Verificar:
  - Audience Viewer abre por defecto en table.
  - Cambio table/cards por tab.
  - Search y sort.
  - CTAs segun estado.
  - CTA oculto en rows hasta hover/focus.
  - Mobile sin overflow horizontal.
  - Dark mode sin rupturas visuales.
- GitHub Pages refleja cambios solo despues de commit y push a `origin main`.
