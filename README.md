# UniqoAPP · Demo 1.0

UniqoAPP organiza tus estudios con un perfil local, un pensum activo y tus propias materias y notas. Puedes registrar y consultar datos sin crear una cuenta. La demo usa Expo SDK 58, Expo Router, TypeScript, Zustand y AsyncStorage.

## Arranque

Instala Node.js 22 LTS (22.13 o superior dentro de la serie 22) y npm. Ejecuta estos comandos desde el directorio del proyecto.

```sh
npm ci
npm run web
```

Abre la dirección local que imprime Expo. Si Windows indica que Lightning CSS está en uso, cierra Metro y repite la instalación. En PowerShell, si la política de ejecución bloquea `npm.ps1`, usa `npm.cmd` y `npx.cmd`.

| Comando | Uso |
| --- | --- |
| `npm start` | Arranca Metro y muestra las opciones de Expo. |
| `npm run android` | Abre la app en un emulador o dispositivo Android configurado. |
| `npm run ios` | Abre la app en un simulador iOS en macOS con Xcode. |
| `npm run web` | Abre la demo web en el navegador. |
| `npm run typecheck` | Comprueba TypeScript sin emitir archivos. |
| `npm run lint` | Ejecuta ESLint con la configuración de Expo. |
| `npm test` | Ejecuta las pruebas de cálculo, validación, CRUD y almacenamiento. |
| `npx expo-doctor` | Verifica la configuración y compatibilidad con Expo. |
| `npx expo export --platform web` | Genera el sitio web en `dist/`. Puedes probarlo con `npx serve -s dist`, que sirve `index.html` al recargar rutas internas. |
| `npx expo export --platform android` | Genera el bundle Android para verificar el empaquetado. |
| `npx expo export --platform ios` | Genera el bundle iOS para verificar el empaquetado. |

### Expo Go en iPhone y Android

1. Instala o actualiza Expo Go a una edición que indique **Supported SDK 58.0.0**. [Descargar Expo Go](https://expo.dev/go)
2. En un iPhone físico, inicia sesión con la misma cuenta de Expo en la CLI y en Expo Go. Ejecuta `npx expo login` en el equipo y usa el icono de cuenta en Expo Go. Esta cuenta es para abrir el proyecto de desarrollo. La demo guarda sus datos localmente. [Requisito de inicio de sesión en iOS](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/)
3. Conecta el equipo y el teléfono a la misma red Wi-Fi y ejecuta estos comandos.

   ```sh
   npm ci
   npx expo start --go --lan --clear
   ```

4. Escanea el QR nuevo desde la Cámara en iOS o desde Expo Go en Android. En iOS, concede a Expo Go acceso a la red local si el sistema lo solicita.
5. Si el QR da timeout, abre en el navegador del teléfono la IP y el puerto que muestra Metro, con `http://` y la ruta `/status`. Debe aparecer `packager-status:running`. Si esa página no carga, detén Metro con `Ctrl+C`, inicia sesión con `npx expo login` y ejecuta `npx expo start --go --tunnel`. [Túnel de Expo SDK 58](https://expo.dev/changelog/sdk-58#a-faster-more-reliable-expo-cli-tunnel)

Para probar la persistencia tras actualizar, conserva la instalación de Expo Go, abre el mismo proyecto y comprueba primero las materias y notas existentes. La exportación de bundles comprueba el empaquetado. La prueba manual en el teléfono comprueba el arranque, el diseño y el acceso al almacenamiento de esa instalación.

## Prueba manual

1. Desde **Inicio**, elige **Crear perfil** o abre **Perfil → icono de ajustes (Editar perfil)** y guarda un nombre. El correo es opcional.
2. En **Inicio**, elige **Agregar universidad y pensum**. Escribe universidad, carrera y versión del pensum. Para esta prueba usa 20 créditos requeridos, escala de 0 a 100 y nota mínima aprobatoria de 70. Guarda y abre **Mis estudios**.
3. Agrega un período, por ejemplo `2026-2`, déjalo activo y guarda. Agrega **MAT101 · Álgebra** con 4 créditos y nota 90. Agrega **FIS101 · Física** con 2 créditos y nota 60 en el mismo período. El formulario acepta `3,5` y `3.5` en escalas decimales.
4. Desde **Inicio → Ver progreso**, comprueba que tienes **1 materia aprobada**, **4 de 20 créditos**, **20 %** de progreso y **80.00** de promedio con las opciones predeterminadas.
5. En **Mis estudios**, abre **Física → Editar materia y nota**, guarda una nota de 75 y vuelve a **Mi Progreso**. El resultado esperado es **2 materias aprobadas**, **6 de 20 créditos**, **30 %** y **85.00** de promedio.
6. Cierra la pestaña o la app, ábrela con el mismo navegador y origen o en el mismo dispositivo y vuelve a consultar las notas. En web también puedes recargar el enlace de una materia.
7. Si usas un perfil de prueba, puedes volver a **Perfil → Editar perfil → Reiniciar datos demo**. La app pide confirmación antes de vaciar el conjunto activo y su copia de respaldo.

El menú central ofrece **Marcar aprobada** para aplicar una misma nota aprobatoria a varias materias. Puedes registrar una nota distinta por materia desde su ficha. El mapa dibuja los prerrequisitos que selecciones al editarlas. El horario guarda una entrada semanal por materia. Para eliminar un período, mueve primero sus materias a otro período o déjalas sin período.

## Pruebas web automatizadas

Instala Chromium con `npx playwright install chromium`. En una terminal inicia Expo con `npx expo start --offline --port 8087` y, en otra, ejecuta `npm run test:web`.

La suite usa un contexto de navegador aislado. Puedes probar una URL distinta con `UNIQO_WEB_URL` o un Chrome instalado con `UNIQO_BROWSER_CHANNEL=chrome`. En PowerShell, para usar Chrome, ejecuta `$env:UNIQO_BROWSER_CHANNEL = 'chrome'` antes de correr la suite.

## Reglas y almacenamiento

- Una materia con nota final aprueba al alcanzar el umbral configurado. El promedio predeterminado pondera las notas por créditos e incluye las reprobadas. Puedes cambiar ambas reglas en el formulario del pensum. Las materias sin nota y las retiradas quedan fuera del promedio. En un promedio ponderado, una materia de cero créditos tiene peso cero.
- El progreso divide los créditos aprobados entre los créditos requeridos. Si dejas vacío el total, usa los créditos de todas las materias registradas en el pensum. El porcentaje se limita a 100 y las materias aprobadas se cuentan una vez. El límite de créditos de un período se usa como referencia de carga.
- AsyncStorage guarda un documento versionado y la última copia válida. La app valida lecturas y escrituras, migra el formato local v0, recupera la copia cuando puede y conserva el contenido ilegible en una clave de recuperación. Un cambio rechazado conserva los datos visibles anteriores.
- El navegador identifica el almacenamiento por origen y perfil. Si cambias de puerto, perfil o dispositivo, abrirás otro espacio local. Edita los datos desde una pestaña a la vez. El almacenamiento local no está cifrado. Borrar los datos del sitio o desinstalar la app puede eliminar la copia.
- La demo admite un perfil, un pensum activo y una nota final por materia. El pensum se registra manualmente. Las sugerencias y recordatorios se calculan en el dispositivo. La sincronización con cuentas anteriores, el historial de intentos, la extracción de archivos y los avisos push quedan fuera de esta versión.

Consulta el [informe de estabilidad](DEMO_V1.md) para ver la línea base, los resultados por plataforma y los pendientes.
