import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Store, TrendingUp, DollarSign, Users, Shield, Building } from 'lucide-react';

// --- Componente Reutilizable para las gráficas de comparación ---
const CategoryComparisonChart = ({ title, data, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
    <div style={{ height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="zona" width={50} />
          <Tooltip cursor={{fill: '#f0f0f0'}} formatter={(value) => value.toLocaleString()} />
          <Bar dataKey="total" fill={color} name="Total" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const Dashboard = () => {
  const [showNorteDetails, setShowNorteDetails] = useState(false);
  const [showSurDetails, setShowSurDetails] = useState(false);
  const [showComparisons, setShowComparisons] = useState(false);

  const dashboardData = [
    { tienda: "CHEDRAUI EDUARDO MOLINA", zona: "Norte",
      semana1: { activaciones: 12, renovaciones: 8, seguros: 5, simples: 0, accessFee: 676.50 },
      semana2: { activaciones: 7, renovaciones: 5, seguros: 2, simples: 0, accessFee: 659.00 },
      semana3: { activaciones: 13, renovaciones: 2, seguros: 0, simples: 0, accessFee: 551.86 }
    },
    { tienda: "EXP CENTRO TEPOZAN", zona: "Sur",
      semana1: { activaciones: 34, renovaciones: 12, seguros: 8, simples: 0, accessFee: 509.22 },
      semana2: { activaciones: 20, renovaciones: 7, seguros: 5, simples: 2, accessFee: 636.04 },
      semana3: { activaciones: 22, renovaciones: 5, seguros: 6, simples: 0, accessFee: 559.38 }
    },
    { tienda: "EXP CHEDRAUI ANFORA", zona: "Norte",
      semana1: { activaciones: 30, renovaciones: 10, seguros: 0, simples: 0, accessFee: 564.94 },
      semana2: { activaciones: 21, renovaciones: 15, seguros: 4, simples: 0, accessFee: 611.22 },
      semana3: { activaciones: 18, renovaciones: 9, seguros: 1, simples: 1, accessFee: 586.60 }
    },
    { tienda: "EXP CHEDRAUI METEPEC", zona: "Sur",
      semana1: { activaciones: 14, renovaciones: 4, seguros: 2, simples: 0, accessFee: 755.67 },
      semana2: { activaciones: 10, renovaciones: 7, seguros: 1, simples: 0, accessFee: 642.57 },
      semana3: { activaciones: 9, renovaciones: 4, seguros: 0, simples: 0, accessFee: 509.00 }
    },
    { tienda: "EXP COSMOPOL 2", zona: "Norte",
      semana1: { activaciones: 33, renovaciones: 5, seguros: 5, simples: 0, accessFee: 673.48 },
      semana2: { activaciones: 28, renovaciones: 11, seguros: 8, simples: 1, accessFee: 747.00 },
      semana3: { activaciones: 23, renovaciones: 14, seguros: 8, simples: 0, accessFee: 676.71 }
    },
    { tienda: "EXP GALERIAS TOLUCA", zona: "Sur",
      semana1: { activaciones: 15, renovaciones: 5, seguros: 2, simples: 0, accessFee: 683.12 },
      semana2: { activaciones: 7, renovaciones: 0, seguros: 1, simples: 0, accessFee: 627.57 },
      semana3: { activaciones: 9, renovaciones: 4, seguros: 2, simples: 0, accessFee: 867.18 }
    },
    { tienda: "EXP IZTAPALAPA 2", zona: "Sur",
      semana1: { activaciones: 25, renovaciones: 11, seguros: 4, simples: 1, accessFee: 520.00 },
      semana2: { activaciones: 20, renovaciones: 11, seguros: 3, simples: 0, accessFee: 450.54 },
      semana3: { activaciones: 20, renovaciones: 6, seguros: 4, simples: 1, accessFee: 577.33 }
    },
    { tienda: "EXP KSK PATIO TEXCOCO", zona: "Norte",
      semana1: { activaciones: 11, renovaciones: 7, seguros: 2, simples: 0, accessFee: 527.89 },
      semana2: { activaciones: 8, renovaciones: 1, seguros: 2, simples: 0, accessFee: 525.67 },
      semana3: { activaciones: 9, renovaciones: 4, seguros: 0, simples: 0, accessFee: 600.54 }
    },
    { tienda: "EXP KSK SENDERO IXTAPALUCA", zona: "Sur",
      semana1: { activaciones: 14, renovaciones: 7, seguros: 5, simples: 0, accessFee: 621.86 },
      semana2: { activaciones: 12, renovaciones: 0, seguros: 2, simples: 0, accessFee: 602.00 },
      semana3: { activaciones: 12, renovaciones: 3, seguros: 7, simples: 0, accessFee: 583.62 }
    },
    { tienda: "EXP NAUCALPAN", zona: "Norte",
      semana1: { activaciones: 7, renovaciones: 2, seguros: 0, simples: 0, accessFee: 759.00 },
      semana2: { activaciones: 12, renovaciones: 4, seguros: 1, simples: 0, accessFee: 637.57 },
      semana3: { activaciones: 5, renovaciones: 1, seguros: 0, simples: 0, accessFee: 455.67 }
    },
    { tienda: "EXP PATIO TLALPAN", zona: "Sur",
      semana1: { activaciones: 14, renovaciones: 6, seguros: 3, simples: 0, accessFee: 557.13 },
      semana2: { activaciones: 20, renovaciones: 12, seguros: 1, simples: 5, accessFee: 552.85 },
      semana3: { activaciones: 13, renovaciones: 5, seguros: 2, simples: 0, accessFee: 652.13 }
    },
    { tienda: "EXP PLAZA TOLLOCAN", zona: "Sur",
      semana1: { activaciones: 8, renovaciones: 0, seguros: 0, simples: 0, accessFee: 491.50 },
      semana2: { activaciones: 7, renovaciones: 0, seguros: 0, simples: 0, accessFee: 504.71 },
      semana3: { activaciones: 6, renovaciones: 0, seguros: 0, simples: 0, accessFee: 682.33 }
    },
    { tienda: "EXP SENDERO TOLUCA II", zona: "Sur",
      semana1: { activaciones: 17, renovaciones: 6, seguros: 1, simples: 0, accessFee: 608.00 },
      semana2: { activaciones: 25, renovaciones: 6, seguros: 4, simples: 0, accessFee: 644.38 },
      semana3: { activaciones: 23, renovaciones: 4, seguros: 2, simples: 0, accessFee: 609.45 }
    },
    { tienda: "EXP TDA CDMX MULTIPLAZA ARAGON", zona: "Norte",
      semana1: { activaciones: 20, renovaciones: 1, seguros: 0, simples: 0, accessFee: 474.88 },
      semana2: { activaciones: 23, renovaciones: 2, seguros: 4, simples: 0, accessFee: 543.55 },
      semana3: { activaciones: 27, renovaciones: 1, seguros: 4, simples: 0, accessFee: 510.48 }
    },
    { tienda: "EXP TOWN CENTER NICOLAS ROMERO DFN", zona: "Norte",
      semana1: { activaciones: 37, renovaciones: 27, seguros: 6, simples: 0, accessFee: 663.50 },
      semana2: { activaciones: 36, renovaciones: 14, seguros: 8, simples: 0, accessFee: 563.38 },
      semana3: { activaciones: 31, renovaciones: 9, seguros: 7, simples: 4, accessFee: 634.25 }
    },
  ];

  const totales = useMemo(() => {
    const sumReducer = (category) => dashboardData.reduce((sum, item) => 
      sum + item.semana1[category] + item.semana2[category] + item.semana3[category], 0);

    return {
      totalActivaciones: sumReducer('activaciones'),
      totalRenovaciones: sumReducer('renovaciones'),
      totalSeguros: sumReducer('seguros'),
      totalSimples: sumReducer('simples'),
      totalAccessFee: 600.96, // <-- CAMBIO 2: Vuelve a ser el promedio fijo.
    };
  }, [dashboardData]);
  
  // --- CÁLCULO PARA LAS NUEVAS GRÁFICAS DE RESUMEN POR ZONA ---
  const zoneSummaryData = useMemo(() => {
    const metrics = [
      { key: 'activaciones', name: 'Activaciones' },
      { key: 'renovaciones', name: 'Renovaciones' },
      { key: 'seguros', name: 'Seguros' },
      { key: 'simples', name: 'Simples Emp.' },
      { key: 'accessFee', name: 'Access Fee' }
    ];
    
    const calculateTotals = (zona) => {
      return metrics.map(metric => {
        const total = dashboardData
          .filter(d => d.zona === zona)
          .reduce((sum, item) => sum + item.semana1[metric.key] + item.semana2[metric.key] + item.semana3[metric.key], 0);
        return { metric: metric.name, total: metric.key === 'accessFee' ? parseFloat(total.toFixed(2)) : total };
      });
    };

    return {
      norte: calculateTotals('Norte'),
      sur: calculateTotals('Sur'),
    };
  }, [dashboardData]);

  const categoryComparisonData = useMemo(() => {
    const getZoneTotal = (zona, category) => 
      dashboardData.filter(item => item.zona === zona)
                   .reduce((sum, item) => sum + item.semana1[category] + item.semana2[category] + item.semana3[category], 0);

    return {
      activaciones: [{ zona: 'Norte', total: getZoneTotal('Norte', 'activaciones') }, { zona: 'Sur', total: getZoneTotal('Sur', 'activaciones') }],
      renovaciones: [{ zona: 'Norte', total: getZoneTotal('Norte', 'renovaciones') }, { zona: 'Sur', total: getZoneTotal('Sur', 'renovaciones') }],
      seguros: [{ zona: 'Norte', total: getZoneTotal('Norte', 'seguros') }, { zona: 'Sur', total: getZoneTotal('Sur', 'seguros') }],
      simples: [{ zona: 'Norte', total: getZoneTotal('Norte', 'simples') }, { zona: 'Sur', total: getZoneTotal('Sur', 'simples') }],
      accessFee: [{ zona: 'Norte', total: getZoneTotal('Norte', 'accessFee') }, { zona: 'Sur', total: getZoneTotal('Sur', 'accessFee') }],
    }
  }, [dashboardData]);

  const formatCurrency = (value) => `$${parseFloat(value).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const DetailsTable = ({ tienda }) => {
    const categories = ['activaciones', 'renovaciones', 'seguros', 'simples', 'accessFee'];
    const categoryNames = {
      activaciones: 'Activaciones',
      renovaciones: 'Renovaciones',
      seguros: 'Seguros',
      simples: 'Simples Emp.',
      accessFee: 'Access Fee'
    };

    return (
      <div className="text-xs sm:text-sm bg-white p-3 rounded-lg border">
        <div className="grid grid-cols-5 gap-2 font-bold text-center border-b pb-2 mb-2">
          <div>Categoría</div>
          <div>Sem 1</div>
          <div>Sem 2</div>
          <div>Sem 3</div>
          <div>Total Mes</div>
        </div>
        {categories.map(cat => {
          const s1 = tienda.semana1[cat];
          const s2 = tienda.semana2[cat];
          const s3 = tienda.semana3[cat];
          const isCurrency = cat === 'accessFee';
          const total = isCurrency ? (s1 + s2 + s3) / 3 : s1 + s2 + s3;

          return (
            <div key={cat} className="grid grid-cols-5 gap-2 text-center py-1 even:bg-slate-50 items-center">
              <div className="font-semibold text-left">{categoryNames[cat]}</div>
              <div>{isCurrency ? formatCurrency(s1) : s1.toLocaleString()}</div>
              <div>{isCurrency ? formatCurrency(s2) : s2.toLocaleString()}</div>
              <div>{isCurrency ? formatCurrency(s3) : s3.toLocaleString()}</div>
              <div className="font-bold">{isCurrency ? formatCurrency(total) : total.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Región Centro</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-500">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-700 mb-1">Activaciones</h3>
                <p className="text-2xl font-bold text-slate-800">{totales.totalActivaciones.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-700 mb-1">Renovaciones</h3>
                <p className="text-2xl font-bold text-slate-800">{totales.totalRenovaciones.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-yellow-500">
                <Shield className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-700 mb-1">Seguros</h3>
                <p className="text-2xl font-bold text-slate-800">{totales.totalSeguros.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-red-500">
                <Building className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-700 mb-1">Simples Empresariales</h3>
                <p className="text-2xl font-bold text-slate-800">{totales.totalSimples.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500">
                <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-700 mb-1">Access Fee</h3>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(totales.totalAccessFee)}</p>
            </div>
        </div>
        
        {/* --- CAMBIO 1: NUEVAS GRÁFICAS DE RESUMEN SEPARADAS POR ZONA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gráfica Zona Norte */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Resumen Zona Norte</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneSummaryData.norte} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis tickFormatter={(value) => (value > 1000 ? `${value / 1000}k` : value)} />
                  <Tooltip formatter={(value, name) => [typeof value === 'number' ? value.toLocaleString('es-MX', {maximumFractionDigits: 2}) : value, name]}/>
                  <Legend />
                  <Bar dataKey="total" name="Total del Mes" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Gráfica Zona Sur */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Resumen Zona Sur</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneSummaryData.sur} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis tickFormatter={(value) => (value > 1000 ? `${value / 1000}k` : value)} />
                  <Tooltip formatter={(value, name) => [typeof value === 'number' ? value.toLocaleString('es-MX', {maximumFractionDigits: 2}) : value, name]}/>
                  <Legend />
                  <Bar dataKey="total" name="Total del Mes" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <button onClick={() => setShowNorteDetails(!showNorteDetails)} className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                        <Store className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Ver Detalles Zona Norte</span>
                    </div>
                    {showNorteDetails ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                </button>
                {showNorteDetails && (
                    <div className="mt-4 space-y-4">
                        {dashboardData.filter(item => item.zona === "Norte").map((tienda) => (
                            <div key={tienda.tienda}>
                                <h4 className="font-semibold text-slate-800 mb-2">{tienda.tienda}</h4>
                                <DetailsTable tienda={tienda} />
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
                    <div className="mt-4 space-y-4">
                        {dashboardData.filter(item => item.zona === "Sur").map((tienda) => (
                             <div key={tienda.tienda}>
                                <h4 className="font-semibold text-slate-800 mb-2">{tienda.tienda}</h4>
                                <DetailsTable tienda={tienda} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        <div className="mb-8">
            <button
                onClick={() => setShowComparisons(!showComparisons)}
                className="w-full p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors flex justify-center items-center"
                aria-label="Mostrar/Ocultar comparativas por zona"
            >
                {showComparisons ? <ChevronUp className="w-6 h-6 text-slate-600" /> : <ChevronDown className="w-6 h-6 text-slate-600" />}
            </button>

            {showComparisons && (
                <div className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <CategoryComparisonChart title="Activaciones" data={categoryComparisonData.activaciones} color="#3B82F6" />
                        <CategoryComparisonChart title="Renovaciones" data={categoryComparisonData.renovaciones} color="#10B981" />
                        <CategoryComparisonChart title="Seguros" data={categoryComparisonData.seguros} color="#F59E0B" />
                        <CategoryComparisonChart title="Simples Empresariales" data={categoryComparisonData.simples} color="#EF4444" />
                        <CategoryComparisonChart title="Access Fee" data={categoryComparisonData.accessFee} color="#8B5CF6" />
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
