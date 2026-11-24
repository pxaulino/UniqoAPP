# Informe de estabilidad · Demo 1.0

## Migración incremental a Expo SDK 58

Se trabajó sobre `feature/demo-v1-stability` con los cambios locales de la demo. Al iniciar ya figuraban eliminaciones locales en los archivos de Supabase, Firebase y servicios relacionados. La migración conserva ese estado.

| Etapa | Expo | React Native | React | Revisión |
| --- | --- | --- | --- | --- |
| Base | 54.0.38 | 0.81.5 | 19.1.0 | Demo local y documento académico v1 ya implementados. |
| 54 → 55 | 55.0.32 | 0.83.10 | 19.2.0 | La Nueva Arquitectura pasa a ser obligatoria. Se corrigieron los tipos de esquema de color y nombres de símbolos. Se retiraron las opciones redundantes de arquitectura y edge-to-edge del manifiesto. |
| 55 → 56 | 56.0.24 | 0.85.3 | 19.2.3 | Expo Router desacopla React Navigation. El componente háptico usa `Pressable`, y las rutas siguen usando Expo Router. Se retiró la propiedad eliminada de color de fondo de `StatusBar` y se actualizó TypeScript. |
| 56 → 57 | 57.0.34 | 0.86.3 | 19.2.3 | Se alinearon Reanimated y Worklets con las versiones de Expo, que incluyen las correcciones de Hermes V1. |
| 57 → 58 | 58.0.26 | 0.88.1 | 19.3.0 | Se revisaron la API estricta de React Native, los cambios del núcleo de Expo Router, el inicio de Expo Go y el manifiesto. Web conserva explícitamente `web.output: "single"` para la recarga de rutas del pensum. |

