/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Flag,
  Layers,
  Search,
  Users,
  Server,
  Shield,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  GitBranch,
  Terminal,
  FileText,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  Sliders,
  Filter,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export interface Activity {
  id: string;
  number: number;
  name: string;
  responsible: string;
  category: 'Equipo técnico' | 'TIC' | 'Infraestructura' | 'Seguridad' | 'QA';
  allCategories: string[];
  startDay: number;
  duration: number;
  endDay: number;
  weekStart: number;
  weekEnd: number;
  colorTheme: 'navy' | 'green' | 'teal' | 'gold' | 'red';
  colorHex: string;
  dependencies: string;
  depNumbers: number[];
  tools: string[];
  petiTrace: {
    requirementId: string;
    requirementType: 'RF' | 'RNF';
    page: string;
    requirementTitle: string;
    problem: string;
    verification: string;
  };
  deliverables: string[];
}

const TOTAL_SCALE_DAYS = 49; // 7 semanas x 7 días
const MILESTONE_DAY = 43; // Día 43: Hito de cierre

export const ACTIVITIES_DATA: Activity[] = [
  {
    id: "ACT-01",
    number: 1,
    name: "1. Validar requisitos con TIC",
    responsible: "Equipo del proyecto y coordinador de TIC",
    category: "TIC",
    allCategories: ["TIC", "Equipo técnico"],
    startDay: 0,
    duration: 5,
    endDay: 5,
    weekStart: 1,
    weekEnd: 1,
    colorTheme: "navy",
    colorHex: "#3b82f6", // Paleta original navy/blue
    dependencies: "Ninguna (Arranque del proyecto)",
    depNumbers: [],
    tools: ["PETI UTS 2026", "Matriz de Requisitos", "Acta de Concertación"],
    petiTrace: {
      requirementId: "PETI-Pág.42/08",
      requirementType: "RF",
      page: "Págs. 8 y 42",
      requirementTitle: "Alineación de objetivos y alcance institucional",
      problem: "Déficit crítico de personal de planta e informalidad en el ciclo de vida de desarrollo de software UTS.",
      verification: "Acta de concertación técnica firmada con el coordinador de TIC bajo encargo."
    },
    deliverables: [
      "Documento de especificación de requisitos formalizado",
      "Matriz de trazabilidad inicial PETI-Requisitos",
      "Acta de kickoff con Coordinación de TIC"
    ]
  },
  {
    id: "ACT-02",
    number: 2,
    name: "2. Provisionar entornos (Dev, QA, Prod)",
    responsible: "Equipo de infraestructura UTS",
    category: "Infraestructura",
    allCategories: ["Infraestructura"],
    startDay: 5,
    duration: 10,
    endDay: 15,
    weekStart: 1,
    weekEnd: 3,
    colorTheme: "green",
    colorHex: "#22c55e", // Paleta original green
    dependencies: "1. Validar requisitos con TIC",
    depNumbers: [1],
    tools: ["Servidores UTS", "Virtualización / VMs", "Linux Ubuntu Server", "Redes / VLANs"],
    petiTrace: {
      requirementId: "RF-002",
      requirementType: "RF",
      page: "Pág. 8",
      requirementTitle: "Aislamiento de Ambientes de Despliegue",
      problem: "Ausencia de ambientes separados de desarrollo, pruebas y producción; despliegues manuales e informales.",
      verification: "Tres entornos independientes desplegados con acceso controlado y prueba de ping/aislamiento."
    },
    deliverables: [
      "Servidor de Desarrollo (Dev) operativo",
      "Servidor de Pruebas de Calidad (QA) aislado",
      "Entorno de Producción configurado con backups"
    ]
  },
  {
    id: "ACT-03",
    number: 3,
    name: "3. Instalar y configurar GitLab",
    responsible: "Equipo técnico",
    category: "Equipo técnico",
    allCategories: ["Equipo técnico"],
    startDay: 15,
    duration: 7,
    endDay: 22,
    weekStart: 3,
    weekEnd: 4,
    colorTheme: "teal",
    colorHex: "#14b8a6", // Paleta original teal
    dependencies: "2. Provisionar entornos (Dev, QA, Prod)",
    depNumbers: [2],
    tools: ["GitLab CE", "GitLab Runner", "SSH Keys", "Branch Protection"],
    petiTrace: {
      requirementId: "RF-001",
      requirementType: "RF",
      page: "Pág. 42",
      requirementTitle: "Gestión y Versionado de Código Institucional",
      problem: "Falta de procesos formales en el ciclo de software y pérdida de código ante rotación de contratistas.",
      verification: "Repositorio institucional activo, subida de cambios en rama secundaria y Merge Request con aprobación."
    },
    deliverables: [
      "Instancia GitLab institucional en producción local",
      "Reglas de protección de ramas (main/develop)",
      "GitLab Runners enlazados a entornos de desarrollo"
    ]
  },
  {
    id: "ACT-04",
    number: 4,
    name: "4. Roles, permisos y datos de prueba",
    responsible: "Coordinador de TIC y seguridad",
    category: "Seguridad",
    allCategories: ["Seguridad", "TIC"],
    startDay: 22,
    duration: 4,
    endDay: 26,
    weekStart: 4,
    weekEnd: 4,
    colorTheme: "gold",
    colorHex: "#eab308", // Paleta original gold
    dependencies: "3. Instalar y configurar GitLab",
    depNumbers: [3],
    tools: ["RBAC", "LDAP / Autenticación UTS", "Data Masking Scripts"],
    petiTrace: {
      requirementId: "RNF-001",
      requirementType: "RNF",
      page: "Pág. 60",
      requirementTitle: "Control de Acceso Basado en Roles y Seguridad de Datos",
      problem: "Calificación deficiente en controles de seguridad digital institucional de 40/100 según el PETI.",
      verification: "Pruebas de acceso con diferentes roles comprobando que usuarios no autorizados no accedan a recursos críticos ni datos sensibles."
    },
    deliverables: [
      "Matriz de privilegios por perfil (Dev, QA, DevOps, TIC)",
      "Set de datos de prueba sanitizados y anonimizados",
      "Políticas de autenticación obligatorias aplicadas"
    ]
  },
  {
    id: "ACT-05",
    number: 5,
    name: "5. Pipeline CI/CD con Docker",
    responsible: "Ingeniero DevOps / equipo técnico",
    category: "Equipo técnico",
    allCategories: ["Equipo técnico"],
    startDay: 22,
    duration: 10,
    endDay: 32,
    weekStart: 4,
    weekEnd: 5,
    colorTheme: "green",
    colorHex: "#10b981", // Paleta original green
    dependencies: "3. Instalar y configurar GitLab",
    depNumbers: [3],
    tools: ["Docker Engine", "Docker Compose", ".gitlab-ci.yml", "Container Registry"],
    petiTrace: {
      requirementId: "RF-002",
      requirementType: "RF",
      page: "Pág. 8",
      requirementTitle: "Automatización de Compilación y Despliegues",
      problem: "Despliegues manuales, propensos a errores humanos y sin reproducibilidad entre ambientes.",
      verification: "Ejecución de un pipeline automatizado que compila la imagen Docker y la despliega secuencialmente hacia Dev y QA."
    },
    deliverables: [
      "Dockerfiles estandarizados para aplicaciones institucionales",
      "Pipeline YAML automatizado en GitLab CI/CD",
      "Registro privado de contenedores en operación"
    ]
  },
  {
    id: "ACT-06",
    number: 6,
    name: "6. Integrar SonarQube (SAST)",
    responsible: "Responsable de seguridad",
    category: "Seguridad",
    allCategories: ["Seguridad", "Equipo técnico"],
    startDay: 32,
    duration: 5,
    endDay: 37,
    weekStart: 5,
    weekEnd: 6,
    colorTheme: "navy",
    colorHex: "#6366f1", // Paleta original navy/blue
    dependencies: "5. Pipeline CI/CD con Docker",
    depNumbers: [5],
    tools: ["SonarQube Server", "SonarScanner CLI", "Quality Gates OWASP", "Reglas SAST"],
    petiTrace: {
      requirementId: "RF-004",
      requirementType: "RF",
      page: "Pág. 60",
      requirementTitle: "Análisis Estático de Seguridad de Código Fuente",
      problem: "Baja efectividad en seguridad digital institucional (40/100) y falta de inspección previa a producción.",
      verification: "Escaneo de código con vulnerabilidades conocidas y bloqueo automático del paso a producción en caso de hallazgos críticos."
    },
    deliverables: [
      "SonarQube integrado dentro del pipeline de GitLab",
      "Quality Gate institucional definido con umbrales estrictos",
      "Reportes automáticos de deuda técnica y vulnerabilidades"
    ]
  },
  {
    id: "ACT-07",
    number: 7,
    name: "7. Integrar Selenium (pruebas QA)",
    responsible: "Equipo de calidad (QA)",
    category: "QA",
    allCategories: ["QA", "Equipo técnico"],
    startDay: 32,
    duration: 6,
    endDay: 38,
    weekStart: 5,
    weekEnd: 6,
    colorTheme: "teal",
    colorHex: "#06b6d4", // Paleta original teal
    dependencies: "5. Pipeline CI/CD con Docker",
    depNumbers: [5],
    tools: ["Selenium WebDriver", "Headless Browser", "Suites de Regresión", "JUnit / TestNG"],
    petiTrace: {
      requirementId: "RNF-003",
      requirementType: "RNF",
      page: "Pág. 60",
      requirementTitle: "Pruebas de Calidad y Rendimiento en QA",
      problem: "Falta de validación funcional previa que genera fallos en producción e impacta la adopción de usuarios.",
      verification: "Ejecución automatizada de batería de pruebas de regresión en el runner con reporte de aprobados y fallidos."
    },
    deliverables: [
      "Suite de pruebas Selenium para flujos críticos UTS",
      "Ejecución automatizada post-despliegue en entorno QA",
      "Tablero de resultados y telemetría de fallos funcionales"
    ]
  },
  {
    id: "ACT-08",
    number: 8,
    name: "8. Documentación y capacitación",
    responsible: "Equipo técnico y proveedor de capacitación",
    category: "Equipo técnico",
    allCategories: ["Equipo técnico", "TIC"],
    startDay: 38,
    duration: 5,
    endDay: 43,
    weekStart: 6,
    weekEnd: 7,
    colorTheme: "red",
    colorHex: "#ef4444", // Paleta original red
    dependencies: "6. Integrar SonarQube (SAST) y 7. Integrar Selenium (pruebas QA)",
    depNumbers: [6, 7],
    tools: ["GitLab Wiki", "Guías Markdown", "Talleres Presenciales/Virtuales", "OpenAPI Docs"],
    petiTrace: {
      requirementId: "RF-005",
      requirementType: "RF",
      page: "Pág. 42",
      requirementTitle: "Centralización de Conocimiento Técnico y Capacitación",
      problem: "Pérdida de conocimiento institucional derivada de la alta rotación del personal contratista en las UTS.",
      verification: "Portal de documentación técnica publicado en repositorio y verificación de consulta por parte de usuarios y contratistas."
    },
    deliverables: [
      "Manuales de arquitectura y ciclo de vida DevSecOps",
      "Sesiones grabadas y material de capacitación a contratistas",
      "Acta formal de cierre y entrega a la Coordinación de TIC"
    ]
  }
];

