
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Route className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                SmartRoads
              </h1>
            </div>
            <a href="/" className="text-blue-600 hover:underline">Volver al inicio</a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">DESARROLLO DE UN SISTEMA WEB DINÁMICO PARA LA GESTIÓN INTELIGENTE DE CARRETERAS</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2 className="text-xl font-bold mb-4 text-center">ÍNDICE</h2>
            <p className="text-center mb-6">
              INTRODUCCIÓN..........................................................................................3<br />
              1.1 HISTORIA DE LOS SISTEMAS DE MONITOREO DE TRÁFICO.........................4<br />
              1.1.1 Definición de un Sistema de Gestión de Carreteras................................5<br />
              1.2 El Impacto de los Sistemas de Gestión en la Movilidad Urbana................5<br />
              1.3 Tecnologías Aplicadas........................................................................6<br />
              1.4 Metodología y Herramientas............................................................7<br />
              2. Análisis de Requisitos.........................................................................9<br />
              3. Diseño del Sistema............................................................................10<br />
              4. Implementación y Pruebas................................................................11<br />
              5. Conclusión........................................................................................12<br />
            </p>

            <h2 className="text-xl font-bold mt-8">INTRODUCCIÓN</h2>
            <p>
              En la era de la digitalización y las ciudades inteligentes, la gestión eficiente del tráfico y la 
              infraestructura vial se ha convertido en un pilar fundamental para el desarrollo urbano sostenible. 
              SmartRoads nace como respuesta a esta necesidad, ofreciendo una plataforma web dinámica capaz de 
              monitorear, analizar y optimizar la gestión de las carreteras mexicanas.
            </p>
            <p>
              Este sistema integra tecnologías avanzadas de visualización geoespacial, análisis de datos en tiempo 
              real y herramientas predictivas para proporcionar a los gestores de tráfico una visión completa y 
              actualizada del estado de las carreteras. A través de interfaces intuitivas y reportes detallados, 
              SmartRoads facilita la toma de decisiones estratégicas para mejorar la movilidad, reducir la 
              congestión y aumentar la seguridad vial.
            </p>
            <p>
              El desarrollo de SmartRoads se ha realizado siguiendo la metodología en cascada, garantizando un 
              proceso estructurado desde la conceptualización hasta la implementación. Cada fase ha sido cuidadosamente 
              planificada y ejecutada para asegurar un producto final robusto, escalable y adaptado a las necesidades 
              específicas de la gestión vial en México.
            </p>

            <h2 className="text-xl font-bold mt-6">1.1 HISTORIA DE LOS SISTEMAS DE MONITOREO DE TRÁFICO</h2>
            <p>
              Los sistemas de monitoreo de tráfico han evolucionado significativamente desde sus inicios en la 
              década de los 60, cuando las primeras cámaras de circuito cerrado comenzaron a utilizarse para 
              observar el flujo vehicular en grandes ciudades como Londres y Nueva York.
            </p>
            <p>
              En los años 80, con la llegada de los microprocesadores, se implementaron los primeros sistemas 
              computarizados de control de tráfico que permitían ajustar semáforos según patrones de circulación. 
              La década de los 90 vio la integración de sensores en el pavimento y radares para la detección 
              automatizada de vehículos.
            </p>
            <p>
              El verdadero salto tecnológico llegó en los 2000 con la incorporación de GPS y sistemas GIS 
              (Geographic Information Systems) que permitieron visualizar el tráfico en mapas digitales y 
              realizar análisis espaciales complejos. Estas tecnologías sentaron las bases para los modernos 
              centros de control de tráfico urbano.
            </p>
            <p>
              A partir de 2010, la explosión del big data y la conectividad móvil ha permitido el desarrollo 
              de plataformas que integran múltiples fuentes de información: sensores IoT, cámaras con visión 
              artificial, datos de aplicaciones móviles y reportes ciudadanos. En la actualidad, sistemas como 
              SmartRoads representan la nueva generación de soluciones inteligentes para la gestión vial.
            </p>

            <h2 className="text-xl font-bold mt-6">1.1.1 Definición de un Sistema de Gestión de Carreteras</h2>
            <p>
              Un Sistema de Gestión de Carreteras (SGC) es una plataforma tecnológica que integra herramientas de 
              monitoreo, análisis y gestión de infraestructuras viales para optimizar su operación, mantenimiento 
              y planificación estratégica. Según Rodríguez-Sánchez (2019), estos sistemas permiten la recopilación, 
              procesamiento y visualización de datos relacionados con el estado físico de las vías, patrones de 
              tráfico, incidentes y condiciones ambientales.
            </p>
            <p>
              Los SGC modernos, como SmartRoads, se caracterizan por su capacidad para proporcionar información 
              en tiempo real, generar análisis predictivos y facilitar la toma de decisiones basadas en datos. 
              Estos sistemas utilizan tecnologías como GPS, sistemas de información geográfica, sensores IoT y 
              algoritmos de inteligencia artificial para crear una representación digital completa de la red vial.
            </p>

            <h2 className="text-xl font-bold mt-6">1.2 El Impacto de los Sistemas de Gestión en la Movilidad Urbana</h2>
            <p>
              La implementación de sistemas inteligentes de gestión de carreteras ha demostrado tener múltiples 
              beneficios para la movilidad urbana y la eficiencia del transporte:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>
                <strong>Reducción del tiempo de viaje:</strong> La optimización de rutas y la gestión dinámica 
                del tráfico pueden disminuir los tiempos de desplazamiento hasta en un 20% (Vázquez et al., 2023).
              </li>
              <li>
                <strong>Disminución de emisiones contaminantes:</strong> Al reducir la congestión y mejorar el flujo 
                vehicular, se logra una reducción significativa en las emisiones de CO₂.
              </li>
              <li>
                <strong>Mejora de la seguridad vial:</strong> La detección temprana de incidentes y la implementación 
                de medidas preventivas contribuyen a reducir la accidentalidad.
              </li>
              <li>
                <strong>Optimización de recursos de mantenimiento:</strong> La identificación precisa de tramos que 
                requieren intervención permite priorizar inversiones y maximizar su impacto.
              </li>
              <li>
                <strong>Mejora en la toma de decisiones:</strong> El acceso a datos precisos y actualizados facilita 
                la planificación estratégica de la infraestructura vial.
              </li>
            </ul>
            <p>
              En el caso específico de México, estudios recientes han demostrado que la implementación de sistemas 
              como SmartRoads podría generar ahorros anuales de hasta 20,000 millones de pesos en costos asociados 
              a la congestión vial (Instituto Mexicano del Transporte, 2024).
            </p>

            <h2 className="text-xl font-bold mt-6">1.3 Tecnologías Aplicadas</h2>
            <p>
              SmartRoads integra diversas tecnologías de vanguardia para ofrecer una solución completa de gestión vial:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>
                <strong>React y JavaScript:</strong> Framework para el desarrollo de interfaces de usuario interactivas 
                y componentes reutilizables.
              </li>
              <li>
                <strong>Tailwind CSS:</strong> Sistema de diseño utilizado para crear una interfaz moderna, responsiva 
                y visualmente consistente.
              </li>
              <li>
                <strong>Google Maps API:</strong> Plataforma de mapeo digital que permite la visualización geoespacial 
                de las carreteras y el tráfico en tiempo real.
              </li>
              <li>
                <strong>Recharts:</strong> Biblioteca de visualización de datos para la creación de gráficos interactivos 
                que muestran tendencias de tráfico y estadísticas relevantes.
              </li>
              <li>
                <strong>TanStack Query:</strong> Herramienta para la gestión del estado y las peticiones de datos, 
                optimizando el rendimiento y la experiencia de usuario.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-6">1.4 Metodología y Herramientas</h2>
            <h3 className="text-lg font-semibold mt-4">1.4.1 Metodología en Cascada</h3>
            <p>
              El desarrollo de SmartRoads ha seguido la metodología en cascada, un enfoque secuencial que ofrece 
              estructura y rigor al proceso de desarrollo. Este método divide el proyecto en fases bien definidas, 
              cada una con objetivos específicos y entregables claros:
            </p>
            <ol className="list-decimal pl-8 my-4">
              <li>
                <strong>Análisis de requisitos:</strong> Identificación de las necesidades de los usuarios y definición 
                de las funcionalidades del sistema.
              </li>
              <li>
                <strong>Diseño:</strong> Creación de la arquitectura del sistema, definición de interfaces y componentes.
              </li>
              <li>
                <strong>Implementación:</strong> Desarrollo del código fuente y construcción de los componentes del sistema.
              </li>
              <li>
                <strong>Pruebas:</strong> Verificación del correcto funcionamiento del sistema y detección de posibles errores.
              </li>
              <li>
                <strong>Despliegue:</strong> Puesta en producción del sistema y capacitación de los usuarios.
              </li>
              <li>
                <strong>Mantenimiento:</strong> Actualización y mejora continua del sistema una vez en operación.
              </li>
            </ol>
            <p>
              La metodología en cascada ha permitido mantener un control riguroso sobre cada fase del desarrollo, 
              garantizando que los requisitos iniciales se cumplan de manera efectiva en el producto final.
            </p>

            <h3 className="text-lg font-semibold mt-4">1.4.2 Herramientas y Plataformas</h3>
            <p>
              Para el desarrollo y despliegue de SmartRoads, se han utilizado diversas herramientas y plataformas:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>
                <strong>Visual Studio Code:</strong> Editor de código con extensiones especializadas para React y TypeScript.
              </li>
              <li>
                <strong>GitHub:</strong> Sistema de control de versiones para la gestión colaborativa del código fuente.
              </li>
              <li>
                <strong>Vite:</strong> Herramienta de compilación que proporciona un entorno de desarrollo rápido y eficiente.
              </li>
              <li>
                <strong>Jest y React Testing Library:</strong> Frameworks para la creación y ejecución de pruebas automatizadas.
              </li>
              <li>
                <strong>Netlify:</strong> Plataforma para el despliegue continuo y alojamiento del sistema en la nube.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-6">2. Análisis de Requisitos</h2>
            <h3 className="text-lg font-semibold mt-4">2.1 Requisitos Funcionales</h3>
            <p>
              El sistema SmartRoads debe cumplir con los siguientes requisitos funcionales:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>Visualizar el estado del tráfico en carreteras mediante un mapa interactivo.</li>
              <li>Filtrar la información por regiones o estados de México.</li>
              <li>Mostrar análisis estadísticos del tráfico en diferentes períodos de tiempo.</li>
              <li>Listar las carreteras con información detallada de cada una.</li>
              <li>Calcular rutas óptimas entre dos puntos considerando las condiciones de tráfico.</li>
              <li>Generar reportes sobre el estado de las carreteras y niveles de congestión.</li>
              <li>Mostrar tendencias y patrones de tráfico mediante gráficos interactivos.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">2.2 Requisitos No Funcionales</h3>
            <ul className="list-disc pl-8 my-4">
              <li>Interfaz de usuario intuitiva y responsive, adaptable a diferentes dispositivos.</li>
              <li>Tiempos de respuesta rápidos en la carga de mapas y visualización de datos.</li>
              <li>Compatibilidad con los principales navegadores web modernos.</li>
              <li>Escalabilidad para soportar el crecimiento en volumen de datos y usuarios.</li>
              <li>Seguridad en el acceso y manejo de la información.</li>
            </ul>

            <h2 className="text-xl font-bold mt-6">3. Diseño del Sistema</h2>
            <p>
              La arquitectura de SmartRoads se ha diseñado siguiendo un enfoque modular y escalable:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>
                <strong>Frontend:</strong> Desarrollado con React y TypeScript, organizando los componentes en una estructura 
                jerárquica que facilita el mantenimiento y la reutilización.
              </li>
              <li>
                <strong>Gestión de Estado:</strong> Implementación de TanStack Query para el manejo eficiente de los datos 
                y estados de la aplicación.
              </li>
              <li>
                <strong>Visualización de Datos:</strong> Integración de Recharts para la creación de gráficos y Google Maps 
                API para la representación geoespacial.
              </li>
              <li>
                <strong>Diseño UI/UX:</strong> Utilización de Tailwind CSS y componentes de ShadCN para crear una interfaz 
                moderna, consistente y accesible.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-6">4. Implementación y Pruebas</h2>
            <p>
              La implementación de SmartRoads se ha realizado de manera progresiva, desarrollando primero los componentes 
              core del sistema y luego extendiendo su funcionalidad:
            </p>
            <ol className="list-decimal pl-8 my-4">
              <li>Desarrollo del mapa interactivo con integración de la API de Google Maps.</li>
              <li>Implementación del selector de regiones y filtros de visualización.</li>
              <li>Creación de componentes para la visualización de datos estadísticos.</li>
              <li>Desarrollo del listado de carreteras con funcionalidad de búsqueda y filtrado.</li>
              <li>Integración del calculador de rutas y optimizador de trayectos.</li>
              <li>Implementación de los diversos tipos de gráficos y reportes.</li>
            </ol>
            <p>
              Las pruebas del sistema se han realizado a múltiples niveles:
            </p>
            <ul className="list-disc pl-8 my-4">
              <li>Pruebas unitarias para verificar el funcionamiento de componentes individuales.</li>
              <li>Pruebas de integración para comprobar la correcta interacción entre componentes.</li>
              <li>Pruebas de usabilidad con usuarios potenciales para evaluar la experiencia de uso.</li>
              <li>Pruebas de rendimiento para garantizar tiempos de respuesta óptimos.</li>
            </ul>

            <h2 className="text-xl font-bold mt-6">5. Conclusión</h2>
            <p>
              SmartRoads representa un avance significativo en la forma de gestionar y monitorear las carreteras de México. 
              Este sistema no solo proporciona información valiosa sobre el estado actual de la red vial, sino que también 
              ofrece herramientas analíticas para la planificación estratégica y la toma de decisiones informadas.
            </p>
            <p>
              La combinación de tecnologías modernas de desarrollo web con capacidades avanzadas de visualización de datos 
              geoespaciales ha permitido crear una plataforma robusta, intuitiva y de alto valor para los gestores de 
              infraestructura vial y los usuarios de las carreteras.
            </p>
            <p>
              A medida que las ciudades mexicanas continúan creciendo y enfrentando desafíos cada vez más complejos en 
              términos de movilidad, soluciones como SmartRoads serán fundamentales para avanzar hacia un modelo de 
              transporte más eficiente, sostenible y seguro para todos los ciudadanos.
            </p>
            <p className="mt-8 text-sm text-slate-500">
              © 2025 SmartRoads. Todos los derechos reservados.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-slate-500 text-sm">
          &copy; 2025 SmartRoads. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default About;
