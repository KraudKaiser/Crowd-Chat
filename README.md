#  Crowd Chat

Crowd Chat, tu *ChatBot* en tiempo real de "bolsillo". Una Aplicacion diseñada en *NextJS* para poder leer tus peticiones, analizarlas y brindarte una respuesta acorde. Incluyendo ajustes para *calibrar* las respuestas a tus necesidades.

*Almacená* tus chats en tu dispositivo de manera local, para recordar *todas* las conversaciones y tenerlas separadas para cada tema de tu interes.

Crowd Chat es capaz de *analizar* una seleccion de *roles* a los cuales quieras ajustarlo, prueba todas las posibilidades. Y si el texto no te es suficiente, pruebá *pedirle imagenes* con palabras claves.

A continuacion, sigue los pasos para instalar nuestra herramienta. 
---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/KraudKaiser/crowd-chat.git
cd crowd-chat
```

### 2. Instalar Dependencias
```bash
 npm install
```
### 3. Crea una variable de Entorno y Ingresa tu OpenAI API KEY
```bash
OPENAI_API_KEY=tu_api_key
## Obten la tuya a traves de https://platform.openai.com/
```
### 4. Ejecuta la aplicacion en un servidor de desarrollo.
```bash
npm run dev
## Esto abrira la aplicacion en http://localhost:3000
```

### ¿Como esta estructurado Crowd Chat?
```bash
src/
├── app/
│   ├──layout.tsx             # Layout que rodea las paginas. Incluyendo Header
│   ├── page.tsx              # Página principal (crear nuevo chat)
│   ├── [id]/page.tsx         # Página de un chat existente
│   └── api/                  # Crowd Chat utiliza NextJS API Routes para manejar sus peticiones Backend.
│       └── chats/            # Endpoints para manejar mensajes y streaming
│
├── assets/
│   ├──...                    # Guardamos cualquier tipo de imagen o icono que utilice la pagina.
│
│
├── components/               # Componentes de UI
│   ├── chat/                 # Historial de chat y UI relacionada
│   ├── ui/                   # Componentes de Shadcn (Dialog, Button, etc.)
│   └── Sidebar/              # Sidebar de navegación
│   └──...                    # Se guardan en general todos los componentes que requiera la pagina.
│
├── context/                  # Contextos globales (ej: SettingsContext)
├── hooks/                    # Hooks personalizados (ej: useGetChats)
├── lib/                      # Funciones auxiliares (streaming, detecciones)
└── types/                   # Tipado de Chats, Messages, Settings
```

# Funcionamiento de Crowd Chat ⚙️

Crowd Chat esta pensado como una SPA (Single Page Application) para un rapido funcionamiento y renderizado
Next JS fue seleccionado como tecnologia, gracias a sus herramientas de facil enrutado, manejo de componentes React
y su funcionalidad Next API Routes. 

## Inicio de la pagina.

Desde el primer momento en que entras, la pagina esta analizando tu **localStorage**. Corroborando si tienes chats guardados para renderizarlos en el Sidebar con el historial de chats. 

Si no, simplemente se mostrara la pagina de inicio, esperando la accion de el usuario. 

En la parte derecha del *Header*, el usuario podra observar un boton de configuracion.

Este boton mostrara una ventana con una serie de configuraciones, limitadas por el momento.

Estas configuraciones, estan ligadas a un Contexto llamado **SettingsContext**.
Esto es importante, ya que el contexto es lo que permite mas adelante, hacer saber de estas
configuraciones al **Backend** para limitar o potenciar las respuestas del bot.

## Escribir al Bot 🤖
Cuando estamos en la **Home Page**, al momento de escribir una peticion, esta es enviada al backend de manera diferente a como se hara en el resto de la conversacion. Pues debe crear el chat separado, donde se guardaran todos los mensajes. 

Por eso, es que existe una ruta *api/chats/routes.ts* y otra *api/chats/[id]/routes.ts*.

Cada una maneja comportamientos distintos. Pues sabemos que en un chat nuevo, el backend no tendra que procesar el historial de chats y nos ahorrara codigo. Ademas, ayuda a la legibilidad.

### Conversacion ya creada 

Al ya estar creada la conversacion, se nos redirige a una url con un ID. Ese ID es el id de la conversacion. Permitiendonos acceder a los mensajes de solo ese chat. 

Aca entra el componente **ChatHistorial** Que se encarga de analizar toda la parte de los mensajes leidos, detectando aquellos que sean del usuario, aquellos del bot y incluso los que se tratan de imagenes. 

# Funcionamiento en el Backend
La aplicacion funciona correctamente a traves de realizar solo peticiones de tipo *POST* 
al Backend. Se envian los resultados de las peticiones al bot en las respuestas de las peticiones y 
son procesadas por el Frontend para guardarlas en **LocalStorage**.

```bash

