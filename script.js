// --- 1. IMPORTACIONES CORRECTAS (CDN) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- 2. TU CONFIGURACIÓN (PROYECTO: simulador-a917b) ---
const firebaseConfig = {
  apiKey: "AIzaSyDzvYIWuLW4e09HeEl8Fvs49yjAPXV3pH8",
  authDomain: "simulador-a917b.firebaseapp.com",
  projectId: "simulador-a917b",
  storageBucket: "simulador-a917b.firebasestorage.app",
  messagingSenderId: "873917521728",
  appId: "1:873917521728:web:15905f6a81dcdd953264a5",
  measurementId: "G-0EZD184L51"
};

// --- 3. INICIALIZAR FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);        // <--- Esto faltaba y es vital para el login
const db = getFirestore(app);     // <--- Esto faltaba para la base de datos

// ... A PARTIR DE AQUÍ SIGUE TU CÓDIGO DE CORREOS Y PREGUNTAS ...
// --- 2. LISTA DE CORREOS AUTORIZADOS Y DIFERENCIADOS ---

// Correo que tendrán límite de 2 dispositivos
const correosDosDispositivos = [
    "dpachecog2@unemi.edu.ec", "htigrer@unemi.edu.ec", "sgavilanezp2@unemi.edu.ec", 
    "jzamoram9@unemi.edu.ec", "fcarrillop@unemi.edu.ec", "naguilarb@unemi.edu.ec", 
    "kholguinb2@unemi.edu.ec"
];

// Correos que tendrán límite de 1 dispositivo
const correosUnDispositivo = [
    "cnavarretem4@unemi.edu.ec", "gorellanas2@unemi.edu.ec", "ehidalgoc4@unemi.edu.ec", 
    "lbrionesg3@unemi.edu.ec", "xsalvadorv@unemi.edu.ec", "nbravop4@unemi.edu.ec", 
    "jmoreirap6@unemi.edu.ec", "jcastrof8@unemi.edu.ec", "jcaleroc3@unemi.edu.ec"
];

// Unimos las listas para la validación de acceso inicial
const correosPermitidos = [
    ...correosDosDispositivos, 
    ...correosUnDispositivo
];

