const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// ----------------------------------------------------------------------
// ENTREGA 2 - Rubros cubiertos por este ejemplo (modalidad personalizada)
// ----------------------------------------------------------------------
// 1) Concurrencia real demostrable:
//    - Se crean varios worker_threads que ejecutan en paralelo.
// 2) Sincronizacion implementada:
//    - Mutex sobre memoria compartida con Atomics (lock/unlock).
// 3) Integracion con Unidad 2:
//    - RAM simulada con admision, espera y rechazo por memoria.
//    - Metricas: RAM maxima usada y eventos de espera.
// 4) Almacenamiento y relacion con SO:
//    - run.log se escribe con fs.openSync/fs.writeSync/fs.closeSync.
// Nota:
//    - No incluye planificacion U1 para uso en proyectos personalizados.

// Config hardcodeada (temporal).
const CFG = {
  RAM_TOTAL: 512,
  WORKERS: 3,
};

const PROCESOS = [
  { pid: 'P1', burst: 2, mem: 120 },
  { pid: 'P2', burst: 1, mem: 300 },
  { pid: 'P3', burst: 2, mem: 200 },
  { pid: 'P4', burst: 1, mem: 700 },
];

// Indices de memoria compartida (Int32Array)
const IDX_LOCK = 0;
const IDX_RAM_USED = 1;
const IDX_RAM_MAX = 2;
const IDX_WAIT_EVENTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function acquireLock(state) {
  // Spin lock simple: intenta pasar de 0 -> 1
  while (Atomics.compareExchange(state, IDX_LOCK, 0, 1) !== 0) {
    await sleep(1);
  }
}

function releaseLock(state) {
  Atomics.store(state, IDX_LOCK, 0);
}

function repartirProcesos(procesos, workers) {
  const buckets = Array.from({ length: workers }, () => []);
  procesos.forEach((p, idx) => {
    buckets[idx % workers].push(p);
  });
  return buckets;
}

async function runMain() {
  // SharedArrayBuffer permite que todos los workers compartan el mismo estado.
  const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 4);
  const state = new Int32Array(shared);

  // fs.openSync es wrapper de syscall de apertura de archivo en el SO.
  const logFd = fs.openSync('run.log', 'a');
  const buckets = repartirProcesos(PROCESOS, CFG.WORKERS);

  let doneWorkers = 0;

  await new Promise((resolve, reject) => {
    for (let i = 0; i < CFG.WORKERS; i++) {
      const w = new Worker(__filename, {
        workerData: {
          id: i + 1,
          cfg: CFG,
          bucket: buckets[i],
          shared,
        },
      });

      w.on('message', (msg) => {
        if (msg.type === 'log') {
          // fs.writeSync es wrapper de syscall de escritura en archivo.
          fs.writeSync(logFd, msg.line + '\n');
          return;
        }

        if (msg.type === 'done') {
          doneWorkers += 1;
          if (doneWorkers === CFG.WORKERS) {
            resolve();
          }
        }
      });

      w.on('error', reject);
      w.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker finalizo con codigo ${code}`));
        }
      });
    }
  });

  // fs.closeSync libera el descriptor en el SO.
  fs.closeSync(logFd);

  const ramMax = Atomics.load(state, IDX_RAM_MAX);
  const waitEvents = Atomics.load(state, IDX_WAIT_EVENTS);
  console.log(`RAM max usada=${ramMax} MB, eventos espera memoria=${waitEvents}`);
}

async function runWorker() {
  const { id, cfg, bucket, shared } = workerData;
  const state = new Int32Array(shared);

  for (const p of bucket) {
    if (p.mem > cfg.RAM_TOTAL) {
      parentPort.postMessage({ type: 'log', line: `T${id},${p.pid},RECHAZADO_MEM` });
      continue;
    }

    let ramSnapshot = 0;

    while (true) {
      await acquireLock(state);

      // Seccion critica: control de admision a RAM simulada.
      const ramUsed = Atomics.load(state, IDX_RAM_USED);
      if (ramUsed + p.mem <= cfg.RAM_TOTAL) {
        const next = ramUsed + p.mem;
        Atomics.store(state, IDX_RAM_USED, next);

        const currentMax = Atomics.load(state, IDX_RAM_MAX);
        if (next > currentMax) {
          Atomics.store(state, IDX_RAM_MAX, next);
        }

        ramSnapshot = next;
        releaseLock(state);
        break;
      }

      // Metrica de rendimiento ligada a presion de memoria.
      Atomics.add(state, IDX_WAIT_EVENTS, 1);
      releaseLock(state);

      // Reintento corto hasta que otro worker libere RAM.
      await sleep(50);
    }

    parentPort.postMessage({ type: 'log', line: `T${id},${p.pid},INICIO,ram=${ramSnapshot}` });
    await sleep(p.burst * 1000);

    await acquireLock(state);
    const oldValue = Atomics.sub(state, IDX_RAM_USED, p.mem);
    const ramAfter = oldValue - p.mem;
    releaseLock(state);

    parentPort.postMessage({ type: 'log', line: `T${id},${p.pid},FIN,ram=${ramAfter}` });
  }

  parentPort.postMessage({ type: 'done' });
}

if (isMainThread) {
  runMain().catch((err) => {
    console.error('Error en ejemplo JS:', err.message);
    process.exit(1);
  });
} else {
  runWorker().catch((err) => {
    parentPort.postMessage({ type: 'log', line: `T${workerData.id},ERROR,${err.message}` });
    process.exit(1);
  });
}
