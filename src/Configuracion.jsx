// --- INICIO DEL ARCHIVO COMPLETO Y VERIFICADO: Configuracion.jsx ---
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';

const procesadorDeDatos = (datosCrudos, datosCuotas, mesSeleccionado) => {
  // --- FUNCIONES DE AYUDA ---
  const limpiarTexto = (texto) => (texto || '').toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const limpiarNumero = (valor) => {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const numero = parseFloat(String(valor).replace(/,/g, ''));
      return isNaN(numero) ? 0 : numero;
    }
    return 0;
  };
  const calcularPromedio = (datos, columna) => {
    const valores = (datos || []).map(fila => limpiarNumero(fila[columna])).filter(val => val > 0);
    if (valores.length === 0) return 0;
    return valores.reduce((acc, val) => acc + val, 0) / valores.length;
  };
  const calcularAlcance = (real, cuota) => (cuota > 0 ? real / cuota : 0);
  const getCustomWeek = (date) => {
    try {
      let fechaValida;
      if (typeof date === 'number') { fechaValida = new Date((date - 25569) * 86400 * 1000); } 
      else { fechaValida = new Date(date); }
      if (isNaN(fechaValida.getTime())) return null;
      const dayOfMonth = fechaValida.getDate();
      if (dayOfMonth <= 7) return 'semana1';
      if (dayOfMonth <= 14) return 'semana2';
      if (dayOfMonth <= 21) return 'semana3';
      return 'semana4';
    } catch { return null; }
  };

  // --- FILTRADO INICIAL ---
  const mesSeleccionadoLimpio = limpiarTexto(mesSeleccionado);
  const datosDelMes = (datosCrudos || []).filter(fila => limpiarTexto(fila['MES FACTURACION']) === mesSeleccionadoLimpio);
  const datosActivos = (datosDelMes || []).filter(fila => limpiarTexto(fila.ESTATUS) === 'terminada');
  const cuotasDelMes = (datosCuotas || []).filter(c => limpiarTexto(c.MES) === mesSeleccionadoLimpio);

  // --- LÓGICA COMPLETA PARA MASIVO ---
  const procesarDatosMasivo = () => {
    const datosBaseTiendasPropias = datosActivos.filter(fila => limpiarTexto(fila.REGION) === '1.-centro-cdmx' && limpiarTexto(fila['OPERACION PDV'])?.startsWith('t. propias'));
    const tiendasProcesadas = {};
    cuotasDelMes.forEach(cuotaFila => {
      const nombreTiendaOriginal = cuotaFila['PTO. DE VENTA'];
      const nombreTiendaLimpio = limpiarTexto(nombreTiendaOriginal);
      if (!nombreTiendaLimpio) return;
      tiendasProcesadas[nombreTiendaLimpio] = {
        nombre: nombreTiendaOriginal,
        zona: limpiarTexto(cuotaFila.ZONA),
        cuotas: { activaciones: limpiarNumero(cuotaFila['Cuota Activaciones']), renovaciones: limpiarNumero(cuotaFila['Cuota Renovaciones']), seguros: limpiarNumero(cuotaFila['Cuota Seguros']), empresarial: limpiarNumero(cuotaFila['Cuota Empresarial']) },
        semanas: { semana1: { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0, accessFee: 0, accessFeeCount: 0 }, semana2: { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0, accessFee: 0, accessFeeCount: 0 }, semana3: { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0, accessFee: 0, accessFeeCount: 0 }, semana4: { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0, accessFee: 0, accessFeeCount: 0 } }
      };
    });
    const datosMasivos = datosBaseTiendasPropias.filter(f => limpiarTexto(f['CATEGORIA DE VENTA']) === 'masivo');
    const datosEmpresarialesEnTiendas = datosBaseTiendasPropias.filter(f => limpiarTexto(f['CATEGORIA DE VENTA']) === 'empresarial');
    datosBaseTiendasPropias.forEach(fila => {
      const nombreTiendaLimpio = limpiarTexto(fila['PTO. DE VENTA']);
      if (!tiendasProcesadas[nombreTiendaLimpio]) return;
      const semana = getCustomWeek(fila['FECHA DE FACTURACION']);
      if (!semana) return;
      const tienda = tiendasProcesadas[nombreTiendaLimpio];
      const evento = limpiarTexto(fila.EVENTO);
      const categoria = limpiarTexto(fila['CATEGORIA DE VENTA']);
      if (categoria === 'masivo') {
        if (evento === 'activacion') tienda.semanas[semana].activaciones++;
        if (evento === 'renovacion') tienda.semanas[semana].renovaciones++;
        if (fila['SEGURO CAPTURADO']) tienda.semanas[semana].seguros++;
        const accessFee = limpiarNumero(fila['RENTA SIN IMPUESTOS']);
        if (accessFee > 0) { tienda.semanas[semana].accessFee += accessFee; tienda.semanas[semana].accessFeeCount++; }
      } else if (categoria === 'empresarial') {
        tienda.semanas[semana].empresarial++;
      }
    });
    const listaDeTiendas = Object.values(tiendasProcesadas);
    const activacionesRealesMasivo = datosMasivos.filter(f => limpiarTexto(f.EVENTO) === 'activacion');
    const detalleActivaciones = { 'Simple': activacionesRealesMasivo.filter(f => limpiarTexto(f.FAMILIA) === 'simple').length, 'Simple Plus': activacionesRealesMasivo.filter(f => limpiarTexto(f.FAMILIA) === 'simple plus').length, 'Premium': activacionesRealesMasivo.filter(f => limpiarTexto(f.FAMILIA) === 'premium').length, };
    const detalleEmpresariales = { 'Activación': datosEmpresarialesEnTiendas.filter(f => limpiarTexto(f.EVENTO) === 'activacion').length, 'Renovación': datosEmpresarialesEnTiendas.filter(f => limpiarTexto(f.EVENTO) === 'renovacion').length, };
    const detalleAccessFee = { 'Activación': calcularPromedio(activacionesRealesMasivo, 'RENTA SIN IMPUESTOS'), 'Renovación': calcularPromedio(datosMasivos.filter(f => limpiarTexto(f.EVENTO) === 'renovacion'), 'RENTA SIN IMPUESTOS'), };
    const calcularTotalesZona = (tiendasDeZona) => {
      const totales = { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0, accessFee: 0, accessFeeCount: 0, cuotas: { activaciones: 0, renovaciones: 0, seguros: 0, empresarial: 0 } };
      tiendasDeZona.forEach(t => {
        totales.cuotas.activaciones += t.cuotas.activaciones; totales.cuotas.renovaciones += t.cuotas.renovaciones; totales.cuotas.seguros += t.cuotas.seguros; totales.cuotas.empresarial += t.cuotas.empresarial;
        for (const sem of Object.values(t.semanas)) { totales.activaciones += sem.activaciones; totales.renovaciones += sem.renovaciones; totales.seguros += sem.seguros; totales.empresarial += sem.empresarial; totales.accessFee += sem.accessFee; totales.accessFeeCount += sem.accessFeeCount; }
      });
      return {
        activaciones: { actual: totales.activaciones, cuota: totales.cuotas.activaciones, alcance: calcularAlcance(totales.activaciones, totales.cuotas.activaciones) },
        renovaciones: { actual: totales.renovaciones, cuota: totales.cuotas.renovaciones, alcance: calcularAlcance(totales.renovaciones, totales.cuotas.renovaciones) },
        seguros: { actual: totales.seguros, cuota: totales.cuotas.seguros, alcance: calcularAlcance(totales.seguros, totales.cuotas.seguros) },
        empresarial: { actual: totales.empresarial, cuota: totales.cuotas.empresarial, alcance: calcularAlcance(totales.empresarial, totales.cuotas.empresarial) },
        accessFee: totales.accessFeeCount > 0 ? totales.accessFee / totales.accessFeeCount : 0,
      };
    };
    const resumenNorte = calcularTotalesZona(listaDeTiendas.filter(t => t.zona === 'norte'));
    const resumenSur = calcularTotalesZona(listaDeTiendas.filter(t => t.zona === 'sur'));
    const totalActivaciones = resumenNorte.activaciones.actual + resumenSur.activaciones.actual;
    const cuotaActivaciones = resumenNorte.activaciones.cuota + resumenSur.activaciones.cuota;
    const totalRenovaciones = resumenNorte.renovaciones.actual + resumenSur.renovaciones.actual;
    const cuotaRenovaciones = resumenNorte.renovaciones.cuota + resumenSur.renovaciones.cuota;
    const totalSeguros = resumenNorte.seguros.actual + resumenSur.seguros.actual;
    const cuotaSeguros = resumenNorte.seguros.cuota + resumenSur.seguros.cuota;
    const totalEmpresariales = resumenNorte.empresarial.actual + resumenSur.empresarial.actual;
    const cuotaEmpresarial = resumenNorte.empresarial.cuota + resumenSur.empresarial.cuota;
    const totalAccessFeeSuma = listaDeTiendas.reduce((acc, t) => acc + Object.values(t.semanas).reduce((sumSem, sem) => sumSem + sem.accessFee, 0), 0);
    const totalAccessFeeCuenta = listaDeTiendas.reduce((acc, t) => acc + Object.values(t.semanas).reduce((sumSem, sem) => sumSem + sem.accessFeeCount, 0), 0);
    return {
      totalActivaciones: { actual: totalActivaciones, cuota: cuotaActivaciones, alcance: calcularAlcance(totalActivaciones, cuotaActivaciones) },
      totalRenovaciones: { actual: totalRenovaciones, cuota: cuotaRenovaciones, alcance: calcularAlcance(totalRenovaciones, cuotaRenovaciones) },
      totalSeguros: { actual: totalSeguros, cuota: cuotaSeguros, alcance: calcularAlcance(totalSeguros, cuotaSeguros) },
      totalEmpresariales: { actual: totalEmpresariales, cuota: cuotaEmpresarial, alcance: calcularAlcance(totalEmpresariales, cuotaEmpresarial) },
      promedioAccessFeeGeneral: totalAccessFeeCuenta > 0 ? totalAccessFeeSuma / totalAccessFeeCuenta : 0,
      detallePorTienda: listaDeTiendas,
      resumenPorZona: { norte: resumenNorte, sur: resumenSur },
      detalleActivaciones, detalleEmpresariales, detalleAccessFee,
    };
  };

  const procesarDatosEmpresarial = () => {
    const datosEmpresarialesCrudos = datosActivos.filter(fila => {
      const operacionPdv = limpiarTexto(fila['OPERACION PDV']);
      const categoriaVenta = limpiarTexto(fila['CATEGORIA DE VENTA']);
      const region = limpiarTexto(fila.REGION);
      return region === '1.-centro-cdmx' && (operacionPdv === 'empresarial' || operacionPdv === 'subdistribuidor' || operacionPdv.startsWith('t. propias')) && categoriaVenta === 'empresarial';
    });

    if (datosEmpresarialesCrudos.length === 0) {
      return { totalActivaciones: {actual: 0, cuota: 0, alcance: 0}, totalRenovaciones: {actual: 0, cuota: 0, alcance: 0}, totalMix: {actual: 0, cuota: 0, alcance: 0}, promedioAccessFeeGeneral: 0, detalleActivaciones: {}, detalleRenovaciones: {}, detalleMix: {}, detallePorPtoVenta: [], rankingPtoVenta: [] };
    }
    
    const activaciones = datosEmpresarialesCrudos.filter(f => limpiarTexto(f.EVENTO) === 'activacion');
    const renovaciones = datosEmpresarialesCrudos.filter(f => limpiarTexto(f.EVENTO) === 'renovacion');
    
    const contarPorFamilia = (datos, familia) => {
        const familiaLimpia = limpiarTexto(familia);
        if (familiaLimpia === 'armalo negocios') {
            return datos.filter(f => {
                const fam = limpiarTexto(f.FAMILIA);
                return fam === 'armalo negocios' || fam === 'con todo';
            }).length;
        }
        return datos.filter(f => limpiarTexto(f.FAMILIA) === familiaLimpia).length;
    };
    
    const detalleActivaciones = { 'Armalo Negocios': contarPorFamilia(activaciones, 'armalo negocios'), 'Simple': contarPorFamilia(activaciones, 'simple') };
    const detalleRenovaciones = { 'Armalo Negocios': contarPorFamilia(renovaciones, 'armalo negocios'), 'Simple': contarPorFamilia(renovaciones, 'simple') };
    
    const datosSoloDeTiendasEmp = datosEmpresarialesCrudos.filter(f => limpiarTexto(f['OPERACION PDV']) === 'empresarial');
    const activacionesTiendasEmp = datosSoloDeTiendasEmp.filter(f => limpiarTexto(f.EVENTO) === 'activacion');
    
    detalleActivaciones['Tiendas Emp. (Armalo)'] = contarPorFamilia(activacionesTiendasEmp, 'armalo negocios');
    detalleActivaciones['Tiendas Emp. (Simple)'] = contarPorFamilia(activacionesTiendasEmp, 'simple');

    const promedioAccessFeeActivacion = calcularPromedio(activaciones, 'RENTA SIN IMPUESTOS');
    const promedioAccessFeeRenovacion = calcularPromedio(renovaciones, 'RENTA SIN IMPUESTOS');
    const detalleMix = { 'Activaciones': activaciones.length, 'Renovaciones': renovaciones.length };
    
    const cuotaActEmpresarial = cuotasDelMes.reduce((acc, c) => acc + (limpiarNumero(c['Cuota Act Empresarial']) || 0), 0);
    const cuotaRenEmpresarial = cuotasDelMes.reduce((acc, c) => acc + (limpiarNumero(c['Cuota Ren Empresarial']) || 0), 0);
    
    const ptoVentaAgrupado = datosEmpresarialesCrudos.reduce((acc, fila) => {
        const pto = fila['PTO. DE VENTA'] || 'Desconocido';
        if (!acc[pto]) { acc[pto] = { ptoVenta: pto, activaciones: 0, renovaciones: 0, mix: 0 }; }
        const evento = limpiarTexto(fila.EVENTO);
        if (evento === 'activacion') acc[pto].activaciones++;
        if (evento === 'renovacion') acc[pto].renovaciones++;
        acc[pto].mix = acc[pto].activaciones + acc[pto].renovaciones;
        return acc;
    }, {});

    const detallePorPtoVenta = Object.values(ptoVentaAgrupado);
    const rankingPtoVenta = [...detallePorPtoVenta].sort((a, b) => b.mix - a.mix);

    return {
      totalActivaciones: { actual: activaciones.length, cuota: cuotaActEmpresarial, alcance: calcularAlcance(activaciones.length, cuotaActEmpresarial) },
      totalRenovaciones: { actual: renovaciones.length, cuota: cuotaRenEmpresarial, alcance: calcularAlcance(renovaciones.length, cuotaRenEmpresarial) },
      totalMix: { actual: activaciones.length + renovaciones.length, cuota: cuotaActEmpresarial + cuotaRenEmpresarial, alcance: calcularAlcance(activaciones.length + renovaciones.length, cuotaActEmpresarial + cuotaRenEmpresarial) },
      promedioAccessFeeGeneral: calcularPromedio(datosEmpresarialesCrudos, 'RENTA SIN IMPUESTOS'),
      detalleActivaciones,
      detalleRenovaciones,
      detalleMix,
      promedioAccessFeeActivacion,
      promedioAccessFeeRenovacion,
      detallePorPtoVenta,
      rankingPtoVenta,
    };
  };

  return { masivoData: procesarDatosMasivo(), empresarialData: procesarDatosEmpresarial() };
};