// --- 3. BANCO DE PREGUNTAS NUEVO (ADMINISTRACIÓN) ---
const bancoPreguntas = [
    { 
        texto: "¿Cuál fue uno de los enfoques principales de la administración científica propuesta por Taylor?", 
        opciones: [
            "Enfoque en la motivación intrínseca de los trabajadores.", 
            "Desarrollo de procedimientos científicos para determinar la mejor manera de realizar el trabajo.", 
            "Énfasis en la delegación de autoridad en los niveles inferiores.", 
            "Promoción de la autonomía completa de los trabajadores."
        ], 
        respuesta: 1, 
        explicacion: "Frederick Taylor buscaba la eficiencia máxima definiendo la 'one best way' (la mejor manera) científica de hacer cada tarea." 
    },
    { 
        texto: "¿Cómo se caracterizan las Organizaciones Informales?", 
        opciones: [
            "No tienen estructuras ni reglas formalizadas.", 
            "Siguen reglas y procedimientos claramente definidos y documentados.", 
            "Están dirigidas a metas específicas.", 
            "Buscan generar utilidades o ganancias."
        ], 
        respuesta: 0, 
        explicacion: "Las organizaciones informales surgen espontáneamente por relaciones sociales y no tienen una estructura oficial definida." 
    },
    { 
        texto: "Elige la opción que mejor describa la departamentalización.", 
        opciones: [
            "El proceso de agrupar actividades laborales similares en áreas de trabajo delimitadas.", 
            "La línea de autoridad dentro de una organización.", 
            "La división de tareas específicas para diferentes puestos de trabajo.", 
            "La asignación de recursos financieros a diferentes proyectos."
        ], 
        respuesta: 0, 
        explicacion: "La departamentalización consiste en agrupar puestos base en unidades coordinadas (departamentos)." 
    },
    { 
        texto: "¿Cuál de los siguientes resultados deseables para la organización se menciona como una razón para que los gerentes administren sus relaciones con los grupos de interés?", 
        opciones: [
            "Aumento de la competitividad en el mercado", 
            "Reducción de costos operativos", 
            "Incremento de la productividad del personal", 
            "Mayor capacidad para predecir cambios del entorno"
        ], 
        respuesta: 3, 
        explicacion: "Gestionar los grupos de interés (stakeholders) permite anticipar tendencias y cambios externos con mayor facilidad." 
    },
    { 
        texto: "¿Qué es el control preventivo?", 
        opciones: [
            "Control que entra en acción después de que una actividad laboral ha sido ejecutada.", 
            "Control implementado antes de la realización de una actividad laboral.", 
            "Control que entra en acción mientras una actividad laboral está en progreso.", 
            "Control utilizado para evaluar la rentabilidad financiera."
        ], 
        respuesta: 1, 
        explicacion: "Como su nombre indica, previene problemas anticipándose a ellos antes de que comience la actividad." 
    },
    { 
        texto: "¿Cuál es un enfoque recomendado para los gerentes en organizaciones orientadas a las personas?", 
        opciones: [
            "Tratar a los empleados como un costo a minimizar", 
            "Tratar a los empleados como socios", 
            "Mantener una comunicación limitada con los empleados", 
            "Centralizar las decisiones importantes en la alta dirección"
        ], 
        respuesta: 1, 
        explicacion: "En la gestión moderna orientada a personas, se valora el empoderamiento y se ve al empleado como un socio estratégico." 
    },
    { 
        texto: "¿Qué comprende la fase de identificación y selección en el proceso de administración de recursos humanos?", 
        opciones: [
            "Planificación de recursos humanos, reclutamiento y selección", 
            "Evaluación del desempeño y capacitación", 
            "Beneficios y compensación", 
            "Relaciones laborales y despidos"
        ], 
        respuesta: 0, 
        explicacion: "Aunque el proceso es integral, la fase inicial clave es planificar las necesidades y reclutar/seleccionar al talento adecuado." 
    },
    { 
        texto: "¿Qué implica el segundo paso del proceso de control?", 
        opciones: [
            "Motivar a los empleados.", 
            "Comparar el desempeño real contra un estándar.", 
            "Rediseñar los procesos.", 
            "Establecer nuevos objetivos."
        ], 
        respuesta: 1, 
        explicacion: "El proceso es: 1. Medir, 2. Comparar (real vs estándar), 3. Tomar medidas administrativas." 
    },
    { 
        texto: "¿Cuál de los siguientes estilos de liderazgo es el que proporciona poca dirección y apoyo?", 
        opciones: [
            "Hablar", 
            "Vender", 
            "Delegar", 
            "Participar"
        ], 
        respuesta: 2, 
        explicacion: "El estilo 'Delegar' (según Hersey y Blanchard) implica baja conducta de tarea (dirección) y baja conducta de relación (apoyo)." 
    },
    { 
        texto: "¿Cuál de las siguientes combinaciones de conceptos y definiciones es correcta?\n1. Percepción - B\n2. Consistencia - D\n3. Condicionamiento operante - C\n4. Aprendizaje social - A", 
        opciones: [
            "1-A, 2-B, 3-D, 4-C", 
            "1-B, 2-D, 3-C, 4-A", 
            "1-C, 2-A, 3-B, 4-D", 
            "1-D, 2-C, 3-A, 4-B"
        ], 
        respuesta: 1, 
        explicacion: "Percepción es organizar impresiones (B); Consistencia es comportamiento regular (D); Cond. Operante es función de consecuencias (C); Aprendizaje social es por observación (A)." 
    },
    { 
        texto: "¿Qué implica la transformación del trabajo gerencial en relación con la sustentabilidad?", 
        opciones: [
            "Ignorar completamente los aspectos medioambientales.", 
            "Centrarse exclusivamente en oportunidades económicas.", 
            "Excluir consideraciones sociales en las estrategias de negocio.", 
            "Integrar oportunidades económicas, medioambientales y sociales en las estrategias de negocio."
        ], 
        respuesta: 3, 
        explicacion: "La sustentabilidad corporativa busca el equilibrio entre el beneficio económico, el cuidado ambiental y la responsabilidad social." 
    },
    { 
        texto: "¿Cuál fue uno de los objetivos principales de la administración científica propuesta por Taylor?", 
        opciones: [
            "Promover la colaboración entre los trabajadores.", 
            "Determinar la 'mejor manera' de realizar un trabajo.", 
            "Establecer un sistema de incentivos basado en el rendimiento.", 
            "Desarrollar programas de capacitación para los gerentes."
        ], 
        respuesta: 1, 
        explicacion: "El núcleo del Taylorismo es encontrar el método más eficiente ('the one best way') para cada tarea." 
    },
    { 
        texto: "¿Quién propuso la Teoría General de la Administración?", 
        opciones: [
            "Adam Smith.", 
            "Henri Fayol.", 
            "Fredrick Winslow Taylor.", 
            "Karl Marx."
        ], 
        respuesta: 1, 
        explicacion: "Henri Fayol es conocido como el padre de la teoría moderna de la administración operacional (los 14 principios)." 
    },
    { 
        texto: "¿Qué descripción se ajusta mejor a los planes direccionales?", 
        opciones: [
            "Establecen lineamientos generales y son flexibles.", 
            "Tienen un marco temporal de más de tres años.", 
            "Son específicos y detallados.", 
            "Se extienden por un año o menos."
        ], 
        respuesta: 0, 
        explicacion: "Los planes direccionales marcan el rumbo general pero dan libertad (flexibilidad) en cómo llegar allí, a diferencia de los planes específicos." 
    },
    { 
        texto: "¿Cuál es uno de los desafíos que enfrentan las empresas al intentar mantener una cultura organizacional fuerte?", 
        opciones: [
            "Falta de diversidad en el personal.", 
            "Escasez de recursos financieros.", 
            "Baja demanda de los productos o servicios de la empresa.", 
            "Mantener la coherencia cultural a medida que la empresa crece o se enfrenta a cambios internos o externos."
        ], 
        respuesta: 3, 
        explicacion: "El crecimiento y los cambios rápidos dificultan mantener los valores y normas compartidos que hacen fuerte a una cultura." 
    },
    { 
        texto: "¿Qué característica deben tener los objetivos bien redactados en una organización?", 
        opciones: [
            "Ser ambiguos", 
            "No ser medibles ni cuantificables", 
            "Ser desafiantes pero logrables", 
            "No ser comunicados a los miembros de la organización"
        ], 
        respuesta: 2, 
        explicacion: "Los objetivos deben ser SMART; específicamente, deben motivar (desafiantes) pero ser realistas (logrables)." 
    },
    { 
        texto: "¿Por qué es importante la administración de recursos humanos (ARH) en las organizaciones?", 
        opciones: [
            "Porque aumenta la burocracia y el control", 
            "Porque permite una mayor centralización en la toma de decisiones", 
            "Porque puede ser una fuente significativa de ventaja competitiva", 
            "Porque reduce la necesidad de capacitación de los empleados"
        ], 
        respuesta: 2, 
        explicacion: "El capital humano es uno de los activos más difíciles de imitar, por lo que una buena gestión crea ventaja competitiva." 
    },
    { 
        texto: "¿Qué son las acciones disciplinarias en el control del desempeño de los empleados?", 
        opciones: [
            "Acciones para recompensar a los empleados.", 
            "Acciones para hacer cumplir los estándares y reglamentos laborales.", 
            "Acciones para promover a los empleados.", 
            "Acciones para contratar nuevo personal."
        ], 
        respuesta: 1, 
        explicacion: "Son las medidas correctivas que se toman cuando un empleado no cumple con las normas o estándares establecidos." 
    },
    { 
        texto: "¿Qué es el 'rango de variación' en el proceso de control?", 
        opciones: [
            "La cantidad de empleados supervisados.", 
            "Parámetros de variación aceptables entre el desempeño real y el estándar.", 
            "La frecuencia de las evaluaciones.", 
            "La cantidad de recursos utilizados."
        ], 
        respuesta: 1, 
        explicacion: "Es el margen de tolerancia. Si el desempeño se desvía dentro de este rango, se considera aceptable; si sale, requiere acción." 
    },
    { 
        texto: "¿Qué es la liquidez en el análisis de proporciones financieras?", 
        opciones: [
            "Medida de la capacidad de una empresa para pagar sus deudas a corto plazo.", 
            "Medida de la rentabilidad.", 
            "Medida de la eficiencia operativa.", 
            "Medida de la satisfacción del cliente."
        ], 
        respuesta: 0, 
        explicacion: "La liquidez mide la facilidad con la que la empresa puede convertir activos en efectivo para cubrir obligaciones inmediatas." 
    },
    { 
        texto: "¿Qué son las competencias en el contexto de recursos humanos?", 
        opciones: [
            "Proceso de selección de personal", 
            "Conjunto de conocimientos, habilidades y actitudes necesarias para desempeñar un trabajo", 
            "Recompensa a los empleados por habilidades demostradas", 
            "Evaluación del desempeño de los empleados"
        ], 
        respuesta: 1, 
        explicacion: "Las competencias (KSA: Knowledge, Skills, Attitudes) son lo que habilita a una persona para hacer un trabajo exitosamente." 
    },
    { 
        texto: "¿Qué implica la gestión de relaciones laborales en una empresa?", 
        opciones: [
            "Reclutamiento de nuevos empleados", 
            "Evaluación del desempeño de los empleados", 
            "Proceso de gestión de la relación entre empleadores y empleados", 
            "Capacitación y desarrollo de empleados"
        ], 
        respuesta: 2, 
        explicacion: "Se refiere a mantener una relación positiva, incluyendo negociaciones con sindicatos, resolución de conflictos y clima laboral." 
    },
    { 
        texto: "¿Cuál es el propósito del control en las organizaciones?", 
        opciones: [
            "Garantizar la autonomía de los empleados.", 
            "Asegurar que las actividades contribuyan al cumplimiento de los objetivos.", 
            "Eliminar la supervisión gerencial.", 
            "Aumentar la burocracia organizacional."
        ], 
        respuesta: 1, 
        explicacion: "El control es la función que monitorea el desempeño para asegurar que las metas planificadas se están cumpliendo." 
    },
    { 
        texto: "¿Qué es el comportamiento organizacional?", 
        opciones: [
            "Estudio de la estructura de la organización.", 
            "Gestión de los procesos de producción.", 
            "Evaluación de los recursos financieros.", 
            "Análisis de las acciones que realizan las personas en el ámbito laboral."
        ], 
        respuesta: 3, 
        explicacion: "El CO se centra en cómo se comportan las personas (individualmente y en grupo) dentro de las organizaciones." 
    },
    { 
        texto: "Según Mintzberg, ¿Cuál es uno de los roles gerenciales que implica interactuar con personas dentro y fuera de la organización, así como cumplir deberes ceremoniales y simbólicos?", 
        opciones: ["Interpersonales", "Administrativo", "Decisorios", "Informativos"], 
        respuesta: 0, 
        explicacion: "Los roles interpersonales (figura de autoridad, líder, enlace) tienen que ver con las relaciones y lo simbólico." 
    },
    { 
        texto: "La administración consiste en interpretar los objetivos de la empresa y alcanzar los propósitos establecidos ¿Mediante qué secuencia de procesos se consigue?", 
        opciones: ["Planeación, Organización, Eficiencia y Eficacia", "Planeación, Organización, Dirección y Control", "Coordinación y Supervisión", "Eficiencia y Eficacia"], 
        respuesta: 1, 
        explicacion: "Esas son las 4 funciones administrativas clásicas (El proceso administrativo)." 
    },
    { 
        texto: "¿Cuál de los siguientes NO es mencionado como un desafío para los gerentes?", 
        opciones: ["Puede ser un trabajo ingrato.", "Puede involucrar algunas responsabilidades rutinarias.", "Los gerentes dedican bastante tiempo a asistir a juntas y suelen ser interrumpidos.", "Tener acceso ilimitado a recursos financieros."], 
        respuesta: 3, 
        explicacion: "Ningún gerente tiene recursos ilimitados; la administración se trata justamente de gestionar recursos escasos." 
    },
    { 
        texto: "¿Cuál de las siguientes profesiones/trabajos se menciona como parte de la transformación del trabajo gerencial hacia un enfoque en clientes?", 
        opciones: ["Ingenieros de software.", "Diseñadores gráficos.", "Economistas.", "Recepcionistas y cajeros bancarios."], 
        respuesta: 3, 
        explicacion: "El personal de contacto directo (front-line) es crucial en el enfoque moderno de servicio al cliente." 
    },
    { 
        texto: "¿Qué significa ROWE, Experimento laboral radical en la sede central de Best Buy que involucra un programa de trabajo flexible?", 
        opciones: ["Reorganización de las operaciones empresariales.", "Resolución de obstáculos en el entorno laboral.", "Reducción de los horarios de trabajo.", "Entorno Laboral basado exclusivamente en Resultados."], 
        respuesta: 3, 
        explicacion: "ROWE siglas en inglés de Results-Only Work Environment (Entorno de trabajo solo por resultados)." 
    },
    { 
        texto: "¿Qué papel desempeñan las redes sociales en la transformación del trabajo gerencial?", 
        opciones: ["Aumento del uso de correo postal.", "Disminución de la comunicación entre equipos.", "Prohibición de uso en el lugar de trabajo.", "Los gerentes ahora deben establecer directrices para el uso de Internet y el correo electrónico."], 
        respuesta: 3, 
        explicacion: "El desafío actual es gestionar y regular el uso de estas herramientas en el entorno laboral." 
    },
    { 
        texto: "¿Cuál de las siguientes afirmaciones es verdadera con respecto a las habilidades técnicas de los gerentes de primera línea?", 
        opciones: ["Son más importantes para los gerentes de alto nivel.", "No necesitan habilidades técnicas.", "Son menos importantes que para los altos directivos.", "Son empleados promovidos a menudo debido a sus habilidades técnicas, ya que supervisan tareas específicas."], 
        respuesta: 3, 
        explicacion: "Los gerentes de primera línea (supervisores) necesitan saber CÓMO se hace el trabajo operativo." 
    },
    { 
        texto: "¿Qué implica la transformación del trabajo gerencial en relación con la sustentabilidad?", 
        opciones: ["Ignorar completamente los aspectos medioambientales.", "Centrarse exclusivamente en oportunidades económicas.", "Excluir consideraciones sociales.", "Integrar oportunidades económicas, medioambientales y sociales en las estrategias de negocio."], 
        respuesta: 3, 
        explicacion: "Es el concepto de responsabilidad social corporativa y la triple cuenta de resultados." 
    },
    { 
        texto: "¿Quién propuso la Teoría General de la Administración?", 
        opciones: ["Adam Smith.", "Henri Fayol.", "Fredrick Winslow Taylor.", "Karl Marx."], 
        respuesta: 1, 
        explicacion: "Fayol es el padre de la teoría moderna de la administración (los 14 principios y las funciones administrativas)." 
    },
    { 
        texto: "¿Cuál fue uno de los objetivos principales de la administración científica propuesta por Taylor?", 
        opciones: ["Promover la colaboración social.", "Determinar la 'mejor manera' (one best way) de realizar un trabajo.", "Establecer incentivos grupales.", "Capacitar gerentes en habilidades blandas."], 
        respuesta: 1, 
        explicacion: "Taylor buscaba la eficiencia máxima a través del método científico aplicado a las tareas." 
    },
    { 
        texto: "¿Cuál de los siguientes ejemplos se considera una manifestación incipiente (temprana) de la administración?", 
        opciones: ["La publicación de 'La riqueza de las naciones'.", "La construcción de las pirámides de Egipto.", "La creación de la computadora.", "El inicio de la Revolución Industrial."], 
        respuesta: 1, 
        explicacion: "Las pirámides requirieron planificación, organización y control de miles de trabajadores miles de años antes de la teoría moderna." 
    },
    { 
        texto: "¿Cuál fue uno de los enfoques propuestos en el modelo clásico de administración?", 
        opciones: ["Enfoque en la diversidad cultural.", "Utilización del método científico para determinar la mejor manera de realizar un trabajo.", "Priorización de la intuición.", "Énfasis en la gestión del cambio."], 
        respuesta: 1, 
        explicacion: "Referencia directa a la Administración Científica de Taylor." 
    },
    { 
        texto: "¿Qué principios destacó Fredrick Winslow Taylor en su obra 'Principios de la administración científica'?", 
        opciones: ["Competencia entre gerencia y obreros.", "Evitar la fragmentación.", "Desarrollar procedimientos científicos para cada elemento del trabajo y seleccionar científicamente a los trabajadores.", "Priorizar la eficiencia individual sobre la colaboración."], 
        respuesta: 2, 
        explicacion: "Ciencia, no regla empírica; selección científica y capacitación del trabajador." 
    },
    { 
        texto: "De acuerdo con el texto de Robbins, ¿El profesor a cargo de su clase de administración se consideraría un gerente?", 
        opciones: ["Sí, ya que planifica, organiza, dirige y controla el curso.", "No, porque no maneja recursos financieros.", "Sí, solo porque es un líder.", "No, porque su rol es solo enseñar."], 
        respuesta: 0, 
        explicacion: "Cumple con las 4 funciones administrativas: Planifica el sílabo, organiza las clases, dirige a los alumnos y controla con notas." 
    },
    { 
        texto: "¿Cuál fue uno de los resultados de la implementación de ROWE en Best Buy?", 
        opciones: ["Aumento de la rotación.", "Incremento de horarios.", "Reducción de productividad.", "Aumento del 41% en la productividad laboral."], 
        respuesta: 3, 
        explicacion: "Al enfocarse en resultados y no en horas silla, la productividad aumentó drásticamente." 
    },
    { 
        texto: "¿Qué se espera que hagan los gerentes en términos de innovación?", 
        opciones: ["Seguir haciendo las cosas igual.", "Evitar riesgos.", "Limitar la creatividad.", "Hacer las cosas de manera diferente y asumir riesgos."], 
        respuesta: 3, 
        explicacion: "La innovación requiere cambio y asunción de riesgos calculados para mantener la competitividad." 
    },
    { 
        texto: "¿Cuál es la diferencia principal entre los gerentes y los empleados no gerenciales?", 
        opciones: ["Los gerentes tienen enfoque táctico.", "Los gerentes tienen autoridad limitada.", "Los gerentes tienen roles de liderazgo y toman decisiones, mientras empleados se ocupan de tareas específicas.", "Los gerentes solo supervisan."], 
        respuesta: 2, 
        explicacion: "La distinción clave es que el gerente dirige las actividades de otros (y toma decisiones), mientras el empleado no gerencial ejecuta tareas." 
    },
    { 
        texto: "¿Qué cambio significativo ocurrió durante la Revolución Industrial que influyó en la administración?", 
        opciones: ["Promulgación de leyes laborales.", "Sustitución de fuerza humana por máquinas y necesidad de Gerentes.", "Desarrollo de la contabilidad.", "Surgimiento de sindicatos."], 
        respuesta: 1, 
        explicacion: "El surgimiento de fábricas grandes requirió por primera vez a alguien que 'administrara' el trabajo de muchos." 
    },
    { 
        texto: "¿Cuál fue una de las contribuciones de Adam Smith en el ámbito de la administración?", 
        opciones: ["Teoría de la burocracia.", "Publicación de 'La riqueza de las naciones' y la división del trabajo (especialización).", "Teoría X y Y.", "Administración participativa."], 
        respuesta: 1, 
        explicacion: "Smith demostró cómo la división del trabajo aumentaba drásticamente la productividad (ejemplo de la fábrica de alfileres)." 
    },
    { 
        texto: "¿Quién describió la Teoría general de la administración como una práctica diferente a la contabilidad o finanzas?", 
        opciones: ["Lilian Gilbreth", "Frederick Taylor", "Henry Ford", "Henri Fayol"], 
        respuesta: 3, 
        explicacion: "Fayol identificó la administración como una función distinta de las otras funciones comerciales (técnicas, comerciales, financieras, etc.)." 
    },
    { 
        texto: "¿Por qué la innovación es vital para los gerentes de hoy?", 
        opciones: ["Porque reduce rotación.", "Porque aumenta producción inmediata.", "Porque es exclusiva de tecnología.", "Porque impacta en todos los niveles y asegura competitividad."], 
        respuesta: 3, 
        explicacion: "Sin innovación, las organizaciones corren el riesgo de volverse obsoletas frente a la competencia." 
    },
    { 
        texto: "¿Qué afirma el texto acerca de NO innovar hoy en día?", 
        opciones: ["Que es más riesgoso que innovar.", "Que es recomendable en crisis.", "Que es más seguro.", "Que solo afecta a pequeñas empresas."], 
        respuesta: 0, 
        explicacion: "En un entorno cambiante, quedarse estático (no innovar) es el mayor riesgo para la supervivencia de la empresa." 
    },
    { 
        texto: "¿Qué se evalúa en un producto clasificado como 'Perro' en la Matriz BCG?", 
        opciones: [
            "Baja participación de mercado", 
            "Alta tasa de crecimiento anticipado", 
            "Baja y alta tasa de crecimiento anticipado", 
            "Alta participación de mercado"
        ], 
        respuesta: 0, 
        explicacion: "En la matriz BCG, los 'Perros' tienen baja participación de mercado y bajo crecimiento." 
    },
    { 
        texto: "¿Qué características deben tener los objetivos bien redactados en una organización?", 
        opciones: [
            "Ser ambiguos", 
            "No ser medibles ni cuantificables", 
            "Ser desafiantes pero logrables", 
            "No ser comunicados a los miembros de la organización"
        ], 
        respuesta: 2, 
        explicacion: "Los objetivos deben motivar (desafiantes) pero deben ser realistas (logrables) para que el personal se comprometa." 
    },
    { 
        texto: "¿Cuál de las siguientes afirmaciones describe mejor la relevancia de los conceptos gerenciales de Henri Fayol?", 
        opciones: [
            "Son obsoletos y ya no se aplican en la gestión moderna.", 
            "Ofrecen perspectivas valiosas para los gerentes incluso después de más de 90 años.", 
            "Son irrelevantes y no aportan nada a la gestión empresarial.", 
            "Nunca han sido aplicados por los gerentes en la práctica."
        ], 
        respuesta: 1, 
        explicacion: "Los 14 principios de Fayol (como unidad de mando, disciplina, orden) siguen siendo la base de la administración moderna." 
    },
    { 
        texto: "¿Cuál es uno de los desafíos que enfrentan las empresas al intentar mantener una cultura organizacional fuerte?", 
        opciones: [
            "Falta de diversidad en el personal.", 
            "Escasez de recursos financieros.", 
            "Baja demanda de los productos o servicios de la empresa.", 
            "Mantener la coherencia cultural a medida que la empresa crece o se enfrenta a cambios internos o externos."
        ], 
        respuesta: 3, 
        explicacion: "El crecimiento rápido suele diluir los valores compartidos, haciendo difícil mantener una cultura fuerte y unificada." 
    },
    { 
        texto: "¿Cuál es uno de los elementos del dominio de una organización?", 
        opciones: [
            "La estructura jerárquica de la organización.", 
            "El nicho y los factores externos con los que interactuará para alcanzar sus metas.", 
            "El presupuesto asignado a cada departamento.", 
            "La ubicación geográfica de la sede central."
        ], 
        respuesta: 1, 
        explicacion: "El dominio define el campo de acción de la organización: dónde opera y con quién interactúa en el entorno." 
    },
    { 
        texto: "¿Qué limita las decisiones y acciones de los gerentes?", 
        opciones: [
            "El entorno externo dado por el Entorno Organizacional y el entorno interno dado por la cultura organizacional.", 
            "Las políticas y procedimientos de la organización.", 
            "La capacitación y habilidades de los empleados.", 
            "La estructura jerárquica de la organización."
        ], 
        respuesta: 0, 
        explicacion: "Se conoce como 'discrecionalidad gerencial': el gerente no es omnipotente, está limitado por la cultura (adentro) y el entorno (afuera)." 
    },
    { 
        texto: "Selecciona la opción que mejor describe la visión actual sobre la cadena de mando en las organizaciones contemporáneas.", 
        opciones: [
            "Se considera como un método obsoleto de control.", 
            "Se considera que ha perdido relevancia.", 
            "Se considera más importante que nunca para mantener el control.", 
            "Se considera como el único método efectivo de control."
        ], 
        respuesta: 1, 
        explicacion: "Con el empoderamiento de empleados y equipos autodirigidos, la línea rígida de autoridad (cadena de mando) es menos relevante que antes." 
    },
    { 
        texto: "¿Cuál de los siguientes NO es uno de los propósitos de la planeación?", 
        opciones: [
            "Reducción de la incertidumbre.", 
            "Minimización del desperdicio y la redundancia.", 
            "Generación de conflictos internos.", 
            "Establecimiento de objetivos o estándares para la función de control."
        ], 
        respuesta: 2, 
        explicacion: "La planeación busca coordinar y reducir conflictos, no generarlos." 
    },
    { 
        texto: "¿Qué implica el paso de evaluación de resultados en la administración estratégica?", 
        opciones: [
            "Identificar la misión de la organización", 
            "Determinar la efectividad de las estrategias", 
            "Desarrollar nuevos objetivos", 
            "Implementar cambios organizacionales"
        ], 
        respuesta: 1, 
        explicacion: "Es la fase final donde se mide si lo que se planeó e implementó realmente funcionó." 
    },
    { 
        texto: "¿Qué se debe hacer con un producto clasificado como 'Producto Perro' en la Matriz BCG?", 
        opciones: [
            "Desarrollar un plan estratégico", 
            "Comparar recursos y beneficios", 
            "No alterar el producto", 
            "Observar el mercado"
        ], 
        respuesta: 1, 
        explicacion: "Generalmente se liquidan, pero el paso lógico administrativo es comparar si vale la pena mantenerlos por alguna razón estratégica." 
    },
    { 
        texto: "Selecciona la opción que NO es un método común de departamentalización.", 
        opciones: [
            "Departamentalización temporal.", 
            "Departamentalización por función.", 
            "Departamentalización por producto.", 
            "Departamentalización por ubicación geográfica."
        ], 
        respuesta: 0, 
        explicacion: "La departamentalización 'temporal' no es una categoría estándar (existen por funciones, productos, geografía, procesos y clientes)." 
    },
    { 
        texto: "¿Cuál de las siguientes afirmaciones describe mejor una diferencia entre una cultura fuerte y una cultura débil?", 
        opciones: [
            "Una cultura fuerte tiene una conexión débil entre comportamientos y valores compartidos.", 
            "Una cultura débil se caracteriza por valores compartidos por la vasta mayoría del personal.", 
            "Una cultura fuerte transmite mensajes contradictorios.", 
            "Una cultura fuerte tiene valores compartidos por la vasta mayoría, mientras que una débil solo por algunos (alta dirección)."
        ], 
        respuesta: 3, 
        explicacion: "La fortaleza de la cultura depende de qué tanto y con qué intensidad se comparten los valores." 
    },
    { 
        texto: "¿Cuál es una característica de los objetivos bien redactados? (Segunda variante)", 
        opciones: [
            "Ser ambiguos", 
            "No ser medibles ni cuantificables", 
            "Ser claros en relación con un marco temporal", 
            "No ser comunicados a los miembros de la organización"
        ], 
        respuesta: 2, 
        explicacion: "Un objetivo SMART debe tener un plazo definido (Time-bound)." 
    },
    { 
        texto: "¿Qué porcentaje de empleados de Cisco Systems trabajan desde casa al menos el 20% del tiempo, según el caso de estudio sobre estructuras?", 
        opciones: [
            "30%", 
            "40%", 
            "50%", 
            "70%"
        ], 
        respuesta: 3, 
        explicacion: "Cisco es un ejemplo clásico de estructura sin límites y teletrabajo, citando cifras cercanas al 70% en textos administrativos." 
    },
    { 
        texto: "¿Qué aspectos abarca el componente político/legal del entorno externo de una organización?", 
        opciones: [
            "Condiciones económicas", 
            "Factores tecnológicos", 
            "Aspectos medioambientales", 
            "Leyes y legislaciones globales, condiciones políticas y estabilidad de las naciones"
        ], 
        respuesta: 3, 
        explicacion: "Se refiere a las regulaciones, leyes y clima político que afectan la operación de la empresa." 
    },
    { 
        texto: "¿Qué opción define mejor la Productividad?", 
        opciones: [
            "Proceso de contratar nuevo personal.", 
            "Evaluación de la cantidad de bienes y servicios producidos dividida por los insumos necesarios.", 
            "Supervisión remota de las actividades laborales.", 
            "Implementación de políticas de recursos humanos."
        ], 
        respuesta: 1, 
        explicacion: "La productividad es la relación entre el resultado (salidas) y los recursos utilizados (entradas)." 
    },
    { 
        texto: "¿Qué tipo de control entra en acción mientras una actividad laboral está en progreso?", 
        opciones: [
            "Control preventivo.", 
            "Control de retroalimentación.", 
            "Control concurrente.", 
            "Control estratégico."
        ], 
        respuesta: 2, 
        explicacion: "El control concurrente supervisa las actividades en tiempo real para corregir problemas antes de que se vuelvan costosos." 
    },
    { 
        texto: "¿Qué herramienta evalúa el desempeño considerando otros factores además de la perspectiva financiera?", 
        opciones: [
            "Análisis de proporciones.", 
            "Cuadro de mando integral (Balanced Scorecard).", 
            "Análisis de presupuestos.", 
            "Evaluación del desempeño."
        ], 
        respuesta: 1, 
        explicacion: "El CMI mide cuatro perspectivas: financiera, del cliente, procesos internos y aprendizaje/crecimiento." 
    },
    { 
        texto: "¿Qué es la eficacia organizacional?", 
        opciones: [
            "Medida de la motivación de los empleados.", 
            "Medida de cuán apropiados son los objetivos y de qué tan bien se están cumpliendo.", 
            "Medida de la satisfacción del cliente.", 
            "Medida de la eficiencia operativa."
        ], 
        respuesta: 1, 
        explicacion: "La eficacia se trata de 'hacer las cosas correctas' para alcanzar las metas establecidas." 
    },
    { 
        texto: "¿Cuáles son los tres pasos del proceso de control?", 
        opciones: [
            "Planificación, ejecución y evaluación.", 
            "Supervisión, motivación y corrección.", 
            "Medir el desempeño, compararlo contra un estándar, y corregir desviaciones.", 
            "Evaluación, retroalimentación y motivación."
        ], 
        respuesta: 2, 
        explicacion: "Es el ciclo fundamental: Medir lo real -> Comparar con lo planeado -> Corregir si hay fallos." 
    },
    { 
        texto: "¿Qué es la administración por contacto directo (MBWA)?", 
        opciones: [
            "Interacción directa entre el gerente y sus empleados en el área laboral.", 
            "Supervisión remota de las actividades laborales.", 
            "Implementación de políticas de recursos humanos.", 
            "Evaluación del desempeño financiero."
        ], 
        respuesta: 0, 
        explicacion: "Conocido como 'Management By Walking Around', implica que el gerente esté presente físicamente donde ocurre el trabajo." 
    },
    { 
        texto: "¿Qué es el benchmarking de mejores prácticas?", 
        opciones: [
            "Proceso de eliminar la competencia.", 
            "Búsqueda de las mejores prácticas entre competidores y no competidores para mejorar el desempeño.", 
            "Reducción de costos operativos.", 
            "Implementación de nuevas tecnologías."
        ], 
        respuesta: 1, 
        explicacion: "Consiste en aprender de los líderes (sean o no del mismo sector) para adoptar sus métodos de éxito." 
    },
    { 
        texto: "¿Qué es el 'pago variable' en la administración de recursos humanos?", 
        opciones: [
            "Sistema de pagos que recompensa a los empleados por las habilidades demostradas", 
            "Sistema de pagos en el que la compensación depende del desempeño del individuo", 
            "Sistema de pagos fijo y establecido por la empresa", 
            "Sistema de pagos basado en la antigüedad del empleado"
        ], 
        respuesta: 1, 
        explicacion: "El pago variable fluctúa según los resultados alcanzados, vinculando la compensación al rendimiento." 
    },
    { 
        texto: "¿Cuál de las siguientes opciones NO es una práctica laboral de alto rendimiento?", 
        opciones: [
            "Equipos autoadministrados", 
            "Toma de decisiones descentralizada", 
            "Comunicación abierta", 
            "Centralización de la toma de decisiones"
        ], 
        respuesta: 3, 
        explicacion: "Las organizaciones de alto rendimiento tienden a descentralizar para empoderar a los empleados, no a centralizar." 
    },
    { 
        texto: "¿Qué es el desarrollo organizacional?", 
        opciones: [
            "Proceso de reclutamiento de empleados", 
            "Estrategia para mejorar la eficacia y el bienestar de la organización y sus empleados", 
            "Evaluación del desempeño de los empleados", 
            "Capacitación y desarrollo de empleados"
        ], 
        respuesta: 1, 
        explicacion: "El DO se enfoca en cambios planificados a largo plazo para mejorar la salud y efectividad de la organización." 
    },
    { 
        texto: "¿Qué tipo de problemas disciplinarios pueden surgir en una organización?", 
        opciones: [
            "Problemas técnicos.", 
            "Problemas administrativos.", 
            "Problemas de conducta y desempeño.", 
            "Problemas financieros."
        ], 
        respuesta: 2, 
        explicacion: "La disciplina laboral generalmente aborda el mal comportamiento (conducta) o la falta de resultados (desempeño)." 
    },
    { 
        texto: "¿Qué son las acciones disciplinarias en el control del desempeño de los empleados?", 
        opciones: [
            "Acciones para recompensar a los empleados.", 
            "Acciones para hacer cumplir los estándares y reglamentos laborales.", 
            "Acciones para promover a los empleados.", 
            "Acciones para contratar nuevo personal."
        ], 
        respuesta: 1, 
        explicacion: "Son medidas correctivas para asegurar que se sigan las normas y procedimientos." 
    },
    { 
        texto: "¿Qué elemento NO es considerado una práctica de alto rendimiento?", 
        opciones: [
            "Programas de capacitación para desarrollar conocimientos.", 
            "Compensaciones con base en el desempeño.", 
            "Asignaciones de trabajo inflexibles.", 
            "Amplia participación de los empleados."
        ], 
        respuesta: 2, 
        explicacion: "La flexibilidad es clave. La rigidez (inflexibilidad) va en contra de la adaptación y el alto rendimiento." 
    },
    { 
        texto: "¿Qué implica la evaluación de potencial en la administración de recursos humanos?", 
        opciones: [
            "Proceso de selección de personal", 
            "Proceso de identificar empleados con potencial para roles futuros", 
            "Recompensa a los empleados por habilidades demostradas", 
            "Evaluación del desempeño de los empleados"
        ], 
        respuesta: 1, 
        explicacion: "A diferencia de evaluar el desempeño (pasado), el potencial mira hacia el futuro y el crecimiento del empleado." 
    },
    { 
        texto: "¿Qué deben hacer los gerentes para obtener ventaja competitiva a través de sus empleados?", 
        opciones: [
            "Considerar a los empleados como un costo que hay que evitar", 
            "Mantener una comunicación estrictamente formal", 
            "Trabajar con las personas y tratarlas como socios", 
            "Reducir la participación de los empleados"
        ], 
        respuesta: 2, 
        explicacion: "Ver al capital humano como socios estratégicos fomenta el compromiso y la innovación." 
    },
    { 
        texto: "¿Qué tipo de datos provee un SAI (Sistema de Administración de Información) en su forma más básica?", 
        opciones: [
            "Datos financieros.", 
            "Datos crudos, sin analizar.", 
            "Datos históricos.", 
            "Datos cualitativos."
        ], 
        respuesta: 1, 
        explicacion: "Técnicamente el SAI procesa datos, pero en el contexto de 'datos' vs 'información', los datos son la materia prima cruda." 
    },
    { 
        texto: "¿Qué es el análisis de presupuestos en el control financiero?", 
        opciones: [
            "Proceso de incrementar los costos.", 
            "Evaluación de los estándares cuantitativos y las desviaciones.", 
            "Reducción de los gastos operativos.", 
            "Implementación de nuevas políticas financieras."
        ], 
        respuesta: 1, 
        explicacion: "El presupuesto establece el estándar numérico; el análisis revisa si nos desviamos de ese plan." 
    },
    { 
        texto: "¿Cuál es un enfoque recomendado para los gerentes en organizaciones orientadas a las personas?", 
        opciones: [
            "Tratar a los empleados como un costo a minimizar", 
            "Tratar a los empleados como socios", 
            "Mantener una comunicación limitada con los empleados", 
            "Centralizar las decisiones importantes"
        ], 
        respuesta: 1, 
        explicacion: "Repetición de concepto clave: El empleado es un socio, no un gasto." 
    },
    { 
        texto: "¿Qué comprende el proceso de administración de recursos humanos en sus fases iniciales?", 
        opciones: [
            "Planificación de recursos humanos, reclutamiento y selección", 
            "Evaluación del desempeño y capacitación", 
            "Beneficios y compensación", 
            "Relaciones laborales y despidos"
        ], 
        respuesta: 0, 
        explicacion: "Es la puerta de entrada: planear necesidades, buscar candidatos (reclutar) y elegir a los mejores (seleccionar)." 
    },
    { 
        texto: "¿Qué es la gestión de la diversidad en la administración de recursos humanos?", 
        opciones: [
            "Proceso de selección de personal", 
            "Prácticas que promueven la inclusión de empleados de diferentes orígenes", 
            "Evaluación del desempeño de los empleados", 
            "Recompensa a los empleados por habilidades demostradas"
        ], 
        respuesta: 1, 
        explicacion: "Busca integrar y valorar las diferencias individuales para enriquecer a la organización." 
    },
    { 
        texto: "¿Cuál es el objetivo principal del reclutamiento?", 
        opciones: [
            "Evaluar el desempeño de los empleados actuales", 
            "Localizar, identificar y atraer a candidatos capaces", 
            "Reducir la fuerza laboral", 
            "Mejorar las habilidades de los empleados existentes"
        ], 
        respuesta: 1, 
        explicacion: "El reclutamiento crea la base de candidatos; la selección es la que elige después." 
    },
    { 
        texto: "¿Qué tipo de acción correctiva busca solucionar problemas de una sola vez?", 
        opciones: [
            "Acción correctiva inmediata.", 
            "Acción preventiva.", 
            "Acción de mantenimiento.", 
            "Acción básica."
        ], 
        respuesta: 0, 
        explicacion: "La inmediata apaga el fuego al instante. La básica buscaría la causa raíz para que no se repita." 
    },
    { 
        texto: "¿Cuáles son las cuatro áreas que mide el cuadro de mando integral (Balanced Scorecard)?", 
        opciones: [
            "Finanzas, clientes, procesos internos, y aprendizaje/crecimiento.", 
            "Finanzas, marketing, ventas y recursos humanos.", 
            "Operaciones, logística, ventas y marketing.", 
            "Innovación, tecnología, producción y finanzas."
        ], 
        respuesta: 0, 
        explicacion: "Modelo de Kaplan y Norton que equilibra lo financiero con lo operativo y humano." 
    },
    { 
        texto: "¿Cuál de las siguientes prácticas es fundamental para lograr el éxito competitivo a través de la gente?", 
        opciones: [
            "Centralización de la toma de decisiones", 
            "Contratación de personal sin considerar la idoneidad", 
            "Incremento del acceso de los empleados a la información", 
            "Reducción de los programas de capacitación"
        ], 
        respuesta: 2, 
        explicacion: "Compartir información empodera a los empleados y genera confianza, clave para la competitividad." 
    },
    { 
        texto: "¿Qué estilo de liderazgo utiliza la comunicación bidireccional y su principal papel es la facilitación para influir en el comportamiento?", 
        opciones: ["Liberal", "Delegar", "Dirigir", "Participar"], 
        respuesta: 3, 
        explicacion: "En el modelo situacional, 'Participar' implica compartir decisiones y facilitar, con alta relación y baja tarea." 
    },
    { 
        texto: "¿Qué es la disonancia cognitiva?", 
        opciones: [
            "Evaluación positiva de un evento", 
            "Concordancia entre las creencias y las acciones", 
            "Percepción de respaldo organizacional", 
            "Incompatibilidad entre actitudes o entre comportamientos y actitudes"
        ], 
        respuesta: 3, 
        explicacion: "Es el malestar psicológico sentido cuando hay un conflicto entre lo que se cree y lo que se hace." 
    },
    { 
        texto: "¿Qué define el involucramiento del empleado?", 
        opciones: [
            "Baja rotación de personal", 
            "Comportamiento cívico organizacional", 
            "Alta tasa de ausentismo", 
            "Conexión con su trabajo y entusiasmo por su labor"
        ], 
        respuesta: 3, 
        explicacion: "Empleados involucrados están conectados emocionalmente con su trabajo y motivados para dar lo mejor." 
    },
    { 
        texto: "Relaciona las etapas de preparación de los seguidores con sus descripciones (Hersey y Blanchard):\n1. R3 (Capaz/No dispuesto)\n2. R1 (Incapaz/No dispuesto)\n3. R4 (Capaz/Dispuesto)\n4. R2 (Incapaz/Dispuesto)", 
        opciones: [
            "1-B, 2-C, 3-D, 4-A", 
            "1-D, 2-A, 3-B, 4-C", 
            "1-A, 2-B, 3-C, 4-D", 
            "1-C, 2-D, 3-A, 4-B"
        ], 
        respuesta: 2, 
        explicacion: "La relación correcta es: R3-A, R1-B, R4-C, R2-D." 
    },
    { 
        texto: "Empareja los estilos de liderazgo del modelo situacional con sus descripciones:\n1. Dirigir (Instrucciones claras)\n2. Persuadir (Comunicación bidireccional/apoyo)\n3. Participar (Facilitar decisiones)\n4. Delegar (Poca supervisión)", 
        opciones: [
            "1-A, 2-B, 3-C, 4-D", 
            "1-C, 2-D, 3-A, 4-B", 
            "1-D, 2-A, 3-B, 4-C", 
            "1-B, 2-C, 3-D, 4-A"
        ], 
        respuesta: 0, 
        explicacion: "Cada estilo corresponde a su definición clásica: Dirigir (Alta Tarea), Persuadir (Alta Tarea/Relación), Participar (Alta Relación), Delegar (Baja ambos)." 
    },
    { 
        texto: "¿Cómo se relaciona la satisfacción laboral con la satisfacción del cliente?", 
        opciones: [
            "La satisfacción laboral mejora la satisfacción del cliente", 
            "La satisfacción laboral no afecta la satisfacción del cliente", 
            "No hay relación entre satisfacción laboral y satisfacción del cliente", 
            "La satisfacción laboral disminuye la satisfacción del cliente"
        ], 
        respuesta: 0, 
        explicacion: "La cadena de servicio-utilidad establece que empleados satisfechos atienden mejor, generando clientes satisfechos." 
    },
    { 
        texto: "¿Cuál de las siguientes combinaciones de conceptos es correcta?\n1. Actitud (Evaluaciones)\n2. CO (Comportamientos)\n3. Aprendizaje (Conocimiento)\n4. Satisfacción (Sentimientos)", 
        opciones: [
            "1-A, 2-B, 3-D, 4-C", 
            "1-B, 2-D, 3-C, 4-A", 
            "1-D, 2-C, 3-B, 4-A", 
            "1-C, 2-A, 3-B, 4-D"
        ], 
        respuesta: 2, 
        explicacion: "Actitud=D (Evaluaciones +/-), CO=C (Estudio comportamiento), Aprendizaje=B, Satisfacción=A." 
    },
    { 
        texto: "Empareja los componentes del liderazgo carismático:\n1. Visión\n2. Riesgo personal\n3. Sensibilidad ambiental\n4. Comportamientos no convencionales", 
        opciones: [
            "1-A, 2-B, 3-C, 4-D", 
            "1-D, 2-A, 3-B, 4-C", 
            "1-C, 2-D, 3-A, 4-B", 
            "1-B, 2-C, 3-D, 4-A"
        ], 
        respuesta: 0, 
        explicacion: "El líder carismático articula una visión (A), asume riesgos (B), es sensible al entorno (C) y actúa de forma novedosa (D)." 
    },
    { 
        texto: "Relaciona las fuentes del poder:\n1. Coercitivo (Castigar)\n2. Experto (Pericia)\n3. Recompensa (Dar premios)\n4. Legítimo (Puesto)", 
        opciones: [
            "1-A, 2-B, 3-C, 4-D", 
            "1-B, 2-C, 3-D, 4-A", 
            "1-D, 2-A, 3-B, 4-C", 
            "1-C, 2-D, 3-A, 4-B"
        ], 
        respuesta: 2, 
        explicacion: "Coercitivo=D, Experto=A, Recompensa=B, Legítimo=C." 
    },
    { 
        texto: "¿Qué caracteriza a una persona con alto maquiavelismo?", 
        opciones: [
            "Grado en el que las personas son pragmáticas y consideran que los fines justifican los medios", 
            "Baja autoestima", 
            "Nivel alto de empatía", 
            "Alta estabilidad emocional"
        ], 
        respuesta: 0, 
        explicacion: "El maquiavelismo se asocia a la manipulación política y el pragmatismo emocional ('El fin justifica los medios')." 
    },
    { 
        texto: "Relaciona las características del liderazgo:\n1. Iniciativa (Decisiones)\n2. Confianza (Habilidades propias)\n3. Integridad (Honestidad)\n4. Empatía (Sentimientos ajenos)", 
        opciones: [
            "1-C, 2-D, 3-B, 4-A", 
            "1-D, 2-C, 3-A, 4-B", 
            "1-B, 2-A, 3-D, 4-C", 
            "1-D, 2-B, 3-C, 4-A"
        ], 
        respuesta: 3, 
        explicacion: "Iniciativa=D, Confianza=B, Integridad=C, Empatía=A." 
    },
    { 
        texto: "Identifica la combinación correcta del liderazgo transformacional:\n1. Influencia idealizada (Misión/Orgullo)\n2. Motivación inspiradora (Expectativas/Símbolos)\n3. Est. Intelectual (Racionalidad)\n4. Cons. Individualizada (Atención personal)", 
        opciones: [
            "1-C, 2-A, 3-B, 4-D", 
            "1-D, 2-B, 3-C, 4-A", 
            "1-B, 2-D, 3-A, 4-C", 
            "1-D, 2-C, 3-B, 4-A"
        ], 
        respuesta: 1, 
        explicacion: "Infl. Idealizada=D (Visión), Mot. Inspiradora=B (Símbolos), Est. Intelectual=C (Problemas), Cons. Individual=A (Coaching)." 
    },
    { 
        texto: "¿Cuál es el estilo de liderazgo situacional que se caracteriza por proporcionar instrucciones claras y específicas?", 
        opciones: ["Delegar", "Participar", "Hablar / Dirigir", "Persuadir"], 
        respuesta: 2, 
        explicacion: "El estilo 'Telling' (Hablar/Dirigir) es de alta tarea y baja relación, ideal para seguidores R1." 
    },
    { 
        texto: "¿Qué son las encuestas actitudinales?", 
        opciones: [
            "Informes sobre la rotación de personal", 
            "Evaluaciones de desempeño laboral", 
            "Encuestas que miden la productividad", 
            "Encuestas que provocan respuestas sobre cómo se sienten los empleados respecto a su trabajo"
        ], 
        respuesta: 3, 
        explicacion: "Buscan medir el clima laboral y la satisfacción de los empleados." 
    },
    { 
        texto: "Combinación correcta de conceptos:\n1. Toma de decisiones (Seleccionar opción)\n2. Respaldo org. (Bienestar)\n3. Similitud asumida (Parecidos a uno)\n4. Reforzamiento positivo (Recompensar)", 
        opciones: [
            "1-B, 2-A, 3-D, 4-C", 
            "1-C, 2-B, 3-A, 4-D", 
            "1-A, 2-D, 3-B, 4-C", 
            "1-D, 2-C, 3-A, 4-B"
        ], 
        respuesta: 1, 
        explicacion: "Toma decisiones=C, Respaldo=B, Similitud=A, Reforzamiento=D." 
    },
    { 
        texto: "¿Cuál es un ejemplo de comportamiento cívico organizacional (CCO)?", 
        opciones: [
            "Ayudar a un compañero sin esperar recompensa", 
            "Asistir a todas las reuniones obligatorias", 
            "Completar las tareas asignadas", 
            "Seguir las políticas de la empresa"
        ], 
        respuesta: 0, 
        explicacion: "El CCO es un comportamiento discrecional (voluntario) que no es parte de los requisitos formales del puesto." 
    },
    { 
        texto: "¿Cuál de las siguientes afirmaciones describe mejor la efectividad del liderazgo según el modelo de contingencia de Fiedler?", 
        opciones: [
            "Un líder efectivo es aquel cuya conducta de liderazgo coincide con la situación.", 
            "Un líder efectivo siempre debe ser flexible y adaptable.", 
            "Un líder efectivo debe ser autoritario en situaciones de crisis.", 
            "Un líder efectivo debe enfocarse en la tarea más que en las relaciones"
        ], 
        respuesta: 0, 
        explicacion: "Fiedler sostenía que el estilo es fijo, por lo que la clave es ajustar la situación al líder o cambiar al líder." 
    },
    { 
        texto: "¿Qué actitud refleja un alto nivel de satisfacción laboral?", 
        opciones: [
            "Una actitud positiva hacia el trabajo", 
            "Una actitud indiferente hacia el trabajo", 
            "Una actitud negativa hacia el trabajo", 
            "Una actitud neutral hacia el trabajo"
        ], 
        respuesta: 0, 
        explicacion: "La satisfacción laboral es, por definición, una actitud general positiva hacia el empleo de uno." 
    },
    { 
        texto: "Combinación final:\n1. Desempeño (Cumplir req.)\n2. Sat. Vida (Bienestar gral.)\n3. Eficacia Org. (Logro metas)\n4. Calidad vida laboral (Percepción entorno)", 
        opciones: [
            "1-C, 2-D, 3-B, 4-A", 
            "1-A, 2-C, 3-D, 4-B", 
            "1-B, 2-A, 3-C, 4-D", 
            "1-D, 2-B, 3-A, 4-C"
        ], 
        respuesta: 3, 
        explicacion: "Desempeño=D, Vida=B, Eficacia=A, Calidad=C." 
    },

];
// VARIABLES GLOBALES
let preguntasExamen = []; // Se llena aleatoriamente con 20 preguntas
let indiceActual = 0;
let respuestasUsuario = []; 
let seleccionTemporal = null; 
let tiempoRestante = 0;
let intervaloTiempo;

