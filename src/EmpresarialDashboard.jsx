import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, DollarSign, ChevronDown, ChevronUp, ClipboardList, Building } from 'lucide-react';

const CardBackDetails = ({ title, data }) => {
  const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').trim();
  const dataToShow = data || {};
  return (
    <div className="p-4 text-xs text-left w-full h-full flex flex-col justify-center">
      <h4 className="font-bold text-sm mb-2 text-center">{title}</h4>
      <div className="space-y-1">
        {Object.entries(dataToShow).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center bg-slate-700/50 p-1 rounded">
            <span className="text-slate-300">{formatKey(key)}:</span>
            <span className="font-bold text-white">
              {typeof value === 'string' ? value : (value || 0).toLocaleString('es-MX')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PtoVentaChart = ({ data, color }) => {
  const chartData = [
    { name: 'Activaciones', total: data?.activaciones || 0 },
    { name: 'Renovaciones', total: data?.renovaciones || 0 },
    { name: 'Mix', total: data?.mix || 0 },
  ];
  return (
    <div className="p-2 border-l-2 border-r-2 border-b-2 rounded-b-md border-slate-200 bg-slate-50">
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill={color} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const EmpresarialDashboard = () => {
  const [data, setData] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [activePto, setActivePto] = useState(null);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  useEffect(() => {
    try {
      const datosGuardados = localStorage.getItem('empresarialDashboardData');
      if (datosGuardados) {
        setData(JSON.parse(datosGuardados));
      }
    } catch (error) {
      console.error("Error al leer datos de localStorage:", error);
    }
  }, []);

  const handleCardFlip = (cardName) => {
    setFlippedCards(prev => ({ ...prev, [cardName]: !prev[cardName] }));
  };

  const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (!data || data.totalActivaciones === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-slate-700">No hay datos de Empresarial</h2>
          <p className="mt-2 text-slate-500">Ve a "Configuración" y procesa los archivos para ver este dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 [perspective:1000px]">
        
        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['activaciones'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('activaciones')}>
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500 [backface-visibility:hidden] flex flex-col justify-between">
              <div className="flex items-start justify-between"><h3 className="font-semibold text-slate-700 text-base">Activaciones</h3><Users className="w-8 h-8 text-blue-500" /></div>
              <div><p className="text-2xl font-bold text-slate-800">{(data.totalActivaciones?.actual || 0).toLocaleString()}</p><p className="text-xs text-slate-500">de {(data.totalActivaciones?.cuota || 0).toLocaleString()}</p></div>
              <div><div className="flex justify-between items-center mb-1"><span className="text-xs font-semibold text-slate-600">Alcance</span><span className="text-xs font-bold text-blue-500">{Math.round((data.totalActivaciones?.alcance || 0) * 100)}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(Math.round((data.totalActivaciones?.alcance || 0) * 100), 100)}%` }}></div></div></div>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardBackDetails title="Detalle Activaciones" data={data.detalleActivaciones || {}} />
          </div>
        </div>
        
        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['renovaciones'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('renovaciones')}>
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500 [backface-visibility:hidden] flex flex-col justify-between">
            <div className="flex items-start justify-between"><h3 className="font-semibold text-slate-700 text-base">Renovaciones</h3><TrendingUp className="w-8 h-8 text-green-500" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{(data.totalRenovaciones?.actual || 0).toLocaleString()}</p><p className="text-xs text-slate-500">de {(data.totalRenovaciones?.cuota || 0).toLocaleString()}</p></div>
            <div><div className="flex justify-between items-center mb-1"><span className="text-xs font-semibold text-slate-600">Alcance</span><span className="text-xs font-bold text-green-500">{Math.round((data.totalRenovaciones?.alcance || 0) * 100)}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(Math.round((data.totalRenovaciones?.alcance || 0) * 100), 100)}%` }}></div></div></div>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardBackDetails title="Detalle Renovaciones" data={data.detalleRenovaciones || {}} />
          </div>
        </div>

        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['mix'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('mix')}>
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500 [backface-visibility:hidden] flex flex-col justify-between">
            <div className="flex items-start justify-between"><h3 className="font-semibold text-slate-700 text-base">Mix</h3><ClipboardList className="w-8 h-8 text-orange-500" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{(data.totalMix?.actual || 0).toLocaleString()}</p><p className="text-xs text-slate-500">de {(data.totalMix?.cuota || 0).toLocaleString()}</p></div>
            <div><div className="flex justify-between items-center mb-1"><span className="text-xs font-semibold text-slate-600">Alcance</span><span className="text-xs font-bold text-orange-500">{Math.round((data.totalMix?.alcance || 0) * 100)}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${Math.min(Math.round((data.totalMix?.alcance || 0) * 100), 100)}%` }}></div></div></div>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardBackDetails title="Detalle del Mix" data={data.detalleMix || {}} />
          </div>
        </div>

        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['accessFee'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('accessFee')}>
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500 [backface-visibility:hidden] flex flex-col justify-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700 mb-1">Access Fee</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(data.promedioAccessFeeGeneral)}</p>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center">
            <CardBackDetails title="Access Fee Promedio" data={{ 
                'Activación': formatCurrency(data.promedioAccessFeeActivacion), 
                'Renovación': formatCurrency(data.promedioAccessFeeRenovacion) 
            }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Detalle por Punto de Venta</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {(data.detallePorPtoVenta || []).map((pto, index) => (
              <div key={pto.ptoVenta}>
                <button
                  onClick={() => setActivePto(activePto === pto.ptoVenta ? null : pto.ptoVenta)}
                  className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-md flex justify-between items-center"
                >
                  <span className="font-semibold">{pto.ptoVenta}</span>
                  {activePto === pto.ptoVenta ? <ChevronUp /> : <ChevronDown />}
                </button>
                {activePto === pto.ptoVenta && <PtoVentaChart data={pto} color={COLORS[index % COLORS.length]} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Ranking General (Mix)</h2>
          <div style={{ height: 600 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.rankingPtoVenta || []} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ptoVenta" angle={-60} textAnchor="end" interval={0} style={{ fontSize: '10px' }} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                <Bar dataKey="activaciones" stackId="a" fill="#3B82F6" name="Activaciones" />
                <Bar dataKey="renovaciones" stackId="a" fill="#10B981" name="Renovaciones" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpresarialDashboard;
