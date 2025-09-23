# VitaLink 
<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/d16726f4-c637-4f14-8de4-907ca12b0b2f" />

# What is the problem?

Many hospitals lack a centralized control system for medication purchasing and distribution, which leads to:

Frequent stockouts in hospitals.

Cost overruns due to a lack of bulk purchases.

Difficulty negotiating competitive prices with suppliers.

Lack of coordination between national and international hospitals, which limits access to specialized medications and delays delivery times.

# What is the solution?

Develop a centralized web application that allows:

Management of medication inventories across multiple hospitals.

Detect in real time which medications are running out and make timely purchases.

Coordinate joint national and international purchases, reducing costs and improving availability.

Integrate Interledger's Open Payments API to make secure purchases with a test wallet.

Ensure traceability in medication purchasing and distribution.

# What technologies were used?
Framework: Next.js with React and TypeScript.

Node.js version: 22.19.0.

Local server:

Clone the repository: git clone

Install dependencies
```
# or

yarn install

# or

pnpm install

# or

bun install
```

Run in development mode

```

yarn dev

or

pnpm dev

or

bun dev
```
Open in browser

http://localhost:3000

**Payments**

API: Interledger Open Payments.

Test Wallet for simulated purchases.

One of the key features of this system is the integration with Interledger's Open Payments API, which enables secure and traceable payments between hospitals and providers.

The Interledger Test Wallet is used https://wallet.interledger-test.dev/

Hospitals can make joint national and international purchases directly from the application.

Payments are made with support for asset_code and wallet_url, ensuring compatibility with international suppliers.

The traceability of each purchase is recorded in the system's transaction history.


# What are the benefits?

Cost reduction through joint purchases.

Guaranteed availability of specialty medications.

Inventory control to prevent loss and expiration.

Improved distribution and delivery logistics.

Transparency and traceability in hospital purchases.

International scalability, enabling cooperation between hospitals in different countries.

# What is its architecture/simple stack?

General architecture:
<img width="685" height="357" alt="image" src="https://github.com/user-attachments/assets/da1a8fe9-07c5-4e1a-8669-8bf846c93978" />


# What functions are essential?

Inventory control, which shows you the quantity of medications that are either deficient or sufficient within the hospital.

Purchase of medications with a test wallet using Open Payments.

Purchase history.

# Who will be responsible for building which part?

Frontend (Next.js/React): User interface, inventory management, forms, and views. (Víctor Ramsés Camacho Martínez)

Payments (Interledger Open Payments): Connection to wallets and transaction processing. (Víctor Ramsés Camacho Martínez)

Documentation (Lizbeth Angelica Martínez Ceja)
___________________________________________________________________________________
# ¿Cuál es el problema?

Muchos hospitales carecen de un sistema de control centralizado para la compra y distribución de medicamentos, lo que genera:  

Desabastecimiento frecuente en hospitales.  

Sobrecostos debido a la falta de compras en volumen.  

Dificultad para negociar precios competitivos con proveedores.  

Falta de coordinación entre hospitales nacionales e internacionales, lo que limita el acceso a medicamentos especializados y retrasa los tiempos de entrega.  

# ¿Cuál es la solución?

Desarrollar una aplicación web centralizada que permita:  

Gestionar inventarios de medicamentos en múltiples hospitales.  

Detectar en tiempo real qué medicamentos están por agotarse y realizar compras oportunas.  

Coordinar compras conjuntas nacionales e internacionales, reduciendo costos y mejorando la disponibilidad.  

Integrar la API de Open Payments de Interledger para realizar compras seguras con test wallet.  

Garantizar trazabilidad en la compra y distribución de medicamentos.  

# ¿Qué tecnologías se usarón?

Framework: Next.js con React y TypeScript.  

Versión de Node.js: 22.19.0.  

Servidor local:  

Clonar el repositorio: git clone  

Instalar dependencias  
```
# o   
  
yarn install   
  
# o   
  
pnpm install   
  
# o   
  
bun install 
```  

Ejecutar en modo desarrollo  

 
```  
yarn dev   
 
o   
 
pnpm dev   
 
o   
 
bun dev  
 ```
Abrir en navegador   
 
http://localhost:3000 


**Pagos** 

API: Open Payments de Interledger.  

Test Wallet para compras simuladas.  

Una de las características clave de este sistema es la integración con la API de Open Payments de Interledger, que permite realizar pagos de manera segura y trazable entre hospitales y proveedores.  

Se utiliza el Interledger Test Wallet https://wallet.interledger-test.dev/  

Los hospitales pueden realizar compras conjuntas nacionales e internacionales directamente desde la aplicación.  

Los pagos se realizan con soporte para asset_code y wallet_url, garantizando compatibilidad con proveedores internacionales.  

La trazabilidad de cada compra queda registrada en el historial de transacciones del sistema.  


# ¿Cuáles son los beneficios?

Reducción de costos mediante compras conjuntas.  

Disponibilidad garantizada de medicamentos especializados.  

Control de inventarios para evitar pérdidas y caducidad.  

Mejora en la logística de distribución y entrega.  

Transparencia y trazabilidad en las compras hospitalarias.  

Escalabilidad internacional, permitiendo la cooperación entre hospitales de distintos países.  

# ¿Cuál es su arquitectura/stack simple?

Arquitectura general:  

<img width="685" height="357" alt="image" src="https://github.com/user-attachments/assets/4817e9c8-4b44-47c9-8278-2e4dfc5f2492" />

# ¿Qué funciones son indispensables?

Control de inventario, el cual te muestra la cantidad de medicamentos que ya sea deficiente o suficiente dentro del hospital. 

Compra de medicamentos con test wallet usando Open Payments.  

Historial de compras. 

# ¿Quién será responsable de construir qué parte?

Frontend (Next.js/React): Interfaz de usuario, gestión de inventarios, formularios y vistas. (Víctor Ramsés Camacho Martinez) 

Pagos (Interledger Open Payments): Conexión con wallets y procesamiento de transacciones. (Víctor Ramsés Camacho Martinez) 

Documentación (Lizbeth Angelica Martínez Ceja) 
 