"use client";

import { useState, useEffect, useCallback } from "react";
import { getMisDatos } from "@/src/actions/auth";
import {
  listarHonorarios,
  listarMisHonorarios,
  type ResumenCuidador,
  type Servicio,
} from "@/src/actions/honorarios";
import {
  DollarSign,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";

export default function HonorariosPage() {
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin state
  const [resumenCuidadores, setResumenCuidadores] = useState<ResumenCuidador[]>([]);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [expandedCuidador, setExpandedCuidador] = useState<number | null>(null);

  // Cuidador state
  const [misServicios, setMisServicios] = useState<Servicio[]>([]);
  const [misTotales, setMisTotales] = useState({ horas: 0, base: 0, pagado: 0 });

  // Filtros compartidos
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const [desde, setDesde] = useState(inicioMes.toISOString().split("T")[0]);
  const [hasta, setHasta] = useState(hoy.toISOString().split("T")[0]);
  const [filtroCuidador, setFiltroCuidador] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const cargarDatos = useCallback(async (role: number) => {
    setLoading(true);
    if (role === 1) {
      // Admin
      const params: { desde?: string; hasta?: string; id_cuidador?: number } = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      if (filtroCuidador) params.id_cuidador = parseInt(filtroCuidador);

      const result = await listarHonorarios(params);
      if (result.success) {
        setResumenCuidadores(result.data);
        setTotalGeneral(result.totalGeneral);
      }
    } else if (role === 2) {
      // Cuidador
      const params: { desde?: string; hasta?: string } = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;

      const result = await listarMisHonorarios(params);
      if (result.success) {
        setMisServicios(result.data.servicios);
        setMisTotales({
          horas: result.data.total_horas,
          base: result.data.total_base,
          pagado: result.data.total_pagado,
        });
      }
    }
    setLoading(false);
  }, [desde, hasta, filtroCuidador]);

  useEffect(() => {
    const init = async () => {
      const datos = await getMisDatos();
      if (datos) {
        setUserRole(datos.role);
        cargarDatos(datos.role);
      }
    };
    init();
  }, [cargarDatos]);

  const aplicarFiltros = () => {
    if (userRole) cargarDatos(userRole);
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit", month: "2-digit", year: "numeric",
      });
    } catch { return fecha; }
  };

  const inputStyle =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
  const labelStyle = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  if (loading && userRole === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={24} className="text-emerald-500" />
            {userRole === 1 ? "Honorarios" : "Mis Honorarios"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === 1
              ? "Resumen de honorarios por acompañante"
              : "Detalle de tus servicios realizados"}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <Filter size={16} />
          Filtros
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>Desde</label>
              <input
                type="date"
                className={inputStyle}
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Hasta</label>
              <input
                type="date"
                className={inputStyle}
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
            {userRole === 1 && (
              <div>
                <label className={labelStyle}>Acompañante (ID)</label>
                <input
                  type="number"
                  className={inputStyle}
                  placeholder="Todos"
                  value={filtroCuidador}
                  onChange={(e) => setFiltroCuidador(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={aplicarFiltros}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all cursor-pointer"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* Tarjetas resumen */}
      {userRole === 1 ? (
        // === VISTA ADMIN ===
        <>
          {/* Total general */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-80">Total general del período</p>
            <p className="text-3xl font-bold mt-1">{formatMoney(totalGeneral)}</p>
            <p className="text-xs opacity-70 mt-2">
              {resumenCuidadores.length} acompañante(s) con servicios finalizados
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : resumenCuidadores.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Briefcase size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">No hay servicios finalizados en este período</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumenCuidadores.map((c) => (
                <div
                  key={c.id_cuidador}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Cuidador header */}
                  <button
                    onClick={() => setExpandedCuidador(
                      expandedCuidador === c.id_cuidador ? null : c.id_cuidador
                    )}
                    className="w-full p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {c.cuidador_nombre?.[0]}{c.cuidador_apellido?.[0]}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">
                          {c.cuidador_nombre} {c.cuidador_apellido}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {c.servicios.length} servicio(s) · {c.total_horas.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-emerald-600">
                        {formatMoney(c.total_base)}
                      </span>
                      {expandedCuidador === c.id_cuidador ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Detalle servicios */}
                  {expandedCuidador === c.id_cuidador && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <ServiceTable servicios={c.servicios} formatMoney={formatMoney} formatFecha={formatFecha} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // === VISTA CUIDADOR ===
        <>
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Horas trabajadas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{misTotales.horas.toFixed(1)}h</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <DollarSign size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Total acumulado</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatMoney(misTotales.base)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Servicios</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{misServicios.length}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : misServicios.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Briefcase size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">No tenés servicios finalizados en este período</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <ServiceTable servicios={misServicios} formatMoney={formatMoney} formatFecha={formatFecha} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Tabla de detalle de servicios reutilizable
function ServiceTable({
  servicios,
  formatMoney,
  formatFecha,
}: {
  servicios: Servicio[];
  formatMoney: (n: number) => string;
  formatFecha: (s: string) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Horas</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">$/hora</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s, i) => (
            <tr key={s.guardia_id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              <td className="px-5 py-3 text-gray-700">{formatFecha(s.fecha)}</td>
              <td className="px-5 py-3 text-gray-700">{s.paciente}</td>
              <td className="px-5 py-3 text-gray-600">{s.tipo_servicio}</td>
              <td className="px-5 py-3 text-right text-gray-700">{s.horas.toFixed(1)}</td>
              <td className="px-5 py-3 text-right text-gray-500">{formatMoney(s.valor_hora)}</td>
              <td className="px-5 py-3 text-right font-semibold text-emerald-600">{formatMoney(s.importe_base)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50">
            <td colSpan={3} className="px-5 py-3 font-semibold text-gray-700">Total</td>
            <td className="px-5 py-3 text-right font-semibold text-gray-700">
              {servicios.reduce((a, s) => a + s.horas, 0).toFixed(1)}
            </td>
            <td className="px-5 py-3" />
            <td className="px-5 py-3 text-right font-bold text-emerald-600">
              {formatMoney(servicios.reduce((a, s) => a + s.importe_base, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
