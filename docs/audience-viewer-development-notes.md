# FM - Notas de desarrollo aprobadas

Documento conciso del estado aprobado para el desarrollo de la app FM.

## Enlaces

- App local: `http://127.0.0.1:4173/index.html#audiences`
- GitHub Pages: `https://mourdoch.github.io/funnel-manager/`
- Repositorio: `https://github.com/Mourdoch/funnel-manager`
- Figma Audience Section: `https://www.figma.com/design/piEDC1hdb7InydmUeaVdrs/TEG--.-Audience-Section?node-id=6014-19472`

## Estructura actual

- `index.html`: shell principal de la SPA.
- `script.js`: estado, rutas, renderizado e interacciones.
- `styles.css`: tokens visuales, layout responsive, dark mode y componentes.
- Rutas principales:
  - `#home`
  - `#profiles`
  - `#audiences`
  - `#audienceBuilder`
  - `#aggregation`

## Reglas generales de UI

- La app usa patrones visuales inspirados en Vuetify: tabs, cards, text fields, data tables, chips, menus y buttons.
- Mantener el diseno compacto, operativo y orientado a trabajo.
- Usar tabla para lectura densa y cards para exploracion visual.
- Evitar acciones secundarias visibles fuera del menu `...`.
- Mantener soporte responsive para desktop y mobile.
- Mantener dark mode compatible con los componentes existentes.

## Reglas generales de implementación

-La información de los componentes búscalos siempre en las páginas de Vuetify  https://vuetifyjs.com/en/components/bottom-sheets/#usage
-Si se solicita una acción de implementación en la aplicación sin un diseño de Figma generarlo manteniendo la coherencia visual de la aplicación
-Si se solicita una acción de implementación con un diseño de Figma, este será la referencia visual para la implementación. Deberás hacer preguntas sobre el funcionamiento y behaviour después de revisar los diseños para implementar todo lo más exacto posible  

## Reglas generales de UI (las variantes las encontrarás en las páginas de Vuetify)

-Todos los chips usados en la interfaz serán variant: tonal <v-btn variant="tonal">  
-Todos los Avatars with icons and text serán variant: tonal  
-Mapeo de botones:
	-Botones de acciones primarias: variant: flat
	-Botones se acciones secundarias: Variant: tonal
-Botones para acciones como cerrar, cancelar y similares: variant: text
-Icon buttons: A menos que sea especificado en el diseño de Figma la variante por defecto es : variant: text
-Los iconos dentro de icon buttons, radios y checkboxes tendran tamano 16px x 16px.
-Los botones dentro de cards y tables serán: 
	-Primary action: variant: tonal
	-Secondary actions: variant: text.Las acciones secundarias van en el menu `...`. 

## Profile Explorer

- Permite busqueda por identificador o atributos.
- Puede abrir/cerrar filtros laterales.
- Tiene KPIs, tabla de perfiles, filtros por categoria/fuente/actividad/fecha/edad y estados de carga.
- Puede iniciar Audience Builder a partir de filtros existentes.

## Audience Viewer

- Vista por defecto: `table`.
- Tabs aprobados:
  - All
  - Active
  - Drafts
  - Paused
  - Error
- Cada tab puede mostrarse en `table` o `cards`.
- Incluye search por audiencia y sort por:
  - Recently updated
  - Name
  - Profiles
- Secciones principales:
  - Needs attention
  - All audiences
- No debe existir color azul claro estático en rows. No lo incorpores en caso de que lo detectes en los diseños de Figma. Interpéralo como un ejemplo de hover para mostrar qué componentes se vuelven visibles al hacer hover. (No apliques el color tampoco es solo behaviour)
- En tabla, el boton principal de accion permanece oculto hasta hover/focus del row.
- En cards, el boton principal queda visible dentro de la card.

### Mapeo de acciones por estado

| Estado | Boton principal | Acciones secundarias |
| --- | --- | --- |
| Draft | Continue editing | Delete, Duplicate |
| Ready | Activate | Edit |
| Active | View audience | Pause, Edit, Duplicate |
| Paused | Resume | Edit, Archive |
| Error / Needs attention | Resolve issue | View details, Edit |
| Archived | Restore | Delete permanently |

Reglas:

- Solo un boton principal visible por card o row.
- Las acciones secundarias van en el menu `...`.
- El boton principal representa el proximo paso logico.
- Una audiencia Active no muestra Activate.
- Una audiencia Draft no muestra View audience como accion principal.

## Audience Builder

- Soporta flujo desde cero o desde Profile Explorer.
- Cuando viene desde Profile Explorer, conserva criterios base.
- Estados principales:
  - compose
  - review
- Puede generar condiciones, estimacion, breakdowns y opciones de activacion.
- La pantalla de review muestra:
  - criterios base
  - audiencia estimada
  - condiciones generadas
  - desglose visual
  - canales de activacion
- Puede guardar draft, activar audiencia o cancelar el flujo.

## Aggregations

- Vista con tabla de metricas.
- Incluye filtros por estado, metrica, periodo y tag.
- Permite crear nuevas agregaciones y alternar estados basicos.

## Validaciones usadas

- `node --check script.js`
- `git diff --check -- script.js styles.css`
- QA local en Chrome contra `http://127.0.0.1:4173/index.html#audiences`
- Verificaciones realizadas:
  - table default en Audience Viewer
  - cambio table/cards por tab
  - busqueda y sort
  - CTAs segun estado
  - CTA oculto en rows hasta hover/focus
  - responsive mobile sin overflow horizontal

## Notas de entrega

- Los cambios locales principales viven en `script.js` y `styles.css`.
- El servidor local debe estar activo para revisar `127.0.0.1:4173`.
- GitHub Pages solo refleja cambios despues de commit y push a `origin main`.
