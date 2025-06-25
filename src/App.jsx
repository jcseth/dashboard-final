import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronUp, Store, TrendingUp, DollarSign, Users, Shield, Building } from 'lucide-react';

function Dashboard() {
  const [showNorteDetails, setShowNorteDetails] = useState(false);
  const [showSurDetails, setShowSurDetails] = useState(false);

  const rawData = [
    { tienda: "CHEDRAUI EDUARDO MOLINA", zona: "Norte", semana1_ops: 128, semana1_monto: 676.50, semana2_ops: 75, semana2_monto: 659.00, semana3_ops: 132, semana3_monto: 551.86 },
    { tienda: "EXP CHEDRAUI ANFORA", zona: "Norte", semana1_ops: 30, semana1_monto: 564.94, semana2_ops: 211, semana2_monto: 611.22, semana3_ops: 189, semana3_monto: 586.60 },
    { tienda: "EXP COSMOPOL 2", zona: "Norte", semana1_ops: 33, semana1_monto: 673.48, semana2_ops: 281, semana2_monto: 747.00, semana3_ops: 231, semana3_monto: 676.71 },
    { tienda: "EXP KSK PATIO TEXCOCO", zona: "Norte", semana1_ops: 11, semana1_monto: 527.89, semana2_ops: 8, semana2_monto: 525.67, semana3_ops: 9, semana3_monto: 600.54 },
    { tienda: "EXP NAUCALPAN", zona: "Norte", semana1_ops: 7, semana1_monto: 759.00, semana2_ops: 124, semana2_monto: 637.57, semana3_ops: 5, semana3_monto: 455.67 },
    { tienda: "EXP TDA CDMX MULTIPLAZA ARAGON", zona: "Norte", semana1_ops: 20, semana1_monto: 474.88, semana2_ops: 232, semana2_monto: 543.55, semana3_ops: 27, semana3_monto: 510.48 },
    { tienda: "EXP TOWN CENTER NICOLAS ROMERO", zona: "Norte", semana1_ops: 372, semana1_monto: 663.50, semana2_ops: 361, semana2_monto: 563.38, semana3_ops: 319, semana3_monto: 634.25 },
    { tienda: "EXP CENTRO TEPOZAN", zona: "Sur", semana1_ops: 34, semana1_monto: 509.22, semana2_ops: 207, semana2_monto: 636.04, semana3_ops: 22, semana3_monto: 559.38 },
    { tienda: "EXP CHEDRAUI METEPEC", zona: "Sur", semana1_ops: 14, semana1_monto: 755.67, semana2_ops: 107, semana2_monto: 642.57, semana3_ops: 9, semana3_monto: 509.00 },
    { tienda: "EXP GALERIAS TOLUCA", zona: "Sur", semana1_ops: 15, semana1_monto: 683.12, semana2_ops: 70, semana2_monto: 627.57, semana3_ops: 94, semana3_monto: 867.18 },
    { tienda: "EXP IZTAPALAPA 2", zona: "Sur", semana1_ops: 251, semana1_monto: 520.00, semana2_ops: 201, semana2_monto: 450.54, semana3_ops: 206, semana3_monto: 577.33 },
    { tienda: "EXP KSK SENDERO IXTAPALUCA", zona: "Sur", semana1_ops: 14, semana1_monto: 621.86, semana2_ops: 120, semana2_monto: 602.00, semana3_ops: 123, semana3_monto: 583.62 },
    { tienda: "EXP PATIO TLALPAN", zona: "Sur", semana1_ops: 14, semana1_monto: 557.13, semana2_ops: 201, semana2_monto: 552.85, semana3_ops: 135, semana3_monto: 652.13 },
    { tienda: "EXP PLAZA TOLLOCAN", zona: "Sur", semana1_ops: 8, semana1_monto: 491.50, semana2_ops: 7, semana2_monto: 504.71, semana3_ops: 6, semana3_monto: 682.33 },
    { tienda: "EXP SENDERO TOLUCA II", zona: "Sur", semana1_ops: 17, semana1_monto: 608.00, semana2_ops: 256, semana2_monto: 644.38, semana3_ops: 234, semana3_monto: 609.45 }
  ];
  const totales = useMemo(() => {
    const totalOperaciones = rawData.reduce((sum, item) => sum + item.semana1_ops + item.semana2_ops + item.semana3_ops, 0);
    const totalMontos = rawData.reduce((sum, item) => sum + item.semana1_monto + item.semana2_monto + item.semana3_monto, 0);
    return {
      nuevasAdiciones: Math.floor(totalOperaciones * 0.25),
      renovaciones: Math.floor(totalOperaciones * 0.35),
      seguros: Math.floor(totalOperaciones * 0.15),
      simplesEmpresariales: Math.floor(totalOperaciones * 0.15),
      access: totalMontos.toFixed(2)
    };
  }, [rawData]);
  const dataZonas = useMemo(() => {
    const norte = rawData.filter(item => item.zona === "Norte");
    const sur = rawData.filter(item => item.zona === "Sur");
    const norteTotal = norte.reduce((sum, item) => sum + item.semana1_ops + item.semana2_ops + item.semana3_ops, 0);
    const surTotal = sur.reduce((sum, item) => sum + item.semana1_ops + item.semana2_ops + item.semana3_ops, 0);
    const norteMontos = norte.reduce((sum, item) => sum + item.semana1_monto + item.semana2_monto + item.semana3_monto, 0);
    const surMontos = sur.reduce((sum, item) => sum + item.semana1_monto + item.semana2_monto + item.semana3_monto, 0);
    return [
      { zona: "Norte", operaciones: norteTotal, ingresos: norteMontos },
      { zona: "Sur", operaciones: surTotal, ingresos: surMontos }
    ];
  }, [rawData]);
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const formatCurrency = (value) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
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
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(parseFloat(totales.access))}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Resumen Región Centro</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataZonas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zona" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
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
                  <Pie data={rawData.filter(item => item.zona === "Norte").map(item => ({ name: item.tienda, value: item.semana1_ops + item.semana2_ops + item.semana3_ops }))} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                    {rawData.filter(item => item.zona === "Norte").map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
                  <Pie data={rawData.filter(item => item.zona === "Sur").map(item => ({ name: item.tienda, value: item.semana1_ops + item.semana2_ops + item.semana3_ops }))} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                    {rawData.filter(item => item.zona === "Sur").map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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
                {rawData.filter(item => item.zona === "Norte").map((tienda, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-semibold text-slate-800 mb-2">{tienda.tienda}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div><span className="text-slate-600">Sem 1:</span><span className="ml-1 font-medium">{tienda.semana1_ops} ops | {formatCurrency(tienda.semana1_monto)}</span></div>
                      <div><span className="text-slate-600">Sem 2:</span><span className="ml-1 font-medium">{tienda.semana2_ops} ops | {formatCurrency(tienda.semana2_monto)}</span></div>
                      <div><span className="text-slate-600">Sem 3:</span><span className="ml-1 font-medium">{tienda.semana3_ops} ops | {formatCurrency(tienda.semana3_monto)}</span></div>
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
                {rawData.filter(item => item.zona === "Sur").map((tienda, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-semibold text-slate-800 mb-2">{tienda.tienda}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div><span className="text-slate-600">Sem 1:</span><span className="ml-1 font-medium">{tienda.semana1_ops} ops | {formatCurrency(tienda.semana1_monto)}</span></div>
                      <div><span className="text-slate-600">Sem 2:</span><span className="ml-1 font-medium">{tienda.semana2_ops} ops | {formatCurrency(tienda.semana2_monto)}</span></div>
                      <div><span className="text-slate-600">Sem 3:</span><span className="ml-1 font-medium">{tienda.semana3_ops} ops | {formatCurrency(tienda.semana3_monto)}</span></div>
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
const App = Dashboard;
export default App;
