# PYMECare — Documentación Funcional

> Plataforma web de gestión de acompañantes/cuidadores y pacientes para empresas de salud domiciliaria.

---

## Links del proyecto

- 📁 [Drive](https://drive.google.com/drive/folders/1bZVLTy_jvrUb2XJhWf0nzNu-cTIqYUMU?usp=sharing)
- 📋 [Trello](https://trello.com/b/Lmtk8DE4/simulacion-laboral-febrero-2026)
- 🤖 [GitHub](https://github.com/No-Country-simulation/S02-26-Equipo-08-Web)

---

## Contexto y origen del problema

Una PYME del sector salud domiciliaria gestionaba toda su operación de forma manual: planillas de Excel para registrar pacientes y horas trabajadas, y grupos de WhatsApp por paciente para coordinar a los cuidadores. Este modelo presentaba múltiples problemas:

- Información dispersa y difícil de consolidar.
- Alto riesgo de errores humanos en el cálculo de horas y pagos.
- Falta de trazabilidad sobre quién atendió a cada paciente y cuándo.
- Imposibilidad de escalar sin aumentar el caos operativo.
- Sin visibilidad de métricas para tomar decisiones de gestión.

**PYMECare** nace para digitalizar y centralizar toda esa operación en una sola plataforma.

---

## Objetivo de la aplicación

Proveer una plataforma web que permita a la empresa:

1. Gestionar altas, bajas y modificaciones de pacientes y cuidadores.
2. Registrar y hacer seguimiento de las guardias realizadas.
3. Calcular automáticamente las horas trabajadas para procesar pagos mensuales.
4. Ejecutar pagos a cuentas bancarias o Mercado Pago de los cuidadores.
5. Permitir a los cuidadores autogestionar su registro y cargar sus informes.
6. Brindar a las familias visibilidad sobre la atención de sus seres queridos.
7. Ofrecer métricas de gestión al equipo administrativo.

---

## Usuarios de la plataforma

La aplicación contempla tres tipos de usuarios con distintos permisos y vistas:

### Administración (PYME)
El equipo interno de la empresa. Tiene acceso total a la plataforma.

- Aprobar o rechazar el registro de nuevos cuidadores.
- Gestionar el alta, baja y modificación de pacientes.
- Asignar cuidadores a pacientes según disponibilidad.
- Visualizar informes de horas trabajadas por cuidador y por paciente.
- Procesar pagos mensuales a través de la pasarela integrada.
- Ver métricas generales del negocio (panel de control / dashboard).
- Desbloquear cuentas de usuarios con acceso restringido.

---

### Acompañante / Cuidador
Profesional de salud domiciliaria registrado en la plataforma.

- Registrarse en la aplicación adjuntando la documentación requerida (a confirmar por administración).
- Ver los pacientes que tiene asignados.
- Registrar informes y horas trabajadas al finalizar cada guardia.
- Consultar su historial de guardias y pagos recibidos.

---

### Familiar del paciente
Familiar o representante del paciente.

- Acceder a la información del paciente con quien tiene vínculo.
- Visualizar las guardias realizadas y quién atendió a su familiar.
- Consultar los informes cargados por los cuidadores.

---

## Funcionalidades principales

### Gestión de pacientes
- Alta de nuevos pacientes con datos personales, diagnóstico, obra social y número de afiliado.
- Modificación de datos existentes.
- Baja o desactivación del registro.
- Visualización en formato de tarjetas con acceso al detalle.

### Gestión de cuidadores
- Registro de nuevos cuidadores con documentación adjunta.
- Revisión y aprobación/rechazo por parte de administración.
- Modificación de datos y estado de la cuenta.
- Asociación de datos bancarios (CBU, CVU, alias) para pagos.

### Gestión de usuarios y accesos
- Control de estados: Pendiente de aprobación, Activo, Rechazado, Desactivado.
- Historial de intentos de acceso fallidos.
- Desbloqueo manual de cuentas con registro de auditoría.
- Filtros de búsqueda por rol, estado, nombre y fechas.

### Registro de guardias
- Cada guardia registra el cuidador, el paciente, la fecha, hora de inicio y hora de fin.
- Cálculo de horas trabajadas por guardia.

### Informes de horas trabajadas
- Consolidado de horas por cuidador y por período.
- Consolidado de horas por paciente.
- Base para el cálculo de liquidaciones mensuales.

### Pagos a cuidadores *(funcionalidad prevista)*
- Generación del monto a pagar según horas registradas y valor por hora.
- Ejecución del pago a través de pasarela integrada (cuenta bancaria o Mercado Pago).
- Historial de pagos realizados.

### Panel de control (Dashboard) — Administración
- Métricas clave del negocio: cantidad de pacientes activos, cuidadores activos, guardias del período, etc.
- Indicadores para tomar decisiones operativas.

---

## Flujo principal de uso

```
1. El cuidador se registra en la plataforma y adjunta su documentación.
       ↓
2. Administración revisa el perfil y lo aprueba o rechaza.
       ↓
3. Administración da de alta al paciente y asigna el cuidador correspondiente.
       ↓
4. El cuidador realiza la guardia y carga el informe con horas trabajadas.
       ↓
5. Administración consulta el reporte mensual de horas por cuidador.
       ↓
6. Administración procesa el pago al cuidador a través de la plataforma.
       ↓
7. El familiar puede ver en todo momento quién atendió a su ser querido y cuándo.
```

---

## Estado de las funcionalidades

| Funcionalidad | Estado |
|---|---|
| Login y autenticación con roles | Implementado |
| Alta de cuidadores | Implementado |
| Alta de pacientes | Implementado |
| Alta de familiares | Implementado |
| Listado y filtros de usuarios | Implementado |
| Detalle de usuario por rol | Implementado |
| Desbloqueo de cuentas con auditoría | Implementado |
| Grid de pacientes y cuidadores | Implementado |
| Dashboard con métricas | Implementado (en desarrollo) |
| Edición y baja de registros | Pendiente |
| Gestión de guardias | Pendiente |
| Informes de horas trabajadas | Pendiente |
| Procesamiento de pagos | Pendiente |
| Servicio de correos electrónicos | Pendiente |
| Carga de documentación por cuidador | Pendiente |

---

## Equipo

| Nombre | Rol | LinkedIn |
|---|---|---|
| Lucas Moix | Líder del proyecto | [LinkedIn](https://www.linkedin.com/in/lucas-moix/) |
| Erica Castro | QA | [LinkedIn](https://www.linkedin.com/in/erica-castro-0687b3168/) |
| Adrian Mourad | Desarrollador | [LinkedIn](https://www.linkedin.com/in/adrian-mourad-62a906279/) |
| Nicolas Ventosilla | Desarrollador | [LinkedIn](https://www.linkedin.com/in/nicolasventosilla/) |

---

*Proyecto desarrollado en el marco de la simulación laboral No Country — Febrero 2026.*
