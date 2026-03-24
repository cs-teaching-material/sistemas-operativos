import os
import queue
import threading
import time

# ----------------------------------------------------------------------
# ENTREGA 2 - Rubros cubiertos por este ejemplo (modalidad personalizada)
# ----------------------------------------------------------------------
# 1) Concurrencia real demostrable:
#    - Se crean varios hilos worker que ejecutan en paralelo.
# 2) Sincronizacion implementada:
#    - Un lock protege estado compartido (RAM y log) para evitar carreras.
# 3) Integracion con Unidad 2:
#    - Se simula RAM total, admision/rechazo y espera por memoria.
#    - Se reportan metricas: RAM maxima y eventos de espera.
# 4) Almacenamiento y relacion con SO:
#    - Se escribe run.log usando os.open/os.write/os.close (wrappers de syscalls).
# Nota:
#    - Este ejemplo no incluye planificacion U1 porque esta pensado para
#      proyectos personalizados donde ese rubro se puede omitir.

# Config hardcodeada (temporal)
RAM_TOTAL = 512
WORKERS = 3

procesos = [
    {"pid": "P1", "burst": 2, "mem": 120},
    {"pid": "P2", "burst": 1, "mem": 300},
    {"pid": "P3", "burst": 2, "mem": 200},
    {"pid": "P4", "burst": 1, "mem": 700},
]

cola = queue.Queue()
for p in procesos:
    cola.put(p)

lock = threading.Lock()
ram_usada = 0
ram_max = 0
espera_mem = 0

# os.open crea/abre un descriptor de archivo del SO.
fd = os.open("run.log", os.O_CREAT | os.O_APPEND | os.O_WRONLY, 0o644)


def log(line: str) -> None:
    # os.write escribe sobre el descriptor de archivo del SO.
    os.write(fd, (line + "\n").encode("utf-8"))


def worker(worker_id: str) -> None:
    global ram_usada, ram_max, espera_mem

    while True:
        try:
            # Cola compartida y segura para hilos.
            p = cola.get_nowait()
        except queue.Empty:
            return

        if p["mem"] > RAM_TOTAL:
            with lock:
                log(f"{worker_id},{p['pid']},RECHAZADO_MEM")
            cola.task_done()
            continue

        while True:
            adquirido = False
            ram_snapshot = 0

            with lock:
                # Seccion critica: control de admision por RAM.
                if ram_usada + p["mem"] <= RAM_TOTAL:
                    ram_usada += p["mem"]
                    ram_max = max(ram_max, ram_usada)
                    ram_snapshot = ram_usada
                    adquirido = True
                else:
                    # Metrica de rendimiento ligada a memoria.
                    espera_mem += 1

            if adquirido:
                with lock:
                    log(f"{worker_id},{p['pid']},INICIO,ram={ram_snapshot}")
                break

            # Espera activa corta para reintentar cuando haya RAM disponible.
            time.sleep(0.05)

        time.sleep(p["burst"])

        with lock:
            ram_usada -= p["mem"]
            log(f"{worker_id},{p['pid']},FIN,ram={ram_usada}")

        cola.task_done()


hilos = [threading.Thread(target=worker, args=(f"T{i+1}",)) for i in range(WORKERS)]
for t in hilos:
    t.start()
for t in hilos:
    t.join()

# Cierre explicito del descriptor (libera recurso del SO).
os.close(fd)
print(f"RAM max usada={ram_max} MB, eventos espera memoria={espera_mem}")