export const AUTHORS = [
  "Jaider Vesga",
  "Miguel Moncada",
  "Cristhian Echavarría",
  "Juan Arias"
];

export default function App() {
  // Estado de vista: 'list' (tabla moderna) o 'gantt' (cronograma visual)
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('gantt');

  // Filtro por responsable
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  // Filtro por búsqueda de texto
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Simulación temporal interactiva (Día 0 a 49)
  const [simulatedDay, setSimulatedDay] = useState<number>(25);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modal de detalle de actividad
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Modal de información del proyecto UTS PETI
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);

  // Tema claro / oscuro (por defecto oscuro como el SaaS original)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Manejador del temporizador para la simulación
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimulatedDay((prev) => {
          if (prev >= TOTAL_SCALE_DAYS) {
            setIsPlaying(false);
            return TOTAL_SCALE_DAYS;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Sincronizar clase dark en el documento
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Categorías únicas para los filtros tipo pills
  const filterOptions = [
    { label: 'Todos', count: ACTIVITIES_DATA.length },
    { label: 'Equipo técnico', count: ACTIVITIES_DATA.filter(a => a.allCategories.includes('Equipo técnico')).length },
    { label: 'TIC', count: ACTIVITIES_DATA.filter(a => a.allCategories.includes('TIC')).length },
    { label: 'Infraestructura', count: ACTIVITIES_DATA.filter(a => a.allCategories.includes('Infraestructura')).length },
    { label: 'Seguridad', count: ACTIVITIES_DATA.filter(a => a.allCategories.includes('Seguridad')).length },
    { label: 'QA', count: ACTIVITIES_DATA.filter(a => a.allCategories.includes('QA')).length }
  ];

  // Actividades filtradas
  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter((activity) => {
      // Filtro de categoría
      const matchesFilter =
        selectedFilter === 'Todos' || activity.allCategories.includes(selectedFilter);

      // Filtro de búsqueda
      const matchesSearch =
        searchTerm.trim() === '' ||
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.tools.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        activity.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchTerm]);

  // Función para determinar el estado de una actividad según el día simulado
  const getActivityStatus = (activity: Activity) => {
    if (simulatedDay >= activity.endDay) {
      return { label: 'Completada', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (simulatedDay > activity.startDay && simulatedDay < activity.endDay) {
      return { label: 'En progreso', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { label: 'Programada', color: 'text-slate-400 bg-slate-800/40 border-slate-700/40' };
  };

  // Cálculo de métricas dinámicas para los KPIs
  const totalActivitiesCount = ACTIVITIES_DATA.length;
  const totalDays = MILESTONE_DAY; // 43 días hasta hito de cierre
  const nextMilestone = "Documentación y capacitación (Día 43)";
  const completedCount = ACTIVITIES_DATA.filter(a => simulatedDay >= a.endDay).length;
  const inProgressCount = ACTIVITIES_DATA.filter(a => simulatedDay > a.startDay && simulatedDay < a.endDay).length;
  const progressPercent = Math.min(100, Math.round((simulatedDay / MILESTONE_DAY) * 100));

  // Exportar datos a JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ACTIVITIES_DATA, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "UTS_Ciclo_Vida_Software_Actividades.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#141922] text-[#e8ecf2]' : 'bg-[#f4f7fb] text-[#1f2a44]'} transition-colors duration-200`}>
      {/* ---------------------------------------------------- */}
      {/* BARRA SUPERIOR (TOP BAR CONTRACT: BRAND — NAV LINKS — ACTION) */}
      {/* ---------------------------------------------------- */}
      <header className={`sticky top-0 z-40 border-b ${isDarkMode ? 'bg-[#141922]/95 border-[#2c3646]' : 'bg-white/95 border-slate-200'} backdrop-blur-md px-4 sm:px-8 py-3.5`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zona 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#13a898] to-[#2a3a5c] flex items-center justify-center text-white shadow-md">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight leading-none">UTS Software Lifecycle</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-medium ${isDarkMode ? 'bg-[#2a3a5c] text-emerald-300' : 'bg-slate-100 text-slate-700'}`}>
                  TSI604 2026-2
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} hidden sm:block mt-0.5`}>
                PETI 2026 · GitLab · SonarQube · Selenium · Docker
              </p>
            </div>
          </div>

          {/* Zona 2: Navegación limpia sin cápsulas pesadas */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <button 
              onClick={() => setShowProjectModal(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Evidencia PETI</span>
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Equipo: {AUTHORS.slice(0, 2).join(', ')} +2</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-emerald-400">Día sim: {simulatedDay}/{MILESTONE_DAY}</span>
          </div>

          {/* Zona 3: Acciones primarias */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowProjectModal(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                isDarkMode 
                  ? 'bg-[#1b2230] border-[#2c3646] hover:bg-[#253043] text-slate-200' 
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
              title="Ver detalle del taller PETI y equipo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Contexto PETI</span>
            </button>

            <button
              onClick={handleExportData}
              className={`p-2 rounded-lg text-xs border transition-all ${
                isDarkMode 
                  ? 'bg-[#1b2230] border-[#2c3646] hover:bg-[#253043] text-slate-300' 
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
              title="Exportar actividades en formato JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'bg-[#1b2230] border-[#2c3646] text-amber-400 hover:bg-[#253043]' 
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* CUERPO PRINCIPAL DEL DASHBOARD */}
      {/* ---------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* ---------------------------------------------------- */}
        {/* 1. PANEL SUPERIOR (KPIS DINÁMICOS SOLICITADOS) */}
        {/* ---------------------------------------------------- */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">Indicadores clave de rendimiento (KPIs)</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Total de Actividades */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-[#1b2230] border-[#2c3646] hover:border-slate-600' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Total de Actividades
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight tabular-nums">
                  {totalActivitiesCount}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  actividades secuenciadas
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium">100% planificadas</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>4 herramientas clave</span>
              </div>
            </div>

            {/* KPI 2: Duración Total */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-[#1b2230] border-[#2c3646] hover:border-slate-600' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Duración Total
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
                  {totalDays}
                </span>
                <span className="text-sm font-semibold">días</span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  (7 semanas)
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Días calendario</span>
                <span className="font-mono text-slate-300">Escala de 49 d</span>
              </div>
            </div>

            {/* KPI 3: Próximo Hito / Hito de Cierre */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-[#1b2230] border-[#2c3646] hover:border-slate-600' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Próximo Hito
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <Flag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold truncate leading-tight" title="Documentación y capacitación">
                  Documentación y capacitación
                </div>
                <div className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1 font-medium">
                  <span>◆ Hito de cierre: Día 43 (S7)</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Entrega final TIC</span>
                <span className="text-amber-400 font-medium">Semana 7</span>
              </div>
            </div>

            {/* KPI 4: Estado de Ejecución y Avance Dinámico */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDarkMode 
                ? 'bg-[#1b2230] border-[#2c3646] hover:border-slate-600' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Progreso Simulado
                </span>
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold font-mono tracking-tight text-teal-400 tabular-nums">
                    {progressPercent}%
                  </span>
                  <span className={`text-xs ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    (Día {simulatedDay})
                  </span>
                </div>
                <div className="text-right text-xs">
                  <span className="font-semibold text-emerald-400">{completedCount} listos</span>
                  <span className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{inProgressCount} en curso</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/30">
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-green-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* BARRA DE CONTROL DE SIMULACIÓN Y DÍA ACTUAL */}
        {/* ---------------------------------------------------- */}
        <section className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#1b2230] border-[#2c3646]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pausar Simulación' : 'Simular Avance'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSimulatedDay(0);
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isDarkMode 
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-400' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Reiniciar a día 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="text-xs">
              <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Línea temporal: </span>
              <span className="font-mono font-bold text-teal-400 tabular-nums">Día {simulatedDay}</span>
              <span className={`text-[11px] ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                (Semana {Math.min(7, Math.floor(simulatedDay / 7) + 1)})
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400">D0</span>
            <input
              type="range"
              min={0}
              max={TOTAL_SCALE_DAYS}
              value={simulatedDay}
              onChange={(e) => setSimulatedDay(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="text-[11px] font-mono text-slate-400">D49</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${
              simulatedDay >= MILESTONE_DAY 
                ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {simulatedDay >= MILESTONE_DAY ? '¡Hito de Cierre Alcanzado!' : `Faltan ${Math.max(0, MILESTONE_DAY - simulatedDay)} días para Hito`}
            </span>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 2. CONTROLES INTERACTIVOS (FILTROS POR RESPONSABLE Y SELECTOR DE VISTAS) */}
        {/* ---------------------------------------------------- */}
        <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Controles de Filtros por Responsable (Pills solicitados) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1.5 mr-1 text-xs font-semibold text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Responsable:</span>
            </div>
            {filterOptions.map((option) => {
              const isActive = selectedFilter === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => setSelectedFilter(option.label)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-xs font-semibold'
                      : isDarkMode
                        ? 'bg-[#1b2230] border-[#2c3646] text-slate-300 hover:border-slate-500 hover:text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    isActive 
                      ? 'bg-teal-500/30 text-teal-200' 
                      : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Búsqueda y Selector de Vistas (Vista Lista vs Vista Gantt) */}
          <div className="flex items-center gap-3">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar actividad o herramienta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                  isDarkMode 
                    ? 'bg-[#1b2230] border-[#2c3646] text-slate-200 placeholder-slate-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Selector de Vistas: Dos botones principales */}
            <div className={`p-1 rounded-lg border flex items-center gap-1 ${
              isDarkMode ? 'bg-[#1b2230] border-[#2c3646]' : 'bg-slate-200 border-slate-300'
            }`}>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Vista 1 (Lista)</span>
              </button>

              <button
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'gantt'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Vista 2 (Gantt)</span>
              </button>
            </div>
          </div>

        </section>

        {/* ---------------------------------------------------- */}
        {/* CONTENIDO CENTRAL SEGÚN SELECTOR DE VISTAS */}
        {/* ---------------------------------------------------- */}
        <section className="transition-all duration-300">
          
          {/* ==================================================== */}
          {/* VISTA 1: TABLA MODERNA (DETALLE CRUZADO EXCEL Y HTML) */}
          {/* ==================================================== */}
          {viewMode === 'list' && (
            <div className={`rounded-xl border overflow-hidden shadow-xs ${
              isDarkMode ? 'bg-[#1b2230] border-[#2c3646]' : 'bg-white border-slate-200'
            }`}>
              <div className="p-4 border-b border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                    <span>Matriz de Actividades y Trazabilidad PETI UTS</span>
                    <span className="text-xs font-normal text-slate-400">({filteredActivities.length} de {ACTIVITIES_DATA.length} registradas)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Detalle cruzado de la lista de actividades del Excel y cronograma HTML: duraciones, dependencias, responsables y requisitos.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Clic en fila para ver ficha técnica extendida</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                      isDarkMode ? 'bg-[#141922] border-[#2c3646] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <th className="py-3 px-4 w-16">ID</th>
                      <th className="py-3 px-4">Actividad</th>
                      <th className="py-3 px-4">Responsable</th>
                      <th className="py-3 px-4 text-center">Duración</th>
                      <th className="py-3 px-4 text-center">Ventana</th>
                      <th className="py-3 px-4">Dependencias</th>
                      <th className="py-3 px-4">Herramientas</th>
                      <th className="py-3 px-4">Req. PETI</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/20">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-400">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
                          <p className="font-medium">No se encontraron actividades con los filtros actuales</p>
                          <button
                            onClick={() => { setSelectedFilter('Todos'); setSearchTerm(''); }}
                            className="mt-2 text-teal-400 hover:underline text-xs"
                          >
                            Restablecer filtros
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredActivities.map((act) => {
                        const status = getActivityStatus(act);
                        return (
                          <tr
                            key={act.id}
                            onClick={() => setSelectedActivity(act)}
                            className={`transition-colors cursor-pointer group ${
                              isDarkMode 
                                ? 'hover:bg-[#222b3d]' 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* ID */}
                            <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                              {act.id}
                            </td>

                            {/* Nombre de la Actividad */}
                            <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-teal-300 transition-colors">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: act.colorHex }}
                                />
                                <span>{act.name}</span>
                              </div>
                            </td>

                            {/* Responsable */}
                            <td className="py-3.5 px-4">
                              <div className="text-slate-300 font-medium">{act.responsible}</div>
                              <span className="text-[10px] text-slate-400">{act.category}</span>
                            </td>

                            {/* Duración */}
                            <td className="py-3.5 px-4 text-center font-mono font-bold tabular-nums">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700/50">
                                {act.duration} d
                              </span>
                            </td>

                            {/* Ventana Temporal */}
                            <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400 tabular-nums">
                              <span>D{act.startDay} - D{act.endDay}</span>
                              <div className="text-[10px] text-slate-500">S{act.weekStart}-S{act.weekEnd}</div>
                            </td>

                            {/* Dependencias */}
                            <td className="py-3.5 px-4 text-slate-300">
                              {act.depNumbers.length === 0 ? (
                                <span className="text-slate-500 italic">Ninguna (Inicio)</span>
                              ) : (
                                <span className="font-mono text-amber-400 text-[11px]">
                                  {act.dependencies}
                                </span>
                              )}
                            </td>

                            {/* Herramientas */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {act.tools.slice(0, 2).map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/40"
                                  >
                                    {tool}
                                  </span>
                                ))}
                                {act.tools.length > 2 && (
                                  <span className="text-[10px] text-slate-500">+{act.tools.length - 2}</span>
                                )}
                              </div>
                            </td>

                            {/* Trazabilidad PETI */}
                            <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                              {act.petiTrace.requirementId}
                            </td>

                            {/* Estado Dinámico */}
                            <td className="py-3.5 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}>
                                {status.label}
                              </span>
                            </td>

                            {/* Acción */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedActivity(act);
                                }}
                                className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                                title="Ver Ficha Técnica"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pie de tabla con nota del hito */}
              <div className="p-4 border-t border-slate-700/30 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-2 text-red-400 font-semibold">
                  <Flag className="w-4 h-4" />
                  <span>◆ Hito de cierre: documentación y capacitación completadas (semana 7, día 43)</span>
                </div>
                <div>
                  <span>Días calendario (7 por semana) · Fuente: Excel de Actividades y PETI UTS</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VISTA 2: RECREACIÓN VISUAL E INTERACTIVA DEL GANTT */}
          {/* ==================================================== */}
          {viewMode === 'gantt' && (
            <div className={`rounded-xl border overflow-hidden shadow-xs ${
              isDarkMode ? 'bg-[#1b2230] border-[#2c3646]' : 'bg-white border-slate-200'
            }`}>
              
              {/* Encabezado del Gantt */}
              <div className="p-4 border-b border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight">Cronograma de Implementación (Gantt Interactivo)</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2a3a5c] text-teal-300">
                      49 Días · 7 Semanas
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recreación fiel del cronograma HTML con escala temporal de 7 semanas (7 días c/u). Inicio y fin derivados de dependencias.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#3b82f6]"></span>
                    <span className="text-slate-400">Navy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#22c55e]"></span>
                    <span className="text-slate-400">Green</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#14b8a6]"></span>
                    <span className="text-slate-400">Teal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#eab308]"></span>
                    <span className="text-slate-400">Gold</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#ef4444]"></span>
                    <span className="text-slate-400">Red (Hito)</span>
                  </div>
                </div>
              </div>

              {/* Área con scroll horizontal para visualización perfecta en cualquier resolución */}
              <div className="overflow-x-auto">
                <div className="min-w-[860px]">
                  
                  {/* Encabezado de Semanas (S1 - S7) */}
                  <div className="grid grid-cols-[280px_1fr] border-b border-slate-700/50">
                    <div className={`p-3 font-semibold text-xs border-r border-slate-700/50 flex items-center justify-between ${
                      isDarkMode ? 'bg-[#141922] text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <span>Actividad / Responsable</span>
                      <span className="text-[10px] text-slate-500 font-mono">UTS CICLO VIDA</span>
                    </div>

                    <div className="grid grid-cols-7 text-center font-bold text-xs bg-[#1f2a44] text-white">
                      <div className="py-2.5 border-r border-slate-700/30">Semana 1</div>
                      <div className="py-2.5 border-r border-slate-700/30">Semana 2</div>
                      <div className="py-2.5 border-r border-slate-700/30">Semana 3</div>
                      <div className="py-2.5 border-r border-slate-700/30">Semana 4</div>
                      <div className="py-2.5 border-r border-slate-700/30">Semana 5</div>
                      <div className="py-2.5 border-r border-slate-700/30">Semana 6</div>
                      <div className="py-2.5">Semana 7</div>
                    </div>
                  </div>

                  {/* Sub-regla de marcas de días (0, 7, 14, 21, 28, 35, 42, 49) */}
                  <div className="grid grid-cols-[280px_1fr] border-b border-slate-800 text-[10px] font-mono text-slate-500 bg-[#12161e]">
                    <div className="py-1 px-3 border-r border-slate-800 flex justify-between">
                      <span>DÍAS CALENDARIO</span>
                      <span>DURACIÓN</span>
                    </div>
                    <div className="grid grid-cols-7 text-center">
                      <div className="border-r border-slate-800/50 py-1">Días 0 - 7</div>
                      <div className="border-r border-slate-800/50 py-1">Días 7 - 14</div>
                      <div className="border-r border-slate-800/50 py-1">Días 14 - 21</div>
                      <div className="border-r border-slate-800/50 py-1">Días 21 - 28</div>
                      <div className="border-r border-slate-800/50 py-1">Días 28 - 35</div>
                      <div className="border-r border-slate-800/50 py-1">Días 35 - 42</div>
                      <div className="py-1 text-red-400 font-bold">Días 42 - 49 ★</div>
                    </div>
                  </div>

                  {/* Filas de Actividades con barras proporcionales */}
                  <div className="relative divide-y divide-slate-800/60">
                    
                    {/* Línea vertical del Día Simulado / Día Actual */}
                    <div
                      className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-300"
                      style={{
                        left: `calc(280px + (100% - 280px) * ${simulatedDay / TOTAL_SCALE_DAYS})`
                      }}
                    >
                      <div className="h-full w-0.5 bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                        <div className="absolute -top-2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 whitespace-nowrap shadow-md">
                          Día {simulatedDay}
                        </div>
                      </div>
                    </div>

                    {/* Línea vertical fija del Hito de Cierre (Día 43) */}
                    <div
                      className="absolute top-0 bottom-0 z-10 pointer-events-none"
                      style={{
                        left: `calc(280px + (100% - 280px) * ${MILESTONE_DAY / TOTAL_SCALE_DAYS})`
                      }}
                    >
                      <div className="h-full w-0.5 border-r border-dashed border-red-500/70">
                        <div className="absolute -bottom-2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-600 text-white whitespace-nowrap shadow-md">
                          ◆ Fin (D43)
                        </div>
                      </div>
                    </div>

                    {filteredActivities.map((act, index) => {
                      const leftPercent = (act.startDay / TOTAL_SCALE_DAYS) * 100;
                      const widthPercent = (act.duration / TOTAL_SCALE_DAYS) * 100;
                      const isCompleted = simulatedDay >= act.endDay;
                      const isCurrent = simulatedDay > act.startDay && simulatedDay < act.endDay;

                      return (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActivity(act)}
                          className={`grid grid-cols-[280px_1fr] min-h-[52px] group transition-colors cursor-pointer ${
                            index % 2 === 0
                              ? isDarkMode ? 'bg-[#1b2230]' : 'bg-white'
                              : isDarkMode ? 'bg-[#171d29]' : 'bg-slate-50/70'
                          } hover:bg-[#20293a]`}
                        >
                          {/* Columna Izquierda: Información de Actividad */}
                          <div className="p-2.5 px-3 border-r border-slate-700/50 flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: act.colorHex }}
                              />
                              <span className="font-semibold text-xs truncate group-hover:text-teal-300 transition-colors" title={act.name}>
                                {act.name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 pl-4">
                              <span className="truncate max-w-[180px]" title={act.responsible}>
                                {act.responsible}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500 font-semibold shrink-0">
                                {act.duration}d
                              </span>
                            </div>
                          </div>

                          {/* Columna Derecha: Pista del Gantt con Barra */}
                          <div
                            className="relative flex items-center px-0 overflow-hidden"
                            style={{
                              backgroundImage: isDarkMode
                                ? 'repeating-linear-gradient(90deg, transparent 0 calc(14.2857% - 1px), rgba(44,54,70,0.4) calc(14.2857% - 1px) 14.2857%)'
                                : 'repeating-linear-gradient(90deg, transparent 0 calc(14.2857% - 1px), rgba(226,232,240,0.8) calc(14.2857% - 1px) 14.2857%)'
                            }}
                          >
                            {/* Barra horizontal de la tarea */}
                            <div
                              className="absolute h-8 rounded-md flex items-center justify-between px-2.5 text-white font-semibold text-xs shadow-md transition-all duration-300 hover:brightness-110 group-hover:shadow-lg"
                              style={{
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`,
                                backgroundColor: act.colorHex
                              }}
                              title={`${act.name}: Días ${act.startDay} a ${act.endDay} (${act.duration} días)`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {isCompleted && (
                                  <CheckCircle className="w-3.5 h-3.5 text-white/90 shrink-0" />
                                )}
                                {isCurrent && (
                                  <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                                )}
                                <span className="font-mono text-[11px] truncate">{act.duration} d</span>
                              </div>
                              <span className="text-[10px] opacity-90 hidden sm:inline font-mono">
                                D{act.startDay}-D{act.endDay}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Pie del Gantt con nota y leyenda de hito */}
              <div className="p-4 border-t border-slate-700/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <span className="text-base">◆</span>
                  <span>Hito de cierre: documentación y capacitación completadas (semana 7, día 43)</span>
                </div>
                <div className="text-slate-400">
                  Días calendario (7 por semana). Dependencias secuenciales modeladas con rigor de ruta crítica.
                </div>
              </div>

            </div>
          )}

        </section>

        {/* ---------------------------------------------------- */}
        {/* PANEL INFERIOR: RESUMEN DE STACK Y DEPENDENCIAS */}
        {/* ---------------------------------------------------- */}
        <section className={`p-5 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-4 ${
          isDarkMode ? 'bg-[#1b2230] border-[#2c3646]' : 'bg-white border-slate-200'
        }`}>
          {/* Herramienta 1: GitLab */}
          <div className="p-3 rounded-lg border border-teal-500/20 bg-teal-500/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-teal-400">GitLab CE / EE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">Act 3 y 4</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Control de versiones institucional, repositorios protegidos y gestión de permisos RBAC para frenar pérdida de código.
            </p>
          </div>

          {/* Herramienta 2: Docker */}
          <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-emerald-400">Docker & CI/CD</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Act 2 y 5</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ambientes inmutables separados (Dev, QA, Prod) y pipeline automático que elimina despliegues manuales informales.
            </p>
          </div>

          {/* Herramienta 3: SonarQube */}
          <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-blue-400">SonarQube (SAST)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Act 6</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inspección estática de seguridad OWASP para elevar los controles de seguridad digital institucional de 40/100.
            </p>
          </div>

          {/* Herramienta 4: Selenium */}
          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-amber-400">Selenium QA</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Act 7</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pruebas de regresión automatizadas de interfaz y flujos críticos institucionales antes de aprobación a producción.
            </p>
          </div>
        </section>

      </main>

      {/* ---------------------------------------------------- */}
      {/* MODAL: DETALLE EXTENDIDO DE ACTIVIDAD (FICHA TÉCNICA) */}
      {/* ---------------------------------------------------- */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            isDarkMode ? 'bg-[#1b2230] border-[#2c3646] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            {/* Header del Modal con Color de la Tarea */}
            <div className="p-5 border-b border-slate-700/50 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold font-mono text-sm shadow-md"
                  style={{ backgroundColor: selectedActivity.colorHex }}
                >
                  {selectedActivity.id}
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {selectedActivity.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>Responsable: <strong className="text-slate-200">{selectedActivity.responsible}</strong></span>
                    <span>·</span>
                    <span className="font-mono text-teal-400">S{selectedActivity.weekStart}-S{selectedActivity.weekEnd}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Bloque 1: Métricas de tiempo y dependencias */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg border text-center ${isDarkMode ? 'bg-[#141922] border-[#2c3646]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duración</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    {selectedActivity.duration} días
                  </span>
                </div>
                <div className={`p-3 rounded-lg border text-center ${isDarkMode ? 'bg-[#141922] border-[#2c3646]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Día Inicio / Fin</span>
                  <span className="text-xl font-bold font-mono text-teal-400 tabular-nums">
                    D{selectedActivity.startDay} → D{selectedActivity.endDay}
                  </span>
                </div>
                <div className={`p-3 rounded-lg border text-center ${isDarkMode ? 'bg-[#141922] border-[#2c3646]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estado Simulado</span>
                  <span className="text-xs font-bold block mt-1 text-amber-400">
                    {getActivityStatus(selectedActivity).label}
                  </span>
                </div>
              </div>

              {/* Dependencias directas */}
              <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'bg-[#141922] border-[#2c3646]' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  Dependencias de Secuencia:
                </span>
                <p className="text-xs font-medium text-slate-200">
                  {selectedActivity.dependencies}
                </p>
              </div>

              {/* Bloque 2: Trazabilidad PETI UTS (Requisito funcional / no funcional) */}
              <div className={`p-4 rounded-xl border border-teal-500/30 ${isDarkMode ? 'bg-teal-500/5' : 'bg-teal-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Trazabilidad PETI UTS ({selectedActivity.petiTrace.requirementType})
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                    {selectedActivity.petiTrace.requirementId} · {selectedActivity.petiTrace.page}
                  </span>
                </div>
                
                <h4 className="text-sm font-semibold text-slate-100 mb-2">
                  {selectedActivity.petiTrace.requirementTitle}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-400">Problema identificado en PETI: </span>
                    <span className="text-slate-300">{selectedActivity.petiTrace.problem}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-400">¿Cómo se verifica?: </span>
                    <span className="text-slate-300">{selectedActivity.petiTrace.verification}</span>
                  </div>
                </div>
              </div>

              {/* Bloque 3: Herramientas tecnológicas */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Herramientas y Tecnologías Involucradas
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-teal-300 border border-slate-700"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bloque 4: Entregables esperados */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Entregables Clave de la Actividad
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedActivity.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer del Modal */}
            <div className="p-4 border-t border-slate-700/50 flex items-center justify-end">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-teal-600 hover:bg-teal-500 text-white transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: CONTEXTO DEL PROYECTO PETI UTS & AUTORES */}
      {/* ---------------------------------------------------- */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            isDarkMode ? 'bg-[#1b2230] border-[#2c3646] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Proyecto TSI604 · Ciclo de Vida del Software UTS</h3>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-sm text-slate-100 mb-1">
                  Propósito y Evidencia del PETI 2026 (Taller 3)
                </h4>
                <p className="leading-relaxed">
                  Adquisición, configuración e implementación de un conjunto de herramientas tecnológicas integradas 
                  (<strong>GitLab, SonarQube, Selenium y Docker</strong>) que automaticen por completo el ciclo de vida 
                  de las aplicaciones y desarrollos de las <strong>Unidades Tecnológicas de Santander (UTS)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-slate-700/50 bg-slate-900/40">
                  <span className="font-bold text-amber-400 block mb-1">Personal de Planta (Pág. 42)</span>
                  <p className="text-[11px] text-slate-400">
                    Déficit crítico de personal: solo el coordinador está bajo encargo y los demás son contratistas.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-700/50 bg-slate-900/40">
                  <span className="font-bold text-red-400 block mb-1">Seguridad Digital (Pág. 60)</span>
                  <p className="text-[11px] text-slate-400">
                    Baja calificación institucional de 40/100 en controles de seguridad digital.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-700/50 bg-slate-900/40">
                  <span className="font-bold text-emerald-400 block mb-1">Ambientes de Despliegue (Pág. 8)</span>
                  <p className="text-[11px] text-slate-400">
                    Despliegues manuales e informales sin aislamiento entre Dev, QA y Producción.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="font-bold text-slate-100 mb-2">Equipo del Proyecto (Estudiantes UTS)</h4>
                <div className="flex flex-wrap gap-2">
                  {AUTHORS.map((author, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-teal-300 border border-slate-700"
                    >
                      {author}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40">
                <p className="text-[11px] text-slate-400 italic">
                  Fuente: Cronograma de implementación (HTML) y Taller 3: Del PETI a los Requisitos Funcionales y No Funcionales (UTS TSI604 Semestre 2026-2).
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* FOOTER DISCRETO Y PROFESIONAL */}
      {/* ---------------------------------------------------- */}
      <footer className={`border-t py-6 px-4 sm:px-8 text-xs ${
        isDarkMode ? 'border-[#2c3646] bg-[#141922] text-slate-400' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-200">Unidades Tecnológicas de Santander (UTS)</span>
            <span className="mx-2">·</span>
            <span>Selección y Evaluación de Tecnologías (TSI604)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>8 Actividades</span>
            <span>·</span>
            <span>43 Días a Hito Final</span>
            <span>·</span>
            <span className="text-teal-400">DevSecOps & QA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
