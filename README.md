# Coding Interview Backend Level 3

Este repositorio contiene la solución al challenge de Backend que desarrollé, abarcando tanto el desarrollo del código como la infraestructura de producción en AWS.

## Contenido

- [Introducción](#introducción)
- [Solución de Código](#solución-de-código)
- [Infraestructura en AWS](#infraestructura-en-aws)
- [Justificación de Decisiones](#justificación-de-decisiones)
- [Cómo Consultar el Challenge](#cómo-consultar-el-challenge)
- [API](#API)

## Introducción

La solución se centra en crear una API REST para realizar operaciones CRUD sobre la entidad **Item** (con campos `id`, `name` y `price`), utilizando **Hapi.js** con **TypeScript**. Se implementó todo el código necesario, se mantuvieron los tests proporcionados (*) y se integró la solución con una infraestructura en AWS que garantiza persistencia de datos, despliegue en producción y escalabilidad.

(*) se hizo una pequeña modificación al archivo `index.test.ts` para reiniciar la base de datos en memoria.

## Solución de Código

- **Framework y Lenguaje:**  
  Utilicé **Hapi.js** con **TypeScript** para construir la API REST. Esto me permitió aprovechar la tipificación de TypeScript y las funcionalidades robustas de Hapi para el desarrollo de aplicaciones backend seguras y escalables.

- **Operaciones CRUD:**  
  La API expone endpoints para crear, leer, actualizar y eliminar items, cumpliendo con los requerimientos del challenge.  
  - Se implementaron validaciones utilizando, por ejemplo, **Joi** para asegurar la calidad de los datos entrantes.
  - Se incluyeron tests (unitarios y e2e) para validar la funcionalidad y garantizar que el código cumple con los requisitos.

- **Persistencia:**  
  Se utilizó **Prisma ORM** para interactuar con una base de datos PostgreSQL, asegurando que los datos se mantengan persistentes incluso tras reinicios del servicio.

Para ver la descripción completa del challenge, consulta el archivo [CHALLENGE.md](./CHALLENGE.md).

## Infraestructura en AWS

- **Contenerización:**  
  La aplicación se empaquetó en un contenedor Docker mediante un **Dockerfile** multi-stage, lo que optimiza el tamaño final de la imagen y separa las fases de build y runtime.

- **Despliegue en AWS:**  
  La solución está desplegada en AWS utilizando **ECS Fargate**, lo que permite una administración sencilla sin preocuparse por la infraestructura de servidores.  
  - Se configuró un **Application Load Balancer (ALB)** para recibir el tráfico entrante en puertos 80/443 y redirigirlo a las tareas en el puerto 3000.
  - Se configuraron **Target Groups** y reglas de health check adecuadas (por ejemplo, endpoint `/ping`) para garantizar la disponibilidad de la aplicación.
  - Se habilitaron **Access Logs** en el ALB, lo que permite rastrear el tráfico y diagnosticar problemas a través de logs almacenados en S3.

- **CI/CD:**  
  La integración y despliegue continuo se realizó mediante **GitHub Actions**. El pipeline incluye:
  - Ejecución de tests (unitarios y e2e) con base de datos en memoria SQLite.
  - Build y push de la imagen Docker a ECR.
  - Despliegue automatizado en ECS, actualizando la Task Definition y el servicio con el nuevo contenedor.

## Justificación de Decisiones

- **Enfoque en el Backend:**  
  Aunque el challenge permitía elegir un framework web, decidí centrarme en desarrollar un backend robusto, invirtiendo el tiempo en la calidad del código, validaciones y tests, y en levantar una infraestructura de producción que garantice persistencia y escalabilidad.

- **Tecnologías Elegidas:**  
  - **Hapi.js con TypeScript:** Proporciona un entorno robusto, tipado y modular, ideal para construir APIs seguras y mantenibles.
  - **Prisma ORM y PostgreSQL:** Ofrecen una integración sencilla y potente para la persistencia de datos.
  - **ECS Fargate y ALB en AWS:** Permiten desplegar la aplicación en un entorno serverless, reduciendo la sobrecarga operativa y facilitando la escalabilidad automática.
  - **GitHub Actions para CI/CD:** Automatiza las pruebas y despliegue, asegurando que la solución esté lista para producción en todo momento.

- **Infraestructura como Código (IaC) y Automatización:**  
  Aunque en este challenge realicé varias configuraciones manualmente a través del dashboard de AWS, la solución se diseñó siguiendo los principios de IaC. Esto significa que toda la arquitectura –como el Application Load Balancer, los Target Groups, la configuración de ECS, las políticas de S3, entre otros– fue concebida de manera que, en un futuro, se pueda definir, versionar y desplegar mediante herramientas de automatización (por ejemplo, AWS CloudFormation, Terraform o similar).  
  Este enfoque facilita:
  - **Reproducibilidad:** Poder replicar el mismo entorno en diferentes entornos (desarrollo, testing, producción) sin depender de configuraciones manuales.
  - **Versionamiento:** Al almacenar la definición de la infraestructura en código, se pueden rastrear cambios, revertir actualizaciones y colaborar de forma controlada.
  - **Mantenimiento y Escalabilidad:** Las actualizaciones y escalados se aplican mediante cambios en el código, reduciendo el riesgo de errores humanos y permitiendo una evolución consistente del entorno.
  
  Aunque parte de la configuración actual se realizó de forma manual, la arquitectura fue diseñada para que toda la infraestructura pueda ser trasladada a un enfoque de IaC en el futuro, garantizando consistencia y facilidad de mantenimiento a largo plazo.

- **Decisiones Tecnológicas Adicionales:**  
  En esta solución, no implementé Kubernetes ni un API Gateway por las siguientes razones:
  - **Kubernetes:**  
    Aunque es una herramienta poderosa para orquestar contenedores, su complejidad y sobrecarga operativa pueden ser excesivas para el alcance de este challenge. ECS Fargate ofrece una solución serverless que simplifica la gestión y escalabilidad de contenedores sin la necesidad de administrar clústeres complejos.
  
  - **API Gateway:**  
    Si bien un API Gateway aporta funcionalidades adicionales (como autenticación, limitación de tasa, etc.), para este challenge se optó por un Application Load Balancer (ALB) que cumple adecuadamente con la función de enrutar tráfico HTTP/HTTPS a la aplicación. Esto permite mantener la solución enfocada en el desarrollo y despliegue del backend, sin introducir capas adicionales de complejidad.
  
  Estas decisiones se tomaron para centrar el esfuerzo en desarrollar un backend robusto y en levantar una infraestructura de producción sólida y escalable, utilizando herramientas y servicios nativos de AWS que permiten un despliegue ágil y simplificado.

## Cómo Consultar el Challenge

Para ver la descripción completa del challenge y los requerimientos iniciales, por favor consulta el archivo [CHALLENGE.md](./CHALLENGE.md).


## API

Puede encontrar la [Colección de Postman](./edc.postman_collection.json) y comenzar a probar la API productiva en [http://eldoradochallenge.lucasdellasala.com/ping](http://eldoradochallenge.lucasdellasala.com/ping).

---

¡Gracias por revisar mi solución! Estoy a disposición para cualquier consulta o para profundizar en alguno de los aspectos descritos.

Saludos,  
Lucas Della Sala