// REFERENCIAS HTML
const authScreen = document.getElementById('auth-screen');
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const reviewScreen = document.getElementById('review-screen');
const btnLogout = document.getElementById('btn-logout');
const btnNextQuestion = document.getElementById('btn-next-question');

// --- 4. FUNCIÓN: OBTENER ID ÚNICO DEL DISPOSITIVO ---
function obtenerDeviceId() {
    let deviceId = localStorage.getItem('device_id_seguro');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('device_id_seguro', deviceId);
    }
    return deviceId;
}

// --- 5. LÓGICA DE SEGURIDAD AVANZADA (CUPOS DIFERENCIADOS) ---
async function validarDispositivo(user) {
    const email = user.email;
    const miDeviceId = obtenerDeviceId(); 
    
    // Determinar el límite de dispositivos para este usuario
    let limiteDispositivos = 1;
    if (correosDosDispositivos.includes(email)) {
        limiteDispositivos = 2;
    }

    // Consultar la base de datos
    const docRef = doc(db, "usuarios_seguros", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const datos = docSnap.data();
        let listaDispositivos = datos.dispositivos || []; 
        
        if (listaDispositivos.includes(miDeviceId)) {
            return true; // Dispositivo ya registrado
        } else {
            if (listaDispositivos.length < limiteDispositivos) {
                // Registrar nuevo dispositivo
                listaDispositivos.push(miDeviceId);
                await setDoc(docRef, { dispositivos: listaDispositivos }, { merge: true });
                return true;
            } else {
                // Acceso denegado por exceder el límite
                alert(`⛔ ACCESO DENEGADO ⛔\n\nHas excedido tu límite de ${limiteDispositivos} dispositivos registrados. Debes cerrar sesión en otro equipo para continuar.`);
                await signOut(auth);
                location.reload();
                return false;
            }
        }
    } else {
        // Primer inicio de sesión: registrar el dispositivo con su límite
        await setDoc(docRef, {
            dispositivos: [miDeviceId],
            fecha_registro: new Date().toISOString()
        });
        return true;
    }
}

