import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const procesadorDeDatos = (datosCrudos) => {
  // --- Funciones de limpieza y normalización ---
  const limpiarTexto = (texto) => {
    if (typeof texto !== 'string') return '';
    return texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const limpiarNumero = (valor) => {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const numero = parseFloat(valor.replace(/,/g, ''));
      return isNaN(numero) ? 0 : numero;
    }
    return 0;
  };

  // 1. FILTRO MAESTRO UNIFICADO
  const datosActivos = datosCrudos.filter(fila => limpiarTexto(fila.ESTATUS) === 'terminada');
  const datosBaseTiendasPropias = datosActivos.filter(fila =>
    limpiarTexto(fila.REGION) === '1.-centro-cdmx' &&
    limpiarTexto(fila['OPERACION PDV'])?.startsWith('t. propias')
  );

  // --- Lógica de Zonas ---
  const tiendasZonaNorte = [
    'chedraui eduardo molina', 'exp chedraui anfora', 'exp cosmopol 2',
    'exp ksk patio texcoco', 'exp naucalpan', 'exp tda cdmx multiplaza aragon',
    'exp town center nicolas romero dfn'
  ].map(limpiarTexto);

  const filasNorte = datosBaseTiendasPropias.filter(fila => tiendasZonaNorte.includes(limpiarTexto(fila['PTO. DE VENTA'])));
  const filasSur = datosBaseTiendasPropias.filter(fila => !tiendasZonaNorte.includes(limpiarTexto(fila['PTO. DE VENTA'])));

  const calcularMetricas = (datos) => {
    const masivo = datos.filter(f => limpiarTexto(f['CATEGORIA DE VENTA']) === 'masivo');
    const empresarial = datos.filter(f => limpiarTexto(f['CATEGORIA DE VENTA']) === 'empresarial');
    const activaciones = masivo.filter(f => limpiarTexto(f.EVENTO) === 'activacion').length;
    const renovaciones = masivo.filter(f => limpiarTexto(f.EVENTO) === 'renovacion').length;
    const seguros = masivo.filter(f => f['SEGURO CAPTURADO']).length;
    const totalEmpresariales = empresarial.length;
    return [
      { metric: 'Activaciones', total: activaciones },
      { metric: 'Renovaciones', total: renovaciones },
      { metric: 'Seguros', total: seguros },
      { metric: 'Empresarial', total: totalEmpresariales },
    ];
  };

  const resumenPorZona = { norte: calcularMetricas(filasNorte), sur: calcularMetricas(filasSur) };

  // --- Cálculos Globales ---
  const datosMasivos = datosBaseTiendasPropias.filter(fila => limpiarTexto(fila['CATEGORIA DE VENTA']) === 'masivo');
  const activacionesMasivo = datosMasivos.filter(fila => limpiarTexto(fila.EVENTO) === 'activacion');
  const renovacionesMasivo = datosMasivos.filter(fila => limpiarTexto(fila.EVENTO) === 'renovacion');

  const totalActivaciones = activacionesMasivo.length;
  const detalleActivaciones = { 'Simple': activacionesMasivo.filter(fila => limpiarTexto(fila.FAMILIA) === 'simple').length, 'Simple Plus': activacionesMasivo.filter(fila => limpiarTexto(fila.FAMILIA) === 'simple plus').length };
  const totalRenovaciones = renovacionesMasivo.length;
  const seguros = datosMasivos.filter(fila => fila['SEGURO CAPTURADO']);
  const totalSeguros = seguros.length;

  const calcularPromedio = (datos, columna) => { const valores = datos.map(fila => limpiarNumero(fila[columna])).filter(val => val > 0); if (valores.length === 0) return 0; const suma = valores.reduce((acc, val) => acc + val, 0); return suma / valores.length; };

  // Promedio General para la tarjeta principal (Activaciones + Renovaciones)
  const activacionesYRenovacionesMasivo = [...activacionesMasivo, ...renovacionesMasivo];
  const promedioAccessFeeGeneral = calcularPromedio(activacionesYRenovacionesMasivo, 'RENTA SIN IMPUESTOS');

  // Promedios separados para el detalle del modal
  const promedioAccessFeeActivacion = calcularPromedio(activacionesMasivo, 'RENTA SIN IMPUESTOS');
  const promedioAccessFeeRenovacion = calcularPromedio(renovacionesMasivo, 'RENTA SIN IMPUESTOS');

  const datosEmpresariales = datosBaseTiendasPropias.filter(fila => limpiarTexto(fila['CATEGORIA DE VENTA']) === 'empresarial');
  const activacionesEmpresariales = datosEmpresariales.filter(fila => limpiarTexto(fila.EVENTO) === 'activacion');
  const renovacionesEmpresariales = datosEmpresariales.filter(fila => limpiarTexto(fila.EVENTO) === 'renovacion');
  const detalleEmpresariales = { Activacion: { total: activacionesEmpresariales.length, Simple: activacionesEmpresariales.filter(f => limpiarTexto(f.FAMILIA) === 'simple').length, 'Simple Plus': activacionesEmpresariales.filter(f => limpiarTexto(f.FAMILIA) === 'simple plus').length, 'Armalo Negocios': activacionesEmpresariales.filter(f => limpiarTexto(f.FAMILIA) === 'armalo negocios').length }, Renovacion: { total: renovacionesEmpresariales.length, Simple: renovacionesEmpresariales.filter(f => limpiarTexto(f.FAMILIA) === 'simple').length, 'Simple Plus': renovacionesEmpresariales.filter(f => limpiarTexto(f.FAMILIA) === 'simple plus').length, 'Armalo Negocios': renovacionesEmpresariales.filter(f => limpiarTexto(f.FAMILIA) === 'armalo negocios').length } };
  const totalEmpresariales = detalleEmpresariales.Activacion.total + detalleEmpresariales.Renovacion.total;

  return {
    totalActivaciones,
    detalleActivaciones,
    totalRenovaciones,
    totalSeguros,
    promedioAccessFeeGeneral,
    promedioAccessFeeActivacion,
    promedioAccessFeeRenovacion,
    totalEmpresariales,
    detalleEmpresariales,
    resumenPorZona,
    filasDetalladas: datosBaseTiendasPropias,
  };
};

