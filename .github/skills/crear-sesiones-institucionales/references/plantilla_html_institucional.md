# Plantilla HTML Institucional para Nueva Sesion

Usar esta plantilla como base para cada nuevo archivo en sesiones/sesionNN_0.html.

## 1) Encabezado y estilo institucional
- Mantener estructura de diapositivas 16:9.
- Mantener portada y contenido con assets institucionales (ejemplo: Portada.png y Contenido.png).
- Mantener tipografia legible y jerarquia clara para lectura en proyector.

Variables institucionales sugeridas:
```css
:root {
  --texto:#201F4B;
  --azul-medio:#015583;
  --turquesa:#05ADBC;
  --muted:#6b7280;
  --white:#ffffff;
}
```

## 2) Secuencia didactica sugerida (sin agenda explicita)
1. Portada con tema tecnico.
2. Activacion de conocimiento previo (1 slide de contraste).
3. Bloque conceptual 1 con definiciones de primer uso.
4. Recurso visual 1 (diagrama de flujo o arquitectura).
5. Bloque conceptual 2 con ejemplo aplicado.
6. Recurso visual 2 (grafico comparativo o tabla tecnica).
7. Practica guiada 1 en clase.
8. Solucion conceptual parcial para guiar discusion.
9. Bloque conceptual 3 avanzado.
10. Recurso visual 3 con animacion util (CSS/SVG).
11. Practica guiada 2 en clase.
12. Cierre tecnico con conexiones a la siguiente sesion.

Para sesiones de mayor densidad, extender hasta 16-22 slides sin incluir agenda ni duracion.

## 3) Reglas de contenido
- Explicar terminos nuevos en la primera aparicion.
- Evitar texto superficial; priorizar precision tecnica.
- Evitar actividades evaluativas (quices, puntos, nota, examen).
- Incluir solo practicas de ejemplo desarrollables en clase.

Reglas de legibilidad por slide:
- Maximo 6 bullets por lista principal.
- Si hay bloque de codigo, mantener lectura en una sola vista o con scroll controlado.
- Cada slide conceptual debe incluir al menos un ejemplo tecnico aplicado.

## 4) Componentes de layout recomendados
- .two-col para teoria + ejemplo.
- .equal-col para comparaciones.
- .card para contenido modular.
- .callout para regla o advertencia clave.
- .code para codigo y comandos.
- .note para contexto secundario.

Snippet base:
```html
<div class="two-col">
  <div class="card">
    <h2>Concepto</h2>
    <p>Definicion y caso aplicado.</p>
  </div>
  <div class="card">
    <div class="code"># ejemplo tecnico</div>
  </div>
</div>
```

## 5) Reglas de recursos visuales
- Cada visual debe cumplir una funcion didactica.
- Preferir diagramas propios (SVG/CSS) para evitar riesgos de licencia.
- Si se usa imagen externa, incluir al final una seccion de atribucion con:
  - autor/fuente,
  - licencia,
  - enlace de origen,
  - fecha de consulta.

## 6) Animaciones sugeridas
- Revelado progresivo de pasos de algoritmo.
- Animacion de estados (por ejemplo, proceso nuevo/listo/ejecucion/bloqueado).
- Transicion de bloques de memoria o jerarquias de almacenamiento.

Snippet CSS util:
```css
@keyframes fadeInStep {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
.step { opacity:0; animation:fadeInStep .35s ease forwards; }
.step:nth-child(1){ animation-delay:.2s; }
.step:nth-child(2){ animation-delay:.6s; }
.step:nth-child(3){ animation-delay:1s; }
```

## 7) Snippet de seccion de terminos (copiable)
```html
<section class="slide content-slide" data-title="Terminos Base">
  <div class="inner">
    <div class="header">Sistemas Operativos</div>
    <h2>Terminos de primera aparicion</h2>
    <div class="gloss">
      <p><strong>Kernel:</strong> Componente central del sistema operativo que coordina CPU, memoria y dispositivos de entrada/salida.</p>
      <p><strong>Espacio de usuario:</strong> Zona de ejecucion donde corren aplicaciones sin privilegios de nucleo.</p>
    </div>
  </div>
</section>
```

## 8) Bloque de practica guiada (no evaluativa)
```html
<section class="slide content-slide" data-title="Practica Guiada 1">
  <div class="inner">
    <div class="header">Practica En Clase</div>
    <div class="content">
      <h2>Resolucion guiada de caso</h2>
      <div class="callout">
        <p><strong>Enunciado:</strong> Resolver el caso paso a paso en equipo, con apoyo del docente.</p>
      </div>
      <ol>
        <li>Identificar entradas, proceso y salida.</li>
        <li>Aplicar el concepto de la sesion al caso.</li>
        <li>Comparar la solucion con el resultado esperado.</li>
      </ol>
      <p class="note">Actividad de practica formativa. No evaluativa.</p>
    </div>
  </div>
</section>
```

## 9) Navegacion JS recomendada
Mantener navegacion por teclado y botones (anterior/siguiente), con soporte touch en dispositivos moviles.
No eliminar contador de slide ni hash de navegacion.

## 10) Validacion final
- No aparece la palabra agenda ni cronograma.
- No aparecen duraciones explicitas.
- Hay minimo 3 apoyos visuales significativos.
- Las practicas son de ejemplo en clase, sin calificacion.