// --- 6. MONITOR DE AUTENTICACIÓN ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (correosPermitidos.includes(user.email)) {
            const titulo = document.querySelector('h2');
            if(titulo) titulo.innerText = "Verificando Dispositivo..."; 
            
            const dispositivoValido = await validarDispositivo(user);
            
            if (dispositivoValido) {
                authScreen.classList.add('hidden');
                setupScreen.classList.remove('hidden');
                btnLogout.classList.remove('hidden');
                document.getElementById('user-display').innerText = user.email;
                if(titulo) titulo.innerText = "Bienvenido";
            }
        } else {
            alert("ACCESO RESTRINGIDO: Tu correo no está autorizado.");
            signOut(auth);
        }
    } else {
        authScreen.classList.remove('hidden');
        setupScreen.classList.add('hidden');
        quizScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        reviewScreen.classList.add('hidden');
        btnLogout.classList.add('hidden');
    }
});

// --- 7. EVENTOS ---
document.getElementById('btn-google').addEventListener('click', () => {
    signInWithPopup(auth, new GoogleAuthProvider()).catch(e => alert("Error Google: " + e.message));
});

btnLogout.addEventListener('click', () => { signOut(auth); location.reload(); });

// --- 8. LÓGICA DEL EXAMEN (Aleatorio 20 o Estudio todas) ---
document.getElementById('btn-start').addEventListener('click', () => {
    const tiempo = document.getElementById('time-select').value;
    const modo = document.getElementById('mode-select').value;

    if (tiempo !== 'infinity') { tiempoRestante = parseInt(tiempo) * 60; iniciarReloj(); } 
    else { document.getElementById('timer-display').innerText = "--:--"; }
    
    // Lógica de Modo
    if (modo === 'study') {
        preguntasExamen = [...bancoPreguntas].sort(() => 0.5 - Math.random());
    } else {
        // MODO EXAMEN: Carga 20 preguntas aleatorias
        preguntasExamen = [...bancoPreguntas]
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 20); // 20 PREGUNTAS
    }
    
    respuestasUsuario = []; 
    indiceActual = 0;
    setupScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    cargarPregunta();
});

