import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Shield, Building, DollarSign, X, ChevronDown, ChevronUp, Store } from 'lucide-react';

// --- Componente para la gráfica de resumen de cada tienda, ahora con color dinámico ---
const StoreSummaryChart = ({ data, color }) => (
  <div className="mt-4" style={{ height: 220 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" fontSize="10" />
        <YAxis allowDecimals={false} />
        <Tooltip formatter={(value) => value.toLocaleString('es-MX')} />
        <Legend />
        {/* CORRECCIÓN: Usamos el color que llega como prop */}
        <Bar dataKey="total" name="Total del Mes" fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// --- Componente para la tabla de detalles, con cálculo de promedio semanal ---
const DetailsTable = ({ dataSemanas }) => {
  const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const categories = ['activaciones', 'renovaciones', 'seguros', 'empresarialSimple', 'empresarialSimplePlus', 'empresarialArmaloNegocios', 'accessFee'];
  const categoryNames = { activaciones: 'Activaciones', renovaciones: 'Renovaciones', seguros: 'Seguros', empresarialSimple: 'Emp. Simple', empresarialSimplePlus: 'Emp. Simple Plus', empresarialArmaloNegocios: 'Emp. Armalo Negocios', accessFee: 'Access Fee' };

  return (
    <div className="text-xs sm:text-sm bg-white p-3 rounded-lg border mt-2">
      <div className="grid grid-cols-6 gap-2 font-bold text-center border-b pb-2 mb-2"><div>Categoría</div><div>Sem 1</div><div>Sem 2</div><div>Sem 3</div><div>Sem 4</div><div>Total Mes</div></div>
      {categories.map(cat => {
        const isCurrency = cat === 'accessFee';
        let totalSum = 0;
        let totalCount = 0;

        for (let i = 1; i <= 4; i++) {
          const semanaData = dataSemanas[`semana${i}`];
          if (semanaData) {
            totalSum += semanaData[cat] || 0;
            if (isCurrency) {
              totalCount += semanaData[`${cat}Count`] || 0;
            }
          }
        }

        if (totalSum === 0 && !isCurrency) return null;
        const displayTotal = isCurrency ? formatCurrency(totalCount > 0 ? totalSum / totalCount : 0) : totalSum.toLocaleString();

        return (
          <div key={cat} className="grid grid-cols-6 gap-2 text-center py-1 even:bg-slate-50 items-center">
            <div className="font-semibold text-left">{categoryNames[cat]}</div>
            {[1, 2, 3, 4].map(i => {
              const semanaData = dataSemanas[`semana${i}`];
              let valor = semanaData?.[cat] || 0;
              // CORRECCIÓN: Si es Access Fee, calculamos el promedio de la semana
              if (isCurrency) {
                const count = semanaData?.[`${cat}Count`] || 0;
                valor = count > 0 ? valor / count : 0;
              }
              return <div key={i}>{isCurrency ? formatCurrency(valor) : valor.toLocaleString()}</div>;
            })}
            <div className="font-bold">{displayTotal}</div>
          </div>
        );
      })}
    </div>
  );
};

// ... (El resto de los componentes y la lógica se quedan igual) ...
const DetalleModal = ({ titulo, data, onClose }) => { const formatKey = (key) => { const spacedKey = key.replace(/([A-Z])/g, ' $1').trim(); return spacedKey.charAt(0).toUpperCase() + spacedKey.slice(1); }; return (<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"> <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full"> <div className="flex justify-between items-center mb-4 pb-2 border-b"><h3 className="text-xl font-bold text-slate-800">{titulo}</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-800 rounded-full p-1 transition-colors"><X size={24} /></button></div> <div className="space-y-2 text-sm"> {Object.entries(data).map(([key, value]) => (<div key={key} className="flex justify-between items-start py-2 px-2 rounded hover:bg-slate-50"> <span className="text-slate-600 font-semibold">{formatKey(key)}:</span> <div className="text-right"> {typeof value === 'object' ? (Object.entries(value).map(([subKey, subValue]) => (<div key={subKey}><span className="text-slate-500">{formatKey(subKey)}:</span>{' '}<span className="font-bold text-slate-800">{subValue.toLocaleString('es-MX')}</span></div>))) : (<span className="font-bold text-slate-800">{typeof value === 'number' && key.toLowerCase().includes('promedio') ? value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : value.toLocaleString('es-MX')}</span>)} </div> </div>))} </div> </div> </div>); };
const getCustomWeek = (date) => { try { let fechaValida; if (typeof date === 'number') { fechaValida = new Date((date - 25569) * 86400 * 1000); } else { fechaValida = new Date(date); } if (isNaN(fechaValida)) return null; const dayOfMonth = fechaValida.getDate(); if (dayOfMonth <= 7) return 'semana1'; if (dayOfMonth <= 14) return 'semana2'; if (dayOfMonth <= 21) return 'semana3'; return 'semana4'; } catch { return null; } };

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [showNorteList, setShowNorteList] = useState(false);
  const [activeNorteStore, setActiveNorteStore] = useState(null);
  const [showSurList, setShowSurList] = useState(false);
  const [activeSurStore, setActiveSurStore] = useState(null);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899'];

  useEffect(() => { try { const datosGuardados = localStorage.getItem('dashboardData'); if (datosGuardados) { setData(JSON.parse(datosGuardados)); } } catch (error) { console.error("Error al leer datos de localStorage:", error); localStorage.removeItem('dashboardData'); } }, []);

  const datosAgrupadosPorTienda = useMemo(() => {
    if (!data?.filasDetalladas) return {};
    const limpiarTexto = (texto) => (texto || '').trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const tiendasZonaNorte = ['CHEDRAUI EDUARDO MOLINA', 'EXP CHEDRAUI ANFORA', 'EXP COSMOPOL 2', 'EXP KSK PATIO TEXCOCO', 'EXP NAUCALPAN', 'EXP TDA CDMX MULTIPLAZA ARAGON', 'EXP TOWN CENTER NICOLAS ROMERO DFN'].map(limpiarTexto);
    const limpiarNumero = (valor) => { if (typeof valor === 'number') return valor; if (typeof valor === 'string') { const numero = parseFloat(valor.replace(/,/g, '')); return isNaN(numero) ? 0 : numero; } return 0; };
    return data.filasDetalladas.reduce((acc, fila) => {
      if (typeof fila !== 'object' || !fila['PTO. DE VENTA'] || !fila['FECHA DE FACTURACION']) return acc;
      const nombreTienda = fila['PTO. DE VENTA'];
      const semana = getCustomWeek(fila['FECHA DE FACTURACION']);
      if (!semana) return acc;
      if (!acc[nombreTienda]) {
        acc[nombreTienda] = { nombre: nombreTienda, zona: tiendasZonaNorte.includes(limpiarTexto(nombreTienda)) ? 'Norte' : 'Sur', semanas: {} };
      }
      if (!acc[nombreTienda].semanas[semana]) acc[nombreTienda].semanas[semana] = {};
      const evento = limpiarTexto(fila.EVENTO);
      const accessFee = limpiarNumero(fila['RENTA SIN IMPUESTOS']);
      if (accessFee > 0) {
        acc[nombreTienda].semanas[semana].accessFee = (acc[nombreTienda].semanas[semana].accessFee || 0) + accessFee;
        acc[nombreTienda].semanas[semana].accessFeeCount = (acc[nombreTienda].semanas[semana].accessFeeCount || 0) + 1;
      }
      if (evento === 'activacion') acc[nombreTienda].semanas[semana].activaciones = (acc[nombreTienda].semanas[semana].activaciones || 0) + 1;
      if (evento === 'renovacion') acc[nombreTienda].semanas[semana].renovaciones = (acc[nombreTienda].semanas[semana].renovaciones || 0) + 1;
      if (fila['SEGURO CAPTURADO']) acc[nombreTienda].semanas[semana].seguros = (acc[nombreTienda].semanas[semana].seguros || 0) + 1;
      if (limpiarTexto(fila['CATEGORIA DE VENTA']) === 'empresarial') {
        const familia = limpiarTexto(fila.FAMILIA);
        if (familia === 'simple') acc[nombreTienda].semanas[semana].empresarialSimple = (acc[nombreTienda].semanas[semana].empresarialSimple || 0) + 1;
        if (familia === 'simple plus') acc[nombreTienda].semanas[semana].empresarialSimplePlus = (acc[nombreTienda].semanas[semana].empresarialSimplePlus || 0) + 1;
        if (familia === 'armalo negocios') acc[nombreTienda].semanas[semana].empresarialArmaloNegocios = (acc[nombreTienda].semanas[semana].empresarialArmaloNegocios || 0) + 1;
      }
      return acc;
    }, {});
  }, [data]);

  const tiendasNorte = Object.values(datosAgrupadosPorTienda).filter(t => t.zona === 'Norte');
  const tiendasSur = Object.values(datosAgrupadosPorTienda).filter(t => t.zona === 'Sur');

  const getStoreSummaryDataForChart = (storeData) => { const totales = { activaciones: 0, renovaciones: 0, seguros: 0, empresariales: 0 }; for (const semana in storeData.semanas) { totales.activaciones += storeData.semanas[semana]?.activaciones || 0; totales.renovaciones += storeData.semanas[semana]?.renovaciones || 0; totales.seguros += storeData.semanas[semana]?.seguros || 0; totales.empresariales += (storeData.semanas[semana]?.empresarialSimple || 0) + (storeData.semanas[semana]?.empresarialSimplePlus || 0) + (storeData.semanas[semana]?.empresarialArmaloNegocios || 0); } return [{ metric: 'Activaciones', total: totales.activaciones }, { metric: 'Renovaciones', total: totales.renovaciones }, { metric: 'Seguros', total: totales.seguros }, { metric: 'Empresarial', total: totales.empresariales },]; };

  if (!data) { return (<div className="flex justify-center items-center h-screen bg-slate-50"><div className="text-center p-8 bg-white rounded-lg shadow-md"><h2 className="text-2xl font-bold text-slate-700">No hay datos para mostrar</h2><p className="mt-2 text-slate-500">Por favor, ve a la pestaña de "Configuración" para cargar un archivo de Excel.</p></div></div>); }

  const formatCurrency = (value) => `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const handleActivacionesClick = () => setModalContent({ titulo: 'Detalle de Activaciones Masivas', data: data.detalleActivaciones });
  const handleAccessFeeClick = () => setModalContent({ titulo: 'Detalle de Access Fee', data: { 'Promedio por Activacion': data.promedioAccessFeeActivacion, 'Promedio por Renovacion': data.promedioAccessFeeRenovacion } });
  const handleEmpresarialesClick = () => setModalContent({ titulo: 'Detalle de Empresariales Tiendas', data: data.detalleEmpresariales });
  const closeModal = () => setModalContent(null);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-12"><div className="w-16 h-12"></div><h1 className="text-4xl font-bold text-slate-800 text-center">Dashboard de Resultados</h1><div className="w-16 h-12"></div></header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div onClick={handleActivacionesClick} className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-500 cursor-pointer hover:bg-slate-50 transition-colors"><Users className="w-8 h-8 text-blue-500 mx-auto mb-2" /><h3 className="font-semibold text-slate-700 mb-1">Activaciones</h3><p className="text-2xl font-bold text-slate-800">{(data.totalActivaciones || 0).toLocaleString()}</p></div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500"><TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" /><h3 className="font-semibold text-slate-700 mb-1">Renovaciones</h3><p className="text-2xl font-bold text-slate-800">{(data.totalRenovaciones || 0).toLocaleString()}</p></div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-yellow-500"><Shield className="w-8 h-8 text-yellow-500 mx-auto mb-2" /><h3 className="font-semibold text-slate-700 mb-1">Seguros</h3><p className="text-2xl font-bold text-slate-800">{(data.totalSeguros || 0).toLocaleString()}</p></div>
        <div onClick={handleEmpresarialesClick} className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-red-500 cursor-pointer hover:bg-slate-50 transition-colors"><Building className="w-8 h-8 text-red-500 mx-auto mb-2" /><h3 className="font-semibold text-slate-700 mb-1">Empresarial Tiendas</h3><p className="text-2xl font-bold text-slate-800">{(data.totalEmpresariales || 0).toLocaleString()}</p></div>
        <div onClick={handleAccessFeeClick} className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500 cursor-pointer hover:bg-slate-50 transition-colors"><DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" /><h3 className="font-semibold text-slate-700 mb-1">Access Fee</h3><p className="text-2xl font-bold text-slate-800">{formatCurrency(data.promedioAccessFeeGeneral)}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
        <div className="bg-white rounded-xl shadow-lg p-6"><h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Resumen Zona Norte</h2><div className="h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.resumenPorZona?.norte ?? []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="metric" /><YAxis /><Tooltip /><Legend /><Bar dataKey="total" fill="#3B82F6" name="Total" /></BarChart></ResponsiveContainer></div></div>
        <div className="bg-white rounded-xl shadow-lg p-6"><h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Resumen Zona Sur</h2><div className="h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.resumenPorZona?.sur ?? []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="metric" /><YAxis /><Tooltip /><Legend /><Bar dataKey="total" fill="#10B981" name="Total" /></BarChart></ResponsiveContainer></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button onClick={() => setShowNorteList(!showNorteList)} className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><div className="flex items-center"><Store className="w-5 h-5 text-blue-600 mr-2" /><span className="font-semibold text-blue-800">Detalle por Tienda (Zona Norte)</span></div>{showNorteList ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}</button>
          {showNorteList && <div className="mt-4 space-y-2">{tiendasNorte.map((tienda, index) => (<div key={tienda.nombre}><button onClick={() => setActiveNorteStore(activeNorteStore === tienda.nombre ? null : tienda.nombre)} className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-md flex justify-between items-center"><span className="font-semibold">{tienda.nombre}</span>{activeNorteStore === tienda.nombre ? <ChevronUp /> : <ChevronDown />}</button>{activeNorteStore === tienda.nombre && (<div className="p-2 border-l-2 border-r-2 border-b-2 rounded-b-md border-slate-200"><DetailsTable dataSemanas={tienda.semanas} /><StoreSummaryChart data={getStoreSummaryDataForChart(tienda)} color={COLORS[index % COLORS.length]} /></div>)}</div>))}</div>}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button onClick={() => setShowSurList(!showSurList)} className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><div className="flex items-center"><Store className="w-5 h-5 text-green-600 mr-2" /><span className="font-semibold text-green-800">Detalle por Tienda (Zona Sur)</span></div>{showSurList ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-green-600" />}</button>
          {showSurList && <div className="mt-4 space-y-2">{tiendasSur.map((tienda, index) => (<div key={tienda.nombre}><button onClick={() => setActiveSurStore(activeSurStore === tienda.nombre ? null : tienda.nombre)} className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-md flex justify-between items-center"><span className="font-semibold">{tienda.nombre}</span>{activeSurStore === tienda.nombre ? <ChevronUp /> : <ChevronDown />}</button>{activeSurStore === tienda.nombre && (<div className="p-2 border-l-2 border-r-2 border-b-2 rounded-b-md border-slate-200"><DetailsTable dataSemanas={tienda.semanas} /><StoreSummaryChart data={getStoreSummaryDataForChart(tienda)} color={COLORS[(index + 1) % COLORS.length]} /></div>)}</div>))}</div>}
        </div>
      </div>

      {modalContent && <DetalleModal titulo={modalContent.titulo} data={modalContent.data} onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;