const Configuracion = () => {
  const [datosProcesados, setDatosProcesados] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');

  const handleFileUpload = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setNombreArchivo(archivo.name);
    setMensaje('Procesando archivo, por favor espera...');
    setDatosProcesados(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const dataAsArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const dataSinMetadatos = dataAsArray.slice(4);
        const headers = dataSinMetadatos[0];
        const dataRows = dataSinMetadatos.slice(1);

        const jsonCrudo = dataRows.map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        const resultados = procesadorDeDatos(jsonCrudo);
        setDatosProcesados(resultados);
        localStorage.setItem('dashboardData', JSON.stringify(resultados));
        setMensaje(`¡Éxito! Archivo procesado y guardado. Ya puedes ir a la pestaña de Dashboard.`);
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        setMensaje('Hubo un error al leer el archivo. Revisa el formato y las columnas.');
      }
    };
    reader.readAsBinaryString(archivo);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800">Panel de Configuración</h1>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-700">1. Cargar Reporte de Datos</h2>
        <p className="mt-2 text-slate-600">
          Selecciona el archivo de Excel. El sistema aplicará las reglas de negocio y calculará los totales.
        </p>
        <label className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <span>Seleccionar Archivo...</span>
          <input
            type="file"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />
        </label>
        {nombreArchivo && <p className="mt-2 text-sm">Archivo cargado: <strong>{nombreArchivo}</strong></p>}
        {mensaje && <p className="mt-2 text-sm font-medium text-gray-700">{mensaje}</p>}
      </div>
      {datosProcesados && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700">Resultados del Procesamiento</h2>
          <div className="mt-4 font-mono text-sm bg-slate-50 p-4 rounded overflow-x-auto">
            <pre>
              {JSON.stringify(datosProcesados, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracion;