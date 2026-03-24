using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace EjemploEntrega2
{
    // ------------------------------------------------------------------
    // ENTREGA 2 - Rubros cubiertos por este ejemplo (personalizado)
    // ------------------------------------------------------------------
    // 1) Concurrencia real demostrable:
    //    - Varios Thread ejecutan workers en paralelo.
    // 2) Sincronizacion implementada:
    //    - lock sobre cola, estado de RAM y log.
    // 3) Integracion con Unidad 2:
    //    - RAM simulada con admision/rechazo y espera por memoria.
    //    - Metricas: RAM maxima y eventos de espera.
    // 4) Almacenamiento y relacion con SO:
    //    - run.log por FileStream/StreamWriter (wrappers de syscalls).
    // Nota:
    //    - No incluye planificacion U1 para uso en proyectos personalizados.

    class Config
    {
        public int RamTotal;
        public int Workers;
    }

    class Proceso
    {
        public string Id;
        public int BurstSegundos;
        public int Memoria;

        public Proceso(string id, int burstSegundos, int memoria)
        {
            Id = id;
            BurstSegundos = burstSegundos;
            Memoria = memoria;
        }
    }

    class Program
    {
        static readonly object QueueLock = new object();
        static readonly object StateLock = new object();
        static readonly object LogLock = new object();

        static readonly Queue<Proceso> Cola = new Queue<Proceso>();

        static int _ramUsada;
        static int _ramMax;
        static int _esperaMemoria;
        static Config _cfg;
        static StreamWriter _logWriter;

        static void Main(string[] args)
        {
            // Config hardcodeada (temporal).
            _cfg = new Config
            {
                RamTotal = 512,
                Workers = 3
            };

            var procesos = new List<Proceso>
            {
                new Proceso("P1", 2, 120),
                new Proceso("P2", 1, 300),
                new Proceso("P3", 2, 200),
                new Proceso("P4", 1, 700)
            };

            foreach (var p in procesos)
            {
                Cola.Enqueue(p);
            }

            // FileStream interactua con el sistema de archivos del SO.
            _logWriter = new StreamWriter(new FileStream("run.log", FileMode.Append, FileAccess.Write, FileShare.Read));

            var threads = new List<Thread>();
            for (int i = 1; i <= _cfg.Workers; i++)
            {
                var t = new Thread(Worker);
                threads.Add(t);
                t.Start(i);
            }

            foreach (var t in threads)
            {
                t.Join();
            }

            _logWriter.Close();

            Console.WriteLine("RAM max usada=" + _ramMax + " MB, eventos espera memoria=" + _esperaMemoria);
        }

        static void Worker(object workerIdObj)
        {
            int workerId = (int)workerIdObj;

            while (true)
            {
                Proceso p;
                lock (QueueLock)
                {
                    if (Cola.Count == 0) return;
                    p = Cola.Dequeue();
                }

                if (p.Memoria > _cfg.RamTotal)
                {
                    Log("T" + workerId + "," + p.Id + ",RECHAZADO_MEM");
                    continue;
                }

                while (true)
                {
                    bool adquirido = false;
                    int ramSnapshot = 0;

                    lock (StateLock)
                    {
                        // Seccion critica: control de admision por RAM simulada.
                        if (_ramUsada + p.Memoria <= _cfg.RamTotal)
                        {
                            _ramUsada += p.Memoria;
                            if (_ramUsada > _ramMax) _ramMax = _ramUsada;
                            ramSnapshot = _ramUsada;
                            adquirido = true;
                        }
                        else
                        {
                            // Metrica de rendimiento ligada a memoria.
                            _esperaMemoria++;
                        }
                    }

                    if (adquirido)
                    {
                        Log("T" + workerId + "," + p.Id + ",INICIO,ram=" + ramSnapshot);
                        break;
                    }

                    // Reintento corto hasta que otro worker libere RAM.
                    Thread.Sleep(50);
                }

                Thread.Sleep(p.BurstSegundos * 1000);

                int ramAfter;
                lock (StateLock)
                {
                    _ramUsada -= p.Memoria;
                    ramAfter = _ramUsada;
                }

                Log("T" + workerId + "," + p.Id + ",FIN,ram=" + ramAfter);
            }
        }

        static void Log(string line)
        {
            lock (LogLock)
            {
                // Flush garantiza persistencia inmediata del evento en disco.
                _logWriter.WriteLine(line);
                _logWriter.Flush();
            }
        }
    }
}