Notas oficiales de [SDK 55](https://expo.dev/changelog/sdk-55), [SDK 56](https://expo.dev/changelog/sdk-56), [SDK 57](https://expo.dev/changelog/sdk-57), [SDK 58](https://expo.dev/changelog/sdk-58) y [Expo Router 58](https://docs.expo.dev/router/migrate/sdk-57-to-58/).

### Versiones resueltas

| Dependencia | SDK 54 | SDK 58 |
| --- | --- | --- |
| Expo Router | 6.0.24 | 58.0.32 |
| React DOM | 19.1.0 | 19.3.0 |
| NativeWind | 4.2.3 | 4.2.7 |
| Reanimated | 4.1.7 | 4.7.1 |
| Worklets | 0.5.1 | 0.13.0 |
| AsyncStorage | 2.2.0 | 2.2.0 |
| Gesture Handler | 2.28.0 | 3.3.0 |
| Screens | 4.16.0 | 4.30.1 |
| Safe Area Context | 5.6.2 | 5.11.1 |
| React Native SVG | 15.12.1 | 15.16.0 |
| React Native Web | 0.21.2 | 0.21.4 |
| Tipos de React | 19.1.17 | 19.3.0 |
| TypeScript | 5.9.3 | 6.0.3 |
| Babel preset de Expo | 54.0.12 | 58.0.26 |
| ESLint config de Expo | 10.0.0 | 58.0.4 |
| Blur | 15.0.8 | 58.0.6 |
| Constants | 18.0.14 | 58.0.16 |
| Font | 14.0.12 | 58.0.12 |
| Haptics | 15.0.8 | 58.0.8 |
| Image | 3.0.11 | 58.0.18 |
| Linear Gradient | 15.0.8 | 58.0.4 |
| Linking | 8.0.12 | 58.0.17 |
| Splash Screen | 31.0.13 | 58.0.14 |
| Status Bar | 3.0.9 | 58.0.5 |
| Symbols | 1.0.8 | 58.0.5 |
| System UI | 6.0.9 | 58.0.7 |
| Web Browser | 15.0.11 | 58.1.0 |

AsyncStorage 2.2.0 es la versión que Expo incluye y recomienda para SDK 58. Se mantienen las claves del documento, del respaldo y de recuperación, junto con el formato y las reglas de validación. [Referencia de AsyncStorage en Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/)

NativeWind 4.2.7 es la versión estable disponible. Se conservan el tema Tailwind 3 y el preset de NativeWind en Babel. El preset de NativeWind ya carga el transformador de Worklets a través de Reanimated, por lo que se desactiva la segunda carga en el preset de Expo. [Instalación de NativeWind v4](https://www.nativewind.dev/docs/getting-started/installation)

### Archivos y correcciones

| Archivos | Cambio |
| --- | --- |
| `package.json`, `package-lock.json`, `babel.config.js` | Dependencias instaladas por etapa con las versiones de Expo. Se usa un único transformador de Worklets. |
| `app.json`, `app/_layout.tsx`, `components/haptic-tab.tsx` | Configuración de la Nueva Arquitectura y edge-to-edge según el SDK, ajuste de la barra de estado y eliminación de imports directos de React Navigation. |
| `hooks/use-color-scheme.ts`, `hooks/use-color-scheme.web.ts`, `components/ui/icon-symbol.tsx` | Valores de esquema normalizados, lectura estable durante la hidratación web y nombres de iconos verificados por TypeScript. |
| `components/AnimatedBottomSheet.tsx`, `tsconfig.test.json` | Referencia nativa `ViewInstance` y resolución de módulos Node16 para las pruebas con TypeScript 6. |
| `app/calendario.tsx`, `components/action-center/AcademicActionCenter.tsx`, `components/action-center/ActionCard.tsx`, `components/action-center/FloatingActionButton.tsx`, `components/ui/FloatingTabBar.tsx`, `components/ui/IconButton.tsx` | Actualizaciones de animación con `SharedValue.set()`. La visibilidad de los paneles sigue el estado que los abre y los campos del horario ya no reinician su animación al editarse. El botón central tiene nombre accesible. |
| `tests/demo.web.cjs`, `README.md`, `DEMO_V1.md` | Prueba de navegación al horario y persistencia, pasos de Expo Go e informe de migración. |

Se conservaron tres excepciones puntuales a `react-hooks/refs` en las llamadas a `PanResponder.create`. React Native registra esas funciones y las ejecuta al recibir eventos de gesto. Las referencias se leen en esos eventos, fuera del renderizado.

### Verificación de SDK 58

Windows, Node.js 22.18.0, npm 10.9.3 y Chrome. TypeScript, la comprobación de dependencias de Expo y las diez pruebas académicas pasaron en cada etapa intermedia, tras aplicar sus correcciones.

| Control | Resultado |
| --- | --- |
| `npm run typecheck` | Salida 0 con la API estricta de React Native 0.88. |
| `npm run lint` y `npx eslint .` | Salida 0. |
| `npx expo install --check` | Dependencias alineadas con SDK 58. |
| `npx expo-doctor` | 20 de 20 comprobaciones aprobadas. |
| `npm test` | 10 de 10 pruebas aprobadas, incluidas migración local v0, recuperación y cálculos académicos. |
| `npm run test:web` | 4 de 4 pruebas aprobadas en Chrome contra la exportación. Cubren alta y edición de materias, progreso y reapertura, rutas directas, reinicio, recuperación y el acceso al horario desde el centro académico. Los selectores distinguen las pantallas activas de las que Expo Router marca como `inert`. |
| `npx expo export --platform all --output-dir .expo/sdk58-final --max-workers 3` | Exportación web y bundles Hermes de Android e iOS generados. |
| Metro local en modo Expo Go | HTTP 200 para los manifiestos Android e iOS, ambos con `sdkVersion: "58.0.0"`. Se descargaron el icono del manifiesto y los dos bundles de desarrollo. |
| Actualización de datos en Chrome | SDK 54 guardó un perfil, un pensum y una materia con nota 90. SDK 58, servido en el mismo origen, mostró 4 de 20 créditos y promedio 90.00. El contenido serializado v1 coincidió byte por byte. |

**Pruebas pendientes en dispositivos.** Abrir el QR en un iPhone real y un Android con Expo Go SDK 58 y comprobar arranque, navegación y persistencia con datos de esa instalación. Los pasos están en el [README](README.md#expo-go-en-iphone-y-android).

## Base del trabajo

Rama local `feature/demo-v1-stability`, creada desde `0ba84a8`. El checkout local y el repositorio indicado en la solicitud, con HEAD `1978a13`, divergen a partir de `81fbd37`. La rama se basó en el checkout del espacio de trabajo para incorporar los dos commits locales. El trabajo quedó en la rama local.

Se revisaron el manifiesto y el lockfile, Expo y Metro, TypeScript y ESLint, la configuración de rutas, los servicios remotos, el estado global, los formularios, las pantallas y los componentes compartidos.

## Línea base reproducida

| Control | Resultado en el código original |
| --- | --- |
| `npm ci` | Falló con `EPERM` al reemplazar el binario de Lightning CSS porque un Metro anterior lo tenía abierto. Tras cerrar ese proceso, la instalación limpia terminó con 980 paquetes. |
| `tsc --noEmit` | Dos errores en una copia de `0ba84a8`. `TS2307` en `firebase/auth` y `TS7006` en el parámetro del observador de autenticación. |
| ESLint | Ocho errores `import/no-unresolved` de Firebase en la entrada y los servicios. En Windows se requirió permiso para recorrer las rutas ancestras durante la resolución de imports. |
| Expo Doctor | 17 de 18 comprobaciones. Marcó la coexistencia de `app.json` y `app.config.js`. |
| `npm test` | Falló porque el proyecto carecía de un script o suite de pruebas. |

La auditoría de código encontró además que el estado se descartaba al cerrar la app, la acción de aprobar sumaba créditos en cada llamada, varias rutas mostraban otros registros al no encontrar un ID y varios botones mostraban confirmaciones o estadísticas de ejemplo.

## Bugs corregidos

| Prioridad | Hallazgo | Corrección |
| --- | --- | --- |
| P0 | La entrada y el inicio dependían de Firebase. Un checkout limpio impedía resolver sus imports. | El arranque carga el documento local y abre la demo. Las rutas anteriores de sesión redirigen a Inicio. Se retiraron los servicios remotos y dependencias sin consumidores en la demo. |
| P0 | El arranque web producía una excepción de NativeWind al cambiar el esquema de color. Expo Doctor detectó la configuración duplicada y cuatro parches pendientes durante la implementación. | Se configuró el modo oscuro por clase, se consolidó la configuración estática de Expo y se actualizaron parches dentro del SDK 54. |
| P0 | Después de actualizar Expo, Babel dejó de resolver su preset desde la raíz durante una exportación limpia. | El manifiesto declara el preset con la versión que usa Expo SDK 54. |
| P1 | El estado inicial estaba precargado con valores de ejemplo y cada aprobación volvía a acumular créditos. | Un dominio tipado y un almacén Zustand calculan estados, créditos, promedios y progreso a partir de las notas y reglas guardadas. La aprobación masiva aplica un único cambio validado. |
| P1 | El perfil, el pensum, los períodos y las materias no se guardaban desde la interfaz. | Los formularios editan los registros reales y muestran errores de validación. Las eliminaciones y el reinicio piden confirmación. Las escrituras se serializan y el estado visible cambia al confirmar la escritura. |
| P1 | Se perdían datos al cerrar la app y no había recuperación. | AsyncStorage persiste un documento versionado en Android, iOS y web. La app recupera una copia válida y archiva la entrada ilegible. Un documento de una versión futura requiere una decisión explícita. |
| P1 | El detalle de una materia o universidad desconocida caía en un registro de muestra. | Las rutas dinámicas muestran un estado de ausencia y tienen regreso de respaldo. Web usa salida SPA para recargar materias creadas después de compilar. |
| P2 | El mapa, el simulador, los reportes, las sugerencias y el horario mostraban datos de ejemplo. | Consumen el mismo estado local. El mapa usa prerrequisitos, el simulador estima créditos y promedio y el horario conserva sus cambios al reabrir. Se conservó la navegación y el estilo visual de Inicio, ficha de materia, perfil, catálogo y planificador. |

## Ejecución y límites

Los pasos de instalación y la prueba manual están en el [README](README.md). La carga de pensum es manual y usa un pensum activo y una nota final por materia. La demo conserva datos en el mismo dispositivo o el mismo origen y perfil de navegador. Los servicios en la nube, la extracción de archivos, el historial de intentos y las notificaciones push quedan para otra versión.

## Verificación histórica · Expo SDK 54

Entorno Windows con Node 22.18.0, npm 10.9.3 y Chrome 157.0.8103.80.

| Control | Resultado |
| --- | --- |
| `npm ci` | Salida 0. Instalación limpia final con 984 paquetes y ningún aviso crítico. |
| `tsc --noEmit` | Salida 0. |
| `npm run lint` y `npx eslint .` | Salida 0, sin errores ni advertencias de ESLint. |
| `npx expo-doctor` | 18 de 18 comprobaciones pasaron. |
| `npm test` | 10 de 10 pruebas pasaron. Cubren cálculo académico, reglas de notas, CRUD, escrituras concurrentes, fallo de persistencia, migración, recuperación y reinicio. |
| `npx expo export --platform all --output-dir .expo/demo-build --max-workers 3` | Generó los archivos web y los bundles Hermes de Android e iOS. |
| `npm run test:web` | 3 de 3 pruebas pasaron en Chrome contra la exportación de producción. |

En Chrome se creó un perfil, un pensum y un período, se rechazó una nota fuera de escala, se corrigió y editó la nota y se reabrió la ficha de la materia. El progreso quedó en 20 %, con 4 de 20 créditos y promedio de 3.80 sobre 4. El escenario comprobó que la app no realizó solicitudes fuera del servidor local ni lanzó excepciones en la página. Los otros escenarios comprobaron el regreso desde un ID inexistente, la confirmación del reinicio y la restauración del último respaldo válido con datos de prueba. En una pasada adicional se guardó una entrada del horario y se comprobó después de recargar, se registró una nota con la aprobación masiva y se recorrieron las rutas del mapa, catálogo, simulador, métricas, ruta académica, sugerencias, recordatorios, asistente y logros.

- **Android.** Se generó el bundle. El intento `npx expo start --android --offline --port 8088` terminó porque faltaban Android SDK y `adb`. Falta ejecutar la prueba manual en un dispositivo o emulador.
- **iOS.** Se generó el bundle. La ejecución queda pendiente en macOS con Xcode o en un dispositivo con un cliente compatible.
- **Dependencias.** Se actualizó `shell-quote` dentro de su rango compatible. `npm audit --omit=dev` todavía reportó 24 avisos, incluidos 9 altos y 0 críticos. Resolver todos los avisos requiere una revisión aparte de las dependencias transitivas del SDK.