function cargarPregunta() {
    seleccionTemporal = null; 
    btnNextQuestion.classList.add('hidden'); 
    
    if (indiceActual >= preguntasExamen.length) { terminarQuiz(); return; }
    
    const data = preguntasExamen[indiceActual];
    document.getElementById('question-text').innerText = `${indiceActual + 1}. ${data.texto}`;
    const cont = document.getElementById('options-container'); cont.innerHTML = '';
    
    data.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.innerText = opcion;
        btn.onclick = () => seleccionarOpcion(index, btn); 
        cont.appendChild(btn);
    });
    document.getElementById('progress-display').innerText = `Pregunta ${indiceActual + 1} de ${preguntasExamen.length}`;

    if(indiceActual === preguntasExamen.length - 1) {
        btnNextQuestion.innerHTML = 'Finalizar <i class="fa-solid fa-check"></i>';
    } else {
        btnNextQuestion.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
    }
}

// --- FUNCIÓN MODIFICADA PARA SEPARAR EL MODO ESTUDIO/EXAMEN ---
function seleccionarOpcion(index, btnClickeado) {
    const isStudyMode = document.getElementById('mode-select').value === 'study';

    // Si ya se ha seleccionado una opción en el modo estudio, no permitir cambiar
    if (isStudyMode && seleccionTemporal !== null) {
        return;
    }
    
    seleccionTemporal = index;
    const botones = document.getElementById('options-container').querySelectorAll('button');
    botones.forEach(b => b.classList.remove('option-selected'));
    btnClickeado.classList.add('option-selected');
    
    if (isStudyMode) {
        mostrarResultadoInmediato(index);
    } else {
        // MODO EXAMEN: Solo guarda la selección temporal y muestra el botón Siguiente
        btnNextQuestion.classList.remove('hidden');
    }
}

