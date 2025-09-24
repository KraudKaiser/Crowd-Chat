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