## Esta es la peticion [id] para los mensajes en una conversacion ya creada.
export async function POST(req: Request) {
  try {
    const { message, history, tokens, model, historyLimit }:
      { message: string; history: Message[]; tokens: number; model: string; historyLimit: number } = await req.json();

    const userRole = detectUserRole(message)

    if (detectWantsImage(message)) {
      const botMessage = await generateImageResponse(openai, message, model);
      return NextResponse.json([botMessage], {
        status: 200,
        headers: { "x-response-type": "json" },
      });
    }

    const messages = buildMessages(history, historyLimit, message, userRole);
    return await streamTextResponse(openai, model, tokens, messages);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: `Error: ${e}` }, { status: 500 });
  }
}

```

Lo primero que hace la aplicacion, es detectar en base a patrones sencillos, si el usuario esta pidiendo **generar una imagen** o si busca una **respuesta textual**

Hay que tener en cuenta, debido a las limitaciones de mi conocimiento, hay palabras en conjunto que activan este sistema de creacion de imagenes

```bash
export const imageTriggers = [
  "quiero que renderices una imagen",
  "quiero que crees una imagen",
  "genera una imagen",
  "dibuja una imagen",
  "haz un dibujo",
  "haz una ilustración",
];
```

A su vez, intenta recolectar de una lista de roles, si puede detectar algun **Rol Especifico** que el usuario quiera que tenga la inteligencia artificial. 

Y finalmente, se decide si utilizara la funcion para generar imagenes, o la que genera respuestas textuales.
Para el ultimo caso, envia tambien la cantidad de historial que quiere que recuerde el chat, Tokens maximos por peticion y el Rol que espera el usuario que antes habiamos explicado en **SettingsContext**

# Decisiones en el Desarrollo 🧠

## Principales Tecnologias

En este apartado, explicare mi toma de decisiones encarando esta prueba tecnica, siendo mi primera
aplicacion integrando la API de OpenAI.

Se utilizo el Framework de React **NextJS** por los motivos antes mencionados.

Desde su enrutamiento mucho mas sencillo, sus API Routes, entre otras herramientas que facilitan el desarrollo. 
**TypeScript** es utilizado para una mayor legibilidad a la hora de leer componentes y entender que se esta recibiendo
por propiedades (pese a que su integracion no es 100% completa por mi desconocimiento.)

**Shadcn** es la principal libreria utilizada a lo largo de todo el proyecto para el renderizado UI de el proyecto.
Mi conocimiento en el frontend no es completo, y esta herramienta permite enfocarse completamente en la parte funcional de la pagina al momento del desarrollo. En combinacion con **TailwindCSS**

## Estructura de la pagina y Diseño.

La pagina ha sido pensada para ser una SPA, por lo que las unicas paginas concretas son la Home Page y la ID page.

Con una idea en mente de que esta aplicacion sea una tanto de escritorio, como posible desarrollo a futuro en una aplicacion movil, mantener esta estructura de que todo ocurra en una sola pestaña, permite diseñar integraciones a futuro mas sencillas.

A su vez, estas paginas estan modularizadas de forma que futuras integraciones puedan formarse. Ideas como Aceptar videos, audios, podrian ser diseñadas creando funciones que luego se incluirian en el Backend. 

**El Backend** Unicamente se encarga de procesar los mensajes de ChatGPT y nada mas. Al no existir una base de datos, me tome la libertad de reservar sus funciones unicamente al crear mensajes, y dejar que el Frontend se encargue de guardar todos los chats y almacenarlos. 

Como el diseño de una base de datos requiere tiempo y configuracion, me centre en cumplir con el objetivo de que el guardado de imagenes sea a traves de **LocalStorage**. Donde el Hook **UseGetChats** Permite obtener tanto los chats almacenados, como el Set que permite crear nuevos chats o eliminarlos. 

Solo se utiliza un Context a lo largo de todo el proyecto **SettingsContext* que cuenta con 3 configuraciones basicas para manejar cantidad de tokens por peticion, modelo a usar y historial de mensajes. Con la posibilidad de a futuro, integrar mas configuraciones como Temperatura(que tan creativa o estricta es la IA)

# Posibles Integraciones a futuro para el Proyecto

Hay distintas integraciones o mejoras que se podrian hacer a futuro en el proyecto. 

Podemos destacar:

- Integracion de creacion de Videos y Audios a las respuestas del bot.
- Mayor gama de configuracion para la Inteligencia Artificial
- Opciones de Regeneracion de mensajes
- Mejores algoritmos de deteccion de imagenes y roles. 