// --- NUEVA FUNCIÓN: Muestra respuesta y explicación en modo Estudio ---
function mostrarResultadoInmediato(seleccionada) {
    const pregunta = preguntasExamen[indiceActual];
    const correcta = pregunta.respuesta;
    const cont = document.getElementById('options-container');
    const botones = cont.querySelectorAll('button');
    
    // Deshabilitar todos los botones para que no se pueda cambiar la respuesta
    botones.forEach(btn => btn.disabled = true);

    // Iterar para mostrar el feedback visual (verde/rojo)
    botones.forEach((btn, index) => {
        btn.classList.remove('option-selected'); // Quitar selección temporal
        
        if (index === correcta) {
            btn.classList.add('ans-correct', 'feedback-visible');
        } else if (index === seleccionada) {
            btn.classList.add('ans-wrong', 'feedback-visible');
        }
    });

    // Añadir la explicación
    const divExplicacion = document.createElement('div');
    divExplicacion.className = 'explanation-feedback';
    divExplicacion.innerHTML = `<strong>Explicación:</strong> ${pregunta.explicacion}`;
    cont.appendChild(divExplicacion);
    
    // Registrar la respuesta y mostrar el botón Siguiente
    respuestasUsuario.push(seleccionada);
    btnNextQuestion.classList.remove('hidden');
}