const Configuracion = () => {
  const [reporteFile, setReporteFile] = useState(null);
  const [cuotasFile, setCuotasFile] = useState(null);
  const [mes, setMes] = useState('junio');
  const [mensaje, setMensaje] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessData = () => {
    if (!reporteFile || !cuotasFile) { setMensaje('Por favor, carga ambos archivos para procesar.'); return; }
    setIsProcessing(true);
    setMensaje('Procesando datos, por favor espera...');
    const readerReporte = new FileReader();
    readerReporte.onload = (e) => {
      const readerCuotas = new FileReader();
      readerCuotas.onload = (ev) => {
        try {
          const workbookReporte = XLSX.read(e.target.result, { type: 'binary', cellDates: true });
          const jsonCrudo = XLSX.utils.sheet_to_json(workbookReporte.Sheets[workbookReporte.SheetNames[0]], { range: 4 });
          const workbookCuotas = XLSX.read(ev.target.result, { type: 'binary' });
          const jsonCuotas = XLSX.utils.sheet_to_json(workbookCuotas.Sheets[workbookCuotas.SheetNames[0]], { range: 2 });
          const { masivoData, empresarialData } = procesadorDeDatos(jsonCrudo, jsonCuotas, mes);
          localStorage.setItem('masivoDashboardData', JSON.stringify(masivoData));
          localStorage.setItem('empresarialDashboardData', JSON.stringify(empresarialData));
          setMensaje(`¡Éxito! Datos de '${mes}' procesados y guardados.`);
        } catch (error) {
          console.error("Error detallado:", error);
          setMensaje('Hubo un error al leer o procesar los archivos. Revisa la consola (F12).');
        } finally {
          setIsProcessing(false);
        }
      };
      readerCuotas.readAsBinaryString(cuotasFile);
    };
    readerReporte.readAsBinaryString(reporteFile);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-slate-800 text-center">Panel de Configuración</h1>
      <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-700">1. Selecciona el Mes a Procesar</h2>
        <p className="mt-2 text-slate-600">Escribe el nombre del mes que quieres analizar (ej. junio, julio, etc.).</p>
        <input type="text" value={mes} onChange={(e) => setMes(e.target.value.toLowerCase())} className="mt-4 w-full md:w-1/3 p-2 border border-slate-300 rounded-md" placeholder="ej. junio" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col items-center text-center">
          <UploadCloud className="w-12 h-12 text-blue-500" /><h2 className="text-2xl font-semibold text-slate-700 mt-4">2. Cargar Reporte General</h2>
          <p className="mt-2 text-slate-600">El archivo de Excel con todas las transacciones.</p>
          <label className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <span>{reporteFile ? "Archivo Cargado" : "Seleccionar Archivo..."}</span>
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={(e) => setReporteFile(e.target.files[0])} />
          </label>
          {reporteFile && <p className="mt-2 text-sm text-green-600 flex items-center gap-2"><CheckCircle size={16} /> {reporteFile.name}</p>}
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col items-center text-center">
          <UploadCloud className="w-12 h-12 text-green-500" /><h2 className="text-2xl font-semibold text-slate-700 mt-4">3. Cargar Archivo de Cuotas</h2>
          <p className="mt-2 text-slate-600">El Excel con las metas mensuales por tienda.</p>
          <label className="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            <span>{cuotasFile ? "Archivo Cargado" : "Seleccionar Archivo..."}</span>
            <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={(e) => setCuotasFile(e.target.files[0])} />
          </label>
          {cuotasFile && <p className="mt-2 text-sm text-green-600 flex items-center gap-2"><CheckCircle size={16} /> {cuotasFile.name}</p>}
        </div>
      </div>
      <div className="text-center">
        <button onClick={handleProcessData} disabled={!reporteFile || !cuotasFile || isProcessing} className="flex items-center justify-center gap-3 mx-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-lg shadow-lg hover:bg-slate-700 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed">
          <BarChart2 />
          {isProcessing ? "Procesando..." : "Procesar y Guardar Datos"}
        </button>
        {mensaje && (<p className={`mt-4 text-sm font-medium flex items-center justify-center gap-2 ${mensaje.startsWith('¡Éxito!') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje.startsWith('¡Éxito!') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {mensaje}
        </p>)}
      </div>
    </div>
  );
};
// --- FIN DEL ARCHIVO COMPLETO Y VERIFICADO: Configuracion.jsx ---
export default Configuracion;
