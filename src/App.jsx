import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronUp, Store, TrendingUp, DollarSign, Users, Shield, Building } from 'lucide-react';

const Dashboard = () => {
  const [showNorteDetails, setShowNorteDetails] = useState(false);
  const [showSurDetails, setShowSurDetails] = useState(false);

  // --- NUEVA ESTRUCTURA DE DATOS CENTRALIZADA ---
  // Aquí hemos combinado toda la información de tus 5 tablas.
  const dashboardData = [
    { tienda: "CHEDRAUI EDUARDO MOLINA", zona: "Norte",
      semana1: { nuevas: 12, renovaciones: 8, seguros: 5, simples: 0, access: 676.50 },
      semana2: { nuevas: 7, renovaciones: 5, seguros: 2, simples: 0, access: 659.00 },
      semana3: { nuevas: 13, renovaciones: 2, seguros: 0, simples: 0, access: 551.86 }
    },
    { tienda: "EXP CENTRO TEPOZAN", zona: "Sur",
      semana1: { nuevas: 34, renovaciones: 12, seguros: 8, simples: 0, access: 509.22 },
      semana2: { nuevas: 20, renovaciones: 7, seguros: 5, simples: 2, access: 636.04 },
      semana3: { nuevas: 22, renovaciones: 5, seguros: 6, simples: 0, access: 559.38 }
    },
    { tienda: "EXP CHEDRAUI ANFORA", zona: "Norte",
      semana1: { nuevas: 30, renovaciones: 10, seguros: 0, simples: 0, access: 564.94 },
      semana2: { nuevas: 21, renovaciones: 15, seguros: 4, simples: 0, access: 611.22 },
      semana3: { nuevas: 18, renovaciones: 9, seguros: 1, simples: 1, access: 586.60 }
    },
    { tienda: "EXP CHEDRAUI METEPEC", zona: "Sur",
      semana1: { nuevas: 14, renovaciones: 4, seguros: 2, simples: 0, access: 755.67 },
      semana2: { nuevas: 10, renovaciones: 7, seguros: 1, simples: 0, access: 642.57 },
      semana3: { nuevas: 9, renovaciones: 4, seguros: 0, simples: 0, access: 509.00 }
    },
    { tienda: "EXP COSMOPOL 2", zona: "Norte",
      semana1: { nuevas: 33, renovaciones: 5, seguros: 5, simples: 0, access: 673.48 },
      semana2: { nuevas: 28, renovaciones: 11, seguros: 8, simples: 1, access: 747.00 },
      semana3: { nuevas: 23, renovaciones: 14, seguros: 8, simples: 0, access: 676.71 }
    },
    { tienda: "EXP GALERIAS TOLUCA", zona: "Sur",
      semana1: { nuevas: 15, renovaciones: 5, seguros: 2, simples: 0, access: 683.12 },
      semana2: { nuevas: 7, renovaciones: 0, seguros: 1, simples: 0, access: 627.57 },
      semana3: { nuevas: 9, renovaciones: 4, seguros: 2, simples: 0, access: 867.18 }
    },
    { tienda: "EXP IZTAPALAPA 2", zona: "Sur",
      semana1: { nuevas: 25, renovaciones: 11, seguros: 4, simples: 1, access: 520.00 },
      semana2: { nuevas: 20, renovaciones: 11, seguros: 3, simples: 0, access: 450.54 },
      semana3: { nuevas: 20, renovaciones: 6, seguros: 4, simples: 1, access: 577.33 }
    },
    { tienda: "EXP KSK PATIO TEXCOCO", zona: "Norte",
      semana1: { nuevas: 11, renovaciones: 7, seguros: 2, simples: 0, access: 527.89 },
      semana2: { nuevas: 8, renovaciones: 1, seguros: 2, simples: 0, access: 525.67 },
      semana3: { nuevas: 9, renovaciones: 4, seguros: 0, simples: 0, access: 600.54 }
    },
    { tienda: "EXP KSK SENDERO IXTAPALUCA", zona: "Sur",
      semana1: { nuevas: 14, renovaciones: 7, seguros: 5, simples: 0, access: 621.86 },
      semana2: { nuevas: 12, renovaciones: 0, seguros: 2, simples: 0, access: 602.00 },
      semana3: { nuevas: 12, renovaciones: 3, seguros: 7, simples: 0, access: 583.62 }
    },
    { tienda: "EXP NAUCALPAN", zona: "Norte",
      semana1: { nuevas: 7, renovaciones: 2, seguros: 0, simples: 0, access: 759.00 },
      semana2: { nuevas: 12, renovaciones: 4, seguros: 1, simples: 0, access: 637.57 },
      semana3: { nuevas: 5, renovaciones: 1, seguros: 0, simples: 0, access: 455.67 }
    },
    { tienda: "EXP PATIO TLALPAN", zona: "Sur",
      semana1: { nuevas: 14, renovaciones: 6, seguros: 3, simples: 0, access: 557.13 },
      semana2: { nuevas: 20, renovaciones: 12, seguros: 1, simples: 5, access: 552.85 },
      semana3: { nuevas: 13, renovaciones: 5, seguros: 2, simples: 0, access: 652.13 }
    },
    { tienda: "EXP PLAZA TOLLOCAN", zona: "Sur",
      semana1: { nuevas: 8, renovaciones: 0, seguros: 0, simples: 0, access: 491.50 },
      semana2: { nuevas: 7, renovaciones: 0, seguros: 0, simples: 0, access: 504.71 },
      semana3: { nuevas: 6, renovaciones: 0, seguros: 0, simples: 0, access: 682.33 }
    },
    { tienda: "EXP SENDERO TOLUCA II", zona: "Sur",
      semana1: { nuevas: 17, renovaciones: 6, seguros: 1, simples: 0, access: 608.00 },
      semana2: { nuevas: 25, renovaciones: 6, seguros: 4, simples: 0, access: 644.38 },
      semana3: { nuevas: 23, renovaciones: 4, seguros: 2, simples: 0, access: 609.45 }
    },
    { tienda: "EXP TDA CDMX MULTIPLAZA ARAGON", zona: "Norte",
      semana1: { nuevas: 20, renovaciones: 1, seguros: 0, simples: 0, access: 474.88 },
      semana2: { nuevas: 23, renovaciones: 2, seguros: 4, simples: 0, access: 543.55 },
      semana3: { nuevas: 27, renovaciones: 1, seguros: 4, simples: 0, access: 510.48 }
    },
    { tienda: "EXP TOWN CENTER NICOLAS ROMERO DFN", zona: "Norte",
      semana1: { nuevas: 37, renovaciones: 27, seguros: 6, simples: 0, access: 663.50 },
      semana2: { nuevas: 36, renovaciones: 14, seguros: 8, simples: 0, access: 563.38 },
      semana3: { nuevas: 31, renovaciones: 9, seguros: 7, simples: 4, access: 634.25 }
    },
  ];

  // --- CÁLCULOS DE TOTALES CORREGIDOS ---
  // Ahora las tarjetas de resumen suman los datos reales del mes.
  const totales = useMemo(() => {
    const sumReducer = (category) => dashboardData.reduce((sum, item) => 
      sum + item.semana1[category] + item.semana2[category] + item.semana3[category], 0);

    return {
      nuevasAdiciones: sumReducer('nuevas'),
      renovaciones: sumReducer('renovaciones'),
      seguros: sumReducer('seguros'),
      simplesEmpresariales: sumReducer('simples'),
      access: sumReducer('access').toFixed(2)
    };
  }, [dashboardData]);

  // --- CÁLCULOS PARA GRÁFICAS CORREGIDOS ---
  // "Operaciones" ahora es la suma de las 4 categorías. "Ingresos" es Access.
  const dataZonas = useMemo(() => {
    const calculateZoneData = (zona) => {
      const zoneData = dashboardData.filter(item => item.zona === zona);
      const operaciones = zoneData.reduce((sum, item) =>
        sum + 
        (item.semana1.nuevas + item.semana1.renovaciones + item.semana1.seguros + item.semana1.simples) +
        (item.semana2.nuevas + item.semana2.renovaciones + item.semana2.seguros + item.semana2.simples) +
        (item.semana3.nuevas + item.semana3.renovaciones + item.semana3.seguros + item.semana3.simples),
      0);
      const ingresos = zoneData.reduce((sum, item) =>
        sum + item.semana1.access + item.semana2.access + item.semana3.access, 0);
      return { zona, operaciones, ingresos };
    };
    return [calculateZoneData("Norte"), calculateZoneData("Sur")];
  }, [dashboardData]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899'];
  const formatCurrency = (value) => `$${parseFloat(value).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getStoreTotalOps = (store) => 
    (store.semana1.nuevas + store.semana1.renovaciones + store.semana1.seguros + store.semana1.simples) +
    (store.semana2.nuevas + store.semana2.renovaciones + store.semana2.seguros + store.semana2.simples) +
    (store.semana3.nuevas + store.semana3.renovaciones + store.semana3.seguros + store.semana3.simples);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Región Centro</h1>
          <p className="text-slate-600">Dashboard de Análisis de Ventas y Operaciones</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-500">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 mb-1">Nuevas y Adiciones</h3>
            <p className="text-2xl font-bold text-slate-800">{totales.nuevasAdiciones.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 mb-1">Renovaciones</h3>
            <p className="text-2xl font-bold text-slate-800">{totales.renovaciones.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-yellow-500">
            <Shield className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 mb-1">Seguros</h3>
            <p className="text-2xl font-bold text-slate-800">{totales.seguros.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-red-500">
            <Building className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 mb-1">Simples Empresariales</h3>
            <p className="text-2xl font-bold text-slate-800">{totales.simplesEmpresariales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 mb-1">Access (Ingresos)</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totales.access)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Resumen Región Centro</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataZonas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zona" />
                <YAxis yAxisId="left" label={{ value: 'Operaciones', angle: -90, position: 'insideLeft' }} orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" label={{ value: 'Ingresos ($)', angle: -90, position: 'insideRight' }} orientation="right" stroke="#10B981" tickFormatter={value => `$${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value, name) => name === 'operaciones' ? value.toLocaleString() : formatCurrency(value)} />
                <Legend />
                <Bar yAxisId="left" dataKey="operaciones" fill="#3B82F6" name="Operaciones" />
                <Bar yAxisId="right" dataKey="ingresos" fill="#10B981" name="Ingresos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Operaciones por Tienda (Norte)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={dashboardData.filter(item => item.zona === "Norte")} 
                                 dataKey={getStoreTotalOps} 
                                 nameKey="tienda" 
                                 cx="50%" cy="50%" 
                                 outerRadius={80} 
                                 fill="#8884d8">
                                {dashboardData.filter(item => item.zona === "Norte").map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value.toLocaleString(), name]}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Operaciones por Tienda (Sur)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={dashboardData.filter(item => item.zona === "Sur")} 
                                 dataKey={getStoreTotalOps} 
                                 nameKey="tienda" 
                                 cx="50%" cy="50%" 
                                 outerRadius={80} 
                                 fill="#8884d8">
                                {dashboardData.filter(item => item.zona === "Sur").map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value.toLocaleString(), name]}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <button onClick={() => setShowNorteDetails(!showNorteDetails)} className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                        <Store className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Ver Detalles Zona Norte</span>
                    </div>
                    {showNorteDetails ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                </button>
                {showNorteDetails && (
                    <div className="mt-4 space-y-3">
                        {dashboardData.filter(item => item.zona === "Norte").map((tienda, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-slate-50">
                                <h4 className="font-semibold text-slate-800 mb-2">{tienda.tienda}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <p><b>Sem 1:</b> {tienda.semana1.nuevas} N | {tienda.semana1.renovaciones} R | {tienda.semana1.seguros} S | {tienda.semana1.simples} E | <b>{formatCurrency(tienda.semana1.access)}</b></p>
                                    <p><b>Sem 2:</b> {tienda.semana2.nuevas} N | {tienda.semana2.renovaciones} R | {tienda.semana2.seguros} S | {tienda.semana2.simples} E | <b>{formatCurrency(tienda.semana2.access)}</b></p>
                                    <p><b>Sem 3:</b> {tienda.semana3.nuevas} N | {tienda.semana3.renovaciones} R | {tienda.semana3.seguros} S | {tienda.semana3.simples} E | <b>{formatCurrency(tienda.semana3.access)}</b></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
                 <button onClick={() => setShowSurDetails(!showSurDetails)} className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                        <Store className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Ver Detalles Zona Sur</span>
                    </div>
                    {showSurDetails ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-green-600" />}
                </button>
                {showSurDetails && (
                    <div className="mt-4 space-y-3">
                        {dashboardData.filter(item => item.zona === "Sur").map((tienda, index) => (
                           <div key={index} className="border rounded-lg p-4 bg-slate-50">
                                <h4 className="font-semibold text-slate-800 mb-2">{tienda.tienda}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <p><b>Sem 1:</b> {tienda.semana1.nuevas} N | {tienda.semana1.renovaciones} R | {tienda.semana1.seguros} S | {tienda.semana1.simples} E | <b>{formatCurrency(tienda.semana1.access)}</b></p>
                                    <p><b>Sem 2:</b> {tienda.semana2.nuevas} N | {tienda.semana2.renovaciones} R | {tienda.semana2.seguros} S | {tienda.semana2.simples} E | <b>{formatCurrency(tienda.semana2.access)}</b></p>
                                    <p><b>Sem 3:</b> {tienda.semana3.nuevas} N | {tienda.semana3.renovaciones} R | {tienda.semana3.seguros} S | {tienda.semana3.simples} E | <b>{formatCurrency(tienda.semana3.access)}</b></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="text-center mt-8 text-slate-500 text-sm">
          Dashboard generado automáticamente - Región Centro
        </div>
      </div>
    </div>
  );
};

// La plantilla puede buscar `App` en `main.jsx`, así que nos aseguramos de exportarlo.
export default Dashboard;