// --- EVENTO MODIFICADO para el botón Siguiente ---
btnNextQuestion.addEventListener('click', () => {
    const isStudyMode = document.getElementById('mode-select').value === 'study';
    
    // En modo estudio, simplemente avanza a la siguiente pregunta (la respuesta ya fue registrada en mostrarResultadoInmediato)
    if (isStudyMode && seleccionTemporal !== null) {
        indiceActual++;
        cargarPregunta();
        return; 
    }
    
    // MODO EXAMEN: Registra la respuesta y avanza (sin feedback inmediato)
    if (seleccionTemporal !== null) {
        respuestasUsuario.push(seleccionTemporal);
        indiceActual++;
        cargarPregunta();
    }
});


function iniciarReloj() {
    intervaloTiempo = setInterval(() => {
        tiempoRestante--;
        let m = Math.floor(tiempoRestante / 60), s = tiempoRestante % 60;
        document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (tiempoRestante <= 0) { clearInterval(intervaloTiempo); terminarQuiz(); }
    }, 1000);
}

function terminarQuiz() {
    clearInterval(intervaloTiempo);
    let aciertos = 0;
    preguntasExamen.forEach((p, i) => { if (respuestasUsuario[i] === p.respuesta) aciertos++; });
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    document.getElementById('score-final').innerText = `${aciertos} / ${preguntasExamen.length}`;
    
    // --- Ocultar botón Revisar Respuestas si es modo Estudio ---
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect && modeSelect.value === 'study') {
        document.getElementById('btn-review').classList.add('hidden');
    } else {
        document.getElementById('btn-review').classList.remove('hidden');
    }
    // --------------------------------------------------------
}

// --- 9. REVISIÓN ---
document.getElementById('btn-review').addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    reviewScreen.classList.remove('hidden');
    const cont = document.getElementById('review-container'); cont.innerHTML = '';
    
    preguntasExamen.forEach((p, i) => {
        const dada = respuestasUsuario[i], ok = (dada === p.respuesta);
        const card = document.createElement('div'); card.className = 'review-item';
        let ops = '';
        p.opciones.forEach((o, x) => {
            let c = (x === p.respuesta) ? 'ans-correct' : (x === dada && !ok ? 'ans-wrong' : '');
            let ico = (x === p.respuesta) ? '✅ ' : (x === dada && !ok ? '❌ ' : '');
            let b = (x === dada) ? 'user-selected' : '';
            ops += `<div class="review-answer ${c} ${b}">${ico}${o}</div>`;
        });
        card.innerHTML = `<div class="review-question">${i+1}. ${p.texto}</div>${ops}<div class="review-explanation"><strong>Explicación:</strong> ${p.explicacion}</div>`;
        cont.appendChild(card);
    });
});
