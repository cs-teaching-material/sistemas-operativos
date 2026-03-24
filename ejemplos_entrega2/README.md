# Ejemplos Minimos Entrega 2 (Concurrencia + Sincronizacion + Memoria + Archivos)

Estos ejemplos muestran el mismo patron minimo en lenguajes usados en los proyectos:

- Python: `ejemplo_entrega2_python.py`
- Go: `ejemplo_entrega2_go.go`
- C#: `ejemplo_entrega2_csharp.cs`
- JavaScript (Node.js): `ejemplo_entrega2_javascript.js`

## Configuracion actual

Por ahora la configuracion esta hardcodeada dentro de cada archivo:

- RAM total: 512 MB
- Workers: 3

## Que evidencia produce cada ejemplo

- Concurrencia real: multiples workers (threads, goroutines o worker_threads).
- Sincronizacion: exclusion mutua para estado compartido.
- Integracion Unidad 2: RAM simulada y espera/rechazo por memoria.
- Almacenamiento: escritura de `run.log`.

## Ejecucion Python

```bash
python ejemplo_entrega2_python.py
```

## Ejecucion Go

```bash
go run ejemplo_entrega2_go.go
```

## Ejecucion C#

Copiar `ejemplo_entrega2_csharp.cs` dentro de un proyecto de consola y ejecutar:

```bash
dotnet run
```

## Ejecucion JavaScript (Node.js)

```bash
node ejemplo_entrega2_javascript.js
```

## Nota para proyectos personalizados

Si el proyecto es modalidad personalizada, se puede omitir el rubro de simulacion de procesos/planificacion,
pero se deben garantizar los demas rubros obligatorios:

1. Concurrencia real demostrable.
2. Sincronizacion implementada.
3. Integracion con Unidad 2 (memoria/almacenamiento y su impacto en rendimiento).
4. Evidencia por archivos (log de corrida y, cuando corresponda, configuracion).
