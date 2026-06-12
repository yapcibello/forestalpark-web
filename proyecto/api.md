# API — forestalpark-web

No aplica (parcialmente) — el sitio es estático y no expone API propia, con una única excepción prevista:

## Endpoint de formularios (pendiente — fase 12)

```
POST /api/contacto.php
```

**Descripción**: endpoint PHP en el hosting que recibe el formulario de contacto y lo envía por SMTP a `reservas@forestalparktenerife.es` (patrón PHPMailer de smedialab-web). Se implementará en la fase deploy-baseline.

**Parámetros** (provisional, se concretará con el formulario real migrado del WP):

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| nombre | string | sí | Nombre del remitente |
| email | string | sí | Email de contacto |
| mensaje | string | sí | Cuerpo de la consulta |

**Credenciales**: `api/config.local.php` (solo en servidor, gitignored).

## Servicios externos consumidos

- **Turitop**: iframes de reserva embebidos (no es API consumida por nuestro código — embed client-side preservado del WP original).
