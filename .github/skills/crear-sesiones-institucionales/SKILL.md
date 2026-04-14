---
name: crear-sesiones-institucionales
description: 'Genera nuevas sesiones del curso de Sistemas Operativos en formato HTML institucional y su guia docente en Markdown. Usar cuando se pida continuar sesiones, mejorar presentacion con diagramas, graficos o animaciones, explicar terminos por primera vez, incluir practicas en clase con soluciones y formato de entrega esperado, y excluir actividades evaluativas.'
argument-hint: 'Tema o numero de sesion a crear (ejemplo: sesion 15 shell basico)'
user-invocable: true
---

# Skill: Crear Sesiones Institucionales (v2.0)

## Objetivo
Generar cada nueva sesion del curso como un paquete didactico completo:
1. HTML institucional de diapositivas 16:9.
2. Guia del profesor en Markdown con soluciones y formato de entrega esperado.

## Cuando Usar Esta Skill
- Cuando se pide continuar la secuencia de sesiones.
- Cuando se requiere mejorar presentaciones con diagramas, graficos o animaciones.
- Cuando se necesita aumentar el nivel de detalle didactico y definicion de terminos.
- Cuando se desea garantizar cumplimiento institucional y coherencia de estilo.

## Restricciones Pedagogicas Obligatorias
1. No incluir agenda en la sesion.
2. No mencionar duracion de la sesion.
3. Disenar el alcance real para una clase de 4 horas, sin declararlo textualmente.
4. Explicar en profundidad cada concepto nuevo y definir todo termino de primer uso.
5. Incluir recursos visuales con funcion didactica en cada sesion.
6. Si se usa material externo, respetar derechos de autor y registrar atribuciones.
7. No incluir actividades evaluativas.
8. Incluir solo actividades practicas de ejemplo en clase.
9. Toda practica debe tener solucion completa en la guia docente.

## Entregables Por Sesion
1. Archivo HTML en sesiones/sesionNN_0.html.
2. Archivo Markdown en .material/sesionNN_0_guia_profesor.md.

## Flujo Operativo Recomendado
1. Revisar continuidad con sesiones previas y planificacion vigente.
2. Determinar objetivos tecnicos observables de la nueva sesion.
3. Construir la narrativa de contenido por bloques progresivos.
4. Integrar practicas en clase dentro del flujo de explicacion.
5. Crear guia docente con respuestas, errores comunes y retroalimentacion.
6. Verificar licencias y atribuciones de cualquier recurso externo.
7. Ejecutar checklist final de calidad antes de entregar.

## Arquitectura Minima de Slides (4 Horas Sin Declararlo)
Cada sesion debe tener entre 16 y 22 slides sugeridos:
1. Portada institucional.
2. Proposito tecnico de la sesion.
3. Recordatorio de base previa.
4. Bloque conceptual A con definiciones.
5. Visual A (diagrama o flujo).
6. Bloque conceptual B con ejemplo aplicado.
7. Visual B (comparativa o esquema).
8. Practica guiada 1.
9. Solucion guiada 1.
10. Bloque conceptual C.
11. Visual C con animacion o secuencia.
12. Practica guiada 2.
13. Solucion guiada 2.
14. Errores comunes y correcciones.
15. Sintesis tecnica.
16. Puente tecnico a la siguiente sesion.

Notas:
- No usar slides de evaluacion, criterios de nota o puntajes.
- Mantener densidad de contenido equilibrada por slide.

## Reglas de Construccion HTML
1. Conservar estilo institucional en 16:9.
2. Usar portada y contenido con fondos institucionales existentes.
3. Incluir navegacion por teclado y tactil.
4. Incluir minimo 3 apoyos visuales significativos por sesion.
5. Incluir ejemplos tecnicos concretos en cada bloque conceptual.

Para plantilla, layouts y snippets usar:
- [plantilla HTML institucional](./references/plantilla_html_institucional.md)

## Reglas de Construccion de Guia Docente
La guia debe incluir como minimo:
1. Contexto de sesion y pre-requisitos.
2. Resultado de aprendizaje observable.
3. Glosario de terminos de primer uso.
4. Practicas de clase con solucion paso a paso.
5. Errores frecuentes y estrategia de correccion.
6. Formato esperado de entrega de evidencia.
7. Registro de fuentes y atribuciones de recursos externos.

Para estructura completa usar:
- [plantilla guia profesor](./references/plantilla_guia_profesor.md)

## Politica de Recursos Visuales y Derechos
1. Preferir recursos propios (SVG, CSS, Mermaid, Canvas).
2. Si se usa una imagen externa, verificar licencia compatible.
3. Registrar autor, licencia, enlace y fecha de consulta.
4. Nunca usar imagenes sin licencia verificable.

## Checklist Final de Cumplimiento
- No hay agenda.
- No hay duracion explicita.
- No hay actividades evaluativas.
- Hay practicas de ejemplo con solucion en guia docente.
- Todo termino nuevo esta definido en su primera aparicion.
- Hay minimo 3 recursos visuales didacticos.
- Hay trazabilidad de derechos de recursos externos.
- Entregables HTML y MD fueron creados con nomenclatura correcta.
