# Dockerfile para Backend de Café Limón (desde raíz del proyecto)
# Este Dockerfile se ejecuta desde la raíz y apunta a backend/

FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copiar archivos de Maven desde backend/
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/pom.xml .

# Descargar dependencias (cacheadas si pom.xml no cambia)
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente desde backend/
COPY backend/src src

# Compilar la aplicación
RUN ./mvnw clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copiar el JAR compilado
COPY --from=build /app/target/*.jar app.jar

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Ejecutar aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
