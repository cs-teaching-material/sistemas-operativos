# Preguntas Clave para la Sustentación - Entrega 3

Este archivo contiene únicamente las preguntas clave para la sustentación de cada proyecto, extraídas de las retroalimentaciones individuales.

---

## ProyectoSistemasOperativos-master — Simulador de turnos en una fila (Modalidad Base)

1. **Procesos reales:** ¿Cómo modificarían su proyecto para listar los procesos reales que están corriendo en el sistema operativo en este momento? ¿Qué API usarían en Python?

2. **Concurrencia y condición de carrera:** Si eliminaran los `lock_memoria` y `lock_log`, ¿qué cree que pasaría exactamente? ¿Podrían modificarlo para que muestre intencionalmente una condición de carrera y luego la corrija?

3. **Estados de proceso:** En su simulación actual, los procesos pasan directamente a ejecutarse. ¿Cómo implementarían los estados NEW, READY, WAITING y TERMINATED como vimos en clase?

4. **Monitoreo real:** ¿Qué biblioteca de Python permite leer el porcentaje de CPU y memoria real del sistema? ¿Cómo la integrarían en su proyecto?

5. **Decisiones de diseño:** ¿Por qué eligieron el patrón de lanzar todos los hilos simultáneamente en lugar de un worker pool con límite de concurrencia? ¿Qué ventajas/desventajas tiene cada enfoque?

---

## Proyecto_spa-main — Sistema de Gestión de Citas para Spa (Modalidad Alternativa)

1. **Sección crítica:** En su código, ¿qué línea exactamente es la sección crítica? ¿Por qué `foreach` sobre la lista de citas puede causar problemas si no está protegido?

2. **`lock` vs alternativas:** ¿Por qué eligieron `lock(object)` en lugar de `Monitor`, `Mutex`, `Semaphore` o `ReaderWriterLockSlim`? ¿En qué escenario usarían cada uno?

3. **Condición de carrera:** ¿Qué pasaría si dos hilos ejecutan `RegistrarCitaManual` al mismo tiempo SIN el `lock`? ¿Pueden describir la secuencia exacta de eventos que causaría datos corruptos?

4. **Hilos vs procesos:** ¿Por qué usaron `Thread` en lugar de `Process`? ¿Cuál es la diferencia fundamental entre un hilo y un proceso en términos de memoria compartida?

5. **Monitoreo:** Midieron memoria con `GC.GetTotalMemory()`. ¿Qué mide exactamente esa función? ¿Incluye memoria de todos los hilos o solo del hilo principal?

---

## SO-proyecto-equipo-main — Programa de citas hospitalarias (Modalidad Base)

1. **Miguel Angel (probablemente a cargo de programa.js):** Tu archivo JS implementa Round-Robin. Explica en detalle: ¿qué es un quantum? ¿qué diferencia hay entre un algoritmo expropiativo y uno no expropiativo? ¿Cómo decidiste el valor del quantum y qué pasa si es muy grande o muy chico?

2. **Sebastian (probablemente a cargo de entrega2):** Usaste `multiprocessing.Process` en lugar de `threading.Thread`. ¿Por qué? ¿Cuál es la diferencia fundamental entre un proceso y un hilo en términos de aislamiento de memoria? ¿Cómo se comunican los procesos entre sí en tu implementación?

3. **Samuel (probablemente a cargo de parte3):** Tu función `demo_race_condition()` incluye la demostración de condición de carrera. Explica: ¿qué es una condición de carrera y por qué los hilos sin mutex producen resultados incorrectos? En tu código, ¿dónde exactamente está la sección crítica?

4. **Para todos:** El README del proyecto dice textualmente "La simulacion ... Funcional". ¿Por qué documentaron tan poco? ¿Pueden describir la arquitectura completa del proyecto y cómo se relacionan los tres archivos?

5. **Para todos:** En `parte3_citas_medicas.py` usan `psutil` para monitorear CPU y memoria real del sistema. Expliquen qué API del SO usa `psutil` por debajo (pista: en Linux lee archivos en `/proc`).

---

## gestion-procesos-main — Gestor de Procesos y Concurrencia (Modalidad Base)

1. **Procesos reales:** En tu `manager.go`, usas `exec.Command("ps", "aux")`. ¿Qué hace exactamente el sistema operativo cuando ejecutas ese comando desde Go? Describe el `fork-exec` que ocurre por debajo.

2. **Sección crítica y condición de carrera:** En `sincronizacion.go`, tu `ContadorInseguro` tiene un `time.Sleep(time.Microsecond)` entre la lectura y la escritura. ¿Por qué incluiste ese sleep? ¿Qué pasaría si lo sacaras?

3. **Semáforo con channel:** Implementaste el semáforo con `chan struct{}` bufferizado. ¿Por qué `struct{}` y no otro tipo? ¿Cuál es el límite superior práctico de la capacidad del semáforo y por qué?

4. **Monitoreo de CPU:** Tu lectura de `/proc/stat` calcula CPU como porcentaje de idle vs total entre dos muestras. ¿Qué limita la precisión de este método? ¿Cómo afecta el intervalo de muestreo (200ms) a la precisión?

5. **Arquitectura:** Tu proyecto tiene 5 módulos claramente separados. ¿Por qué elegiste esta separación? ¿Qué patrón de diseño usaste y cómo beneficia la mantenibilidad?

---
*Archivo generado para uso en sesiones de sustentación. Contiene únicamente las preguntas clave para cada proyecto.*