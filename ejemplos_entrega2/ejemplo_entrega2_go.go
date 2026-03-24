package main

import (
	"fmt"
	"os"
	"sync"
	"time"
)

// ----------------------------------------------------------------------
// ENTREGA 2 - Rubros cubiertos por este ejemplo (modalidad personalizada)
// ----------------------------------------------------------------------
// 1) Concurrencia real demostrable:
//    - Se lanzan multiples goroutines worker.
// 2) Sincronizacion implementada:
//    - Mutex para proteger RAM compartida y escritura de log.
// 3) Integracion con Unidad 2:
//    - RAM simulada, rechazo y espera por memoria.
//    - Metricas: RAM maxima y eventos de espera por memoria.
// 4) Almacenamiento y relacion con SO:
//    - run.log se abre/escribe con os.OpenFile + WriteString (wrappers de syscalls).
// Nota:
//    - No incluye planificacion U1 para permitir uso en proyectos personalizados.

type Config struct {
	RamTotal int
	Workers  int
}

type Proceso struct {
	ID       string
	BurstSeg int
	Memoria  int
}

var (
	stateMu       sync.Mutex
	logMu         sync.Mutex
	ramUsada      int
	ramMax        int
	esperaMemoria int
)

func logLine(file *os.File, line string) {
	logMu.Lock()
	defer logMu.Unlock()
	// WriteString termina llamando escritura de bajo nivel en el SO.
	_, _ = file.WriteString(line + "\n")
}

func worker(id int, cfg Config, cola <-chan Proceso, logFile *os.File, wg *sync.WaitGroup) {
	defer wg.Done()

	for p := range cola {
		if p.Memoria > cfg.RamTotal {
			logLine(logFile, fmt.Sprintf("T%d,%s,RECHAZADO_MEM", id, p.ID))
			continue
		}

		for {
			acquired := false
			ramSnapshot := 0

			stateMu.Lock()
			// Seccion critica: control de admision a RAM simulada.
			if ramUsada+p.Memoria <= cfg.RamTotal {
				ramUsada += p.Memoria
				if ramUsada > ramMax {
					ramMax = ramUsada
				}
				ramSnapshot = ramUsada
				acquired = true
			} else {
				// Metrica de rendimiento asociada a presion de memoria.
				esperaMemoria++
			}
			stateMu.Unlock()

			if acquired {
				logLine(logFile, fmt.Sprintf("T%d,%s,INICIO,ram=%d", id, p.ID, ramSnapshot))
				break
			}

			// Reintento corto hasta que otro worker libere memoria.
			time.Sleep(50 * time.Millisecond)
		}

		time.Sleep(time.Duration(p.BurstSeg) * time.Second)

		stateMu.Lock()
		ramUsada -= p.Memoria
		ramAfter := ramUsada
		stateMu.Unlock()

		logLine(logFile, fmt.Sprintf("T%d,%s,FIN,ram=%d", id, p.ID, ramAfter))
	}
}

func main() {
	// Config hardcodeada (temporal).
	cfg := Config{
		RamTotal: 512,
		Workers:  3,
	}

	procesos := []Proceso{
		{ID: "P1", BurstSeg: 2, Memoria: 120},
		{ID: "P2", BurstSeg: 1, Memoria: 300},
		{ID: "P3", BurstSeg: 2, Memoria: 200},
		{ID: "P4", BurstSeg: 1, Memoria: 700},
	}

	// os.OpenFile usa banderas del SO: crear, append y solo escritura.
	logFile, err := os.OpenFile("run.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		fmt.Println("Error abriendo run.log:", err)
		return
	}
	defer logFile.Close()

	cola := make(chan Proceso, len(procesos))
	for _, p := range procesos {
		cola <- p
	}
	close(cola)

	var wg sync.WaitGroup
	for i := 1; i <= cfg.Workers; i++ {
		wg.Add(1)
		go worker(i, cfg, cola, logFile, &wg)
	}

	wg.Wait()
	fmt.Printf("RAM max usada=%d MB, eventos espera memoria=%d\n", ramMax, esperaMemoria)
}
