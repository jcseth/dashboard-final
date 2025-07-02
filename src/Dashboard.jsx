import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Shield, Building, DollarSign, ChevronDown, ChevronUp, Store, PieChart, X } from 'lucide-react';

const CardBackDetails = ({ title, data }) => {
  const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
              {typeof value === 'number' ? value.toLocaleString('es-MX') : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const KpiCard = ({ icono, titulo, data, color }) => {
  const Icono = icono;
  const { actual = 0, cuota = 0, alcance = 0 } = data || {};
  const formatoValor = (valor) => (valor || 0).toLocaleString('es-MX');
  const porcentaje = Math.round((alcance || 0) * 100);
  const colorClasses = {
    green: { border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-500' },
    yellow: { border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500' },
  };
  const colors = colorClasses[color] || { border: 'border-slate-500', text: 'text-slate-500', bg: 'bg-slate-500' };
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${colors.border} border-l-4 space-y-2 flex flex-col justify-between h-48`}>
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-700 text-base">{titulo}</h3>
        <Icono className={`w-8 h-8 ${colors.text}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{formatoValor(actual)}</p>
        {cuota > 0 && <p className="text-xs text-slate-500">de {formatoValor(cuota)}</p>}
      </div>
      {cuota > 0 && (
        <div>
          <div className="flex justify-between items-center mb-1"><span className="text-xs font-semibold text-slate-600">Alcance</span><span className={`text-xs font-bold ${colors.text}`}>{porcentaje}%</span></div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`${colors.bg} h-2.5 rounded-full`} style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailsTable = ({ storeData }) => {
  const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const categories = ['activaciones', 'renovaciones', 'seguros', 'empresarial', 'accessFee'];
  const categoryNames = { activaciones: 'Activaciones', renovaciones: 'Renovaciones', seguros: 'Seguros', empresarial: 'Empresarial', accessFee: 'Access Fee' };
  return (
    <div className="text-xs sm:text-sm bg-white p-3 rounded-lg border border-slate-200">
      <div className="grid grid-cols-6 gap-2 font-bold text-center border-b pb-2 mb-2 text-slate-700">
        <div>Categoría</div><div>Sem 1</div><div>Sem 2</div><div>Sem 3</div><div>Sem 4</div><div>Total / Cuota</div>
      </div>
      {categories.map(cat => {
        const isCurrency = cat === 'accessFee';
        const semanas = [storeData.semanas.semana1, storeData.semanas.semana2, storeData.semanas.semana3, storeData.semanas.semana4];
        const totalMesValue = semanas.reduce((acc, sem) => acc + (sem?.[cat] || 0), 0);
        const totalMesCount = isCurrency ? semanas.reduce((acc, sem) => acc + (sem?.accessFeeCount || 0), 0) : 0;
        const cuotaMesValue = storeData.cuotas?.[cat] || 0;
        if (!isCurrency && totalMesValue === 0 && cuotaMesValue === 0) return null;
        let displayTotal;
        if (isCurrency) { displayTotal = formatCurrency(totalMesCount > 0 ? totalMesValue / totalMesCount : 0); } 
        else { displayTotal = totalMesValue.toLocaleString('es-MX'); }
        return (
          <div key={cat} className="grid grid-cols-6 gap-2 text-center py-1.5 even:bg-slate-50 items-center">
            <div className="font-semibold text-left text-slate-600">{categoryNames[cat]}</div>
            {semanas.map((semana, i) => {
              let valorSemana = semana?.[cat] || 0;
              if (isCurrency) {
                const count = semana?.accessFeeCount || 0;
                valorSemana = count > 0 ? valorSemana / count : 0;
                return <div key={i}>{formatCurrency(valorSemana)}</div>;
              }
              return <div key={i}>{valorSemana.toLocaleString('es-MX')}</div>;
            })}
            <div className="font-bold text-slate-800">
              {displayTotal}
              {!isCurrency && <span className="text-slate-400 font-normal"> / {cuotaMesValue.toLocaleString('es-MX')}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StoreChart = ({ storeData, color }) => {
  const totales = { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0 };
  for (const semana of Object.values(storeData.semanas)) {
    totales.activaciones += semana.activaciones;
    totales.renovaciones += semana.renovaciones;
    totales.seguros += semana.seguros;
    totales.empresarial += semana.empresarial;
  }
  const chartData = [
    { name: 'Activ.', Real: totales.activaciones, Meta: storeData.cuotas.activaciones },
    { name: 'Renov.', Real: totales.renovaciones, Meta: storeData.cuotas.renovaciones },
    { name: 'Seguros', Real: totales.seguros, Meta: storeData.cuotas.seguros },
    { name: 'Emp.', Real: totales.empresarial, Meta: storeData.cuotas.empresarial },
  ];

  return (
    <div className="mt-4 h-64 bg-white p-4 rounded-lg border border-slate-200">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={10} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Real" fill={color} name="Alcance" />
          <Bar dataKey="Meta" fill="#bfdbfe" name="Cuota" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ZoneProgressChart = ({ title, data, color }) => {
  if (!data || !data.activaciones) return null;
  const chartData = [
    { name: 'Activaciones', Real: data.activaciones.actual, Meta: data.activaciones.cuota },
    { name: 'Renovaciones', Real: data.renovaciones.actual, Meta: data.renovaciones.cuota },
    { name: 'Seguros', Real: data.seguros.actual, Meta: data.seguros.cuota },
    { name: 'Empresarial', Real: data.empresarial.actual, Meta: data.empresarial.cuota },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Real" fill={color} name="Alcance"/>
            <Bar dataKey="Meta" fill={color === '#3B82F6' ? '#93c5fd' : '#a7f3d0'} name="Cuota"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ComparativeModal = ({ show, onClose, unitData, currencyData }) => {
    if (!show) return null;
    const currencyFormatter = (value) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-6xl w-full">
          <div className="flex justify-between items-center mb-4 pb-3 border-b"><h3 className="text-xl font-bold text-slate-800">Comparativa por Zonas</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-800 rounded-full p-1 transition-colors"><X size={24} /></button></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ height: '70vh', maxHeight: '500px' }}>
            <div>
              <h4 className="font-semibold text-center text-slate-700 mb-2">Unidades</h4>
              <ResponsiveContainer width="100%" height="90%"><BarChart data={unitData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="metric" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="Zona Norte" fill="#3B82F6" /><Bar dataKey="Zona Sur" fill="#10B981" /></BarChart></ResponsiveContainer>
            </div>
            <div>
              <h4 className="font-semibold text-center text-slate-700 mb-2">Access Fee (Promedio)</h4>
              <ResponsiveContainer width="100%" height="90%"><BarChart data={currencyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="metric" /><YAxis tickFormatter={currencyFormatter} /><Tooltip formatter={currencyFormatter} /><Legend /><Bar dataKey="Zona Norte" fill="#3B82F6" /><Bar dataKey="Zona Sur" fill="#10B981" /></BarChart></ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
};


const Dashboard = () => {
  const [data, setData] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [activeNorteStore, setActiveNorteStore] = useState(null);
  const [activeSurStore, setActiveSurStore] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    try { const datosGuardados = localStorage.getItem('masivoDashboardData'); if (datosGuardados) setData(JSON.parse(datosGuardados)); } catch (error) { console.error("Error al leer masivoDashboardData:", error); }
  }, []);

  const handleCardFlip = (cardName) => {
    setFlippedCards(prev => ({ ...prev, [cardName]: !prev[cardName] }));
  };
  
  const { tiendasNorte, tiendasSur, comparativeUnitData, comparativeCurrencyData } = useMemo(() => {
    if (!data) { return { tiendasNorte: [], tiendasSur: [], comparativeUnitData: [], comparativeCurrencyData: [] }; }
    const norte = data.resumenPorZona?.norte || {};
    const sur = data.resumenPorZona?.sur || {};
    const unitData = [
        { metric: 'Activaciones', 'Zona Norte': norte.activaciones?.actual || 0, 'Zona Sur': sur.activaciones?.actual || 0 },
        { metric: 'Renovaciones', 'Zona Norte': norte.renovaciones?.actual || 0, 'Zona Sur': sur.renovaciones?.actual || 0 },
        { metric: 'Seguros', 'Zona Norte': norte.seguros?.actual || 0, 'Zona Sur': sur.seguros?.actual || 0 },
        { metric: 'Empresarial', 'Zona Norte': norte.empresarial?.actual || 0, 'Zona Sur': sur.empresarial?.actual || 0 },
    ];
    const currencyData = [ { metric: 'Access Fee', 'Zona Norte': norte.accessFee || 0, 'Zona Sur': sur.accessFee || 0 } ];
    return {
      tiendasNorte: (data.detallePorTienda || []).filter(t => t.zona === 'norte'),
      tiendasSur: (data.detallePorTienda || []).filter(t => t.zona === 'sur'),
      comparativeUnitData: unitData,
      comparativeCurrencyData: currencyData
    };
  }, [data]);

  if (!data) { return ( <div className="flex justify-center items-center h-screen bg-slate-50"><div className="text-center p-8 bg-white rounded-lg shadow-md"><h2 className="text-2xl font-bold text-slate-700">No hay datos para mostrar</h2><p className="mt-2 text-slate-500">Por favor, ve a "Configuración" y procesa los archivos.</p></div></div> ); }

  const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 [perspective:1000px]">
        
        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['activaciones'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('activaciones')}>
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500 [backface-visibility:hidden] flex flex-col justify-between">
              <div className="flex items-start justify-between"><h3 className="font-semibold text-slate-700 text-base">Activaciones</h3><Users className="w-8 h-8 text-blue-500" /></div>
              <div><p className="text-2xl font-bold text-slate-800">{(data.totalActivaciones?.actual || 0).toLocaleString()}</p><p className="text-xs text-slate-500">de {(data.totalActivaciones?.cuota || 0).toLocaleString()}</p></div>
              <div><div className="flex justify-between items-center mb-1"><span className="text-xs font-semibold text-slate-600">Alcance</span><span className="text-xs font-bold text-blue-500">{Math.round((data.totalActivaciones?.alcance || 0) * 100)}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(Math.round((data.totalActivaciones?.alcance || 0) * 100), 100)}%` }}></div></div></div>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardBackDetails title="Detalle de Activaciones" data={data.detalleActivaciones} />
          </div>
        </div>

        <KpiCard icono={TrendingUp} titulo="Renovaciones" data={data.totalRenovaciones} color="green" />
        <KpiCard icono={Shield} titulo="Seguros" data={data.totalSeguros} color="yellow" />

        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['empresarial'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('empresarial')}>
           <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500 [backface-visibility:hidden] flex flex-col justify-between">
              <div className="flex items-start justify-between"><h3 className="font-semibold text-slate-700 text-base">Empresarial Tiendas</h3><Building className="w-8 h-8 text-red-500" /></div>
              <div><p className="text-2xl font-bold text-slate-800">{(data.totalEmpresariales?.actual || 0).toLocaleString()}</p><p className="text-xs text-slate-500">de {(data.totalEmpresariales?.cuota || 0).toLocaleString()}</p></div>
              <div><div className="flex justify-between items-center mb-1"><span className="text-xs font-semibold text-slate-600">Alcance</span><span className="text-xs font-bold text-red-500">{Math.round((data.totalEmpresariales?.alcance || 0) * 100)}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min(Math.round((data.totalEmpresariales?.alcance || 0) * 100), 100)}%` }}></div></div></div>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardBackDetails title="Detalle Empresarial" data={data.detalleEmpresariales} />
          </div>
        </div>
        
        <div className="relative w-full h-48 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flippedCards['accessFee'] ? 'rotateY(180deg)' : 'rotateY(0deg)' }} onClick={() => handleCardFlip('accessFee')}>
           <div className="absolute w-full h-full bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500 [backface-visibility:hidden] flex flex-col justify-center space-y-2">
                <div className="flex items-start justify-between"><h3 className="font-semibold text-slate-700 text-base">Access Fee</h3><DollarSign className="w-8 h-8 text-purple-500" /></div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(data.promedioAccessFeeGeneral)}</p>
                <div className="h-5"></div>
          </div>
          <div className="absolute w-full h-full bg-slate-800 text-white rounded-xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <CardBackDetails title="Access Fee Promedio" data={{ 
                Activacion: formatCurrency(data.detalleAccessFee?.Activación),
                Renovacion: formatCurrency(data.detalleAccessFee?.Renovación)
             }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
        <ZoneProgressChart title="Progreso Zona Norte" data={data.resumenPorZona?.norte} color="#3B82F6" />
        <ZoneProgressChart title="Progreso Zona Sur" data={data.resumenPorZona?.sur} color="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-blue-50 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">Detalle por Tienda (Zona Norte)</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {tiendasNorte.map((tienda, index) => (
              <div key={tienda.nombre}>
                <button onClick={() => setActiveNorteStore(activeNorteStore === tienda.nombre ? null : tienda.nombre)} className="w-full text-left p-3 bg-white hover:bg-slate-50 rounded-md shadow flex justify-between items-center transition-colors">
                  <span className="font-semibold">{tienda.nombre}</span>{activeNorteStore === tienda.nombre ? <ChevronUp /> : <ChevronDown />}
                </button>
                {activeNorteStore === tienda.nombre && (
                  <div className="bg-blue-100/50 p-4 rounded-b-lg">
                    <DetailsTable storeData={tienda} />
                    <StoreChart storeData={tienda} color={COLORS[index % COLORS.length]} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-50 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4 text-center">Detalle por Tienda (Zona Sur)</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {tiendasSur.map((tienda, index) => (
              <div key={tienda.nombre}>
                <button onClick={() => setActiveSurStore(activeSurStore === tienda.nombre ? null : tienda.nombre)} className="w-full text-left p-3 bg-white hover:bg-slate-50 rounded-md shadow flex justify-between items-center transition-colors">
                  <span className="font-semibold">{tienda.nombre}</span>{activeSurStore === tienda.nombre ? <ChevronUp /> : <ChevronDown />}
                </button>
                {activeSurStore === tienda.nombre && (
                   <div className="bg-green-100/50 p-4 rounded-b-lg">
                    <DetailsTable storeData={tienda} />
                    <StoreChart storeData={tienda} color={COLORS[(index + 3) % COLORS.length]} />
                  </div>
                )}
              </div>
            ))}
            </div>
        </div>
      </div>
      
      <button onClick={() => setShowCompareModal(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-transform hover:scale-110" aria-label="Ver gráfica comparativa"><PieChart size={24} /></button>
      <ComparativeModal show={showCompareModal} onClose={() => setShowCompareModal(false)} unitData={comparativeUnitData} currencyData={comparativeCurrencyData} />
    </div>
  );
};

export default Dashboard;
