<?php
/**
 * Endpoint de formularios — Forestal Park Tenerife (sitio estático Astro).
 *
 * Sustituye al admin-ajax.php de WordPress que dejará de existir tras la
 * migración. Recibe los campos de los formularios Fusion del sitio y los
 * envía por SMTP al buzón de reservas.
 *
 * Requisitos:
 *  - PHPMailer en el servidor (vendor/) o mail() como fallback.
 *  - Credenciales SMTP en api/config.local.php (NO versionado — ver .gitignore).
 *
 * Los formularios del sitio deben apuntar su action a /api/contacto.php
 * (repunte controlado en la pasada de formularios — ver deploy_baseline.md).
 */

header('Content-Type: application/json; charset=utf-8');

// Solo POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Config local (SMTP host/user/pass, destino). No versionada.
$configFile = __DIR__ . '/config.local.php';
$config = is_file($configFile) ? require $configFile : [];
$to       = $config['to']        ?? 'reservas@forestalparktenerife.es';
$fromAddr = $config['from']      ?? 'web@forestalparktenerife.es';

// Honeypot anti-spam (campo oculto que un humano no rellena).
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['ok' => true]); // fingir éxito al bot
    exit;
}

// Saneado de los campos habituales de los formularios Fusion.
function field(string ...$keys): string {
    foreach ($keys as $k) {
        if (!empty($_POST[$k])) {
            return trim(filter_var($_POST[$k], FILTER_SANITIZE_FULL_SPECIAL_CHARS));
        }
    }
    return '';
}

$nombre  = field('your_name', 'nombre', 'name');
$email   = field('your_email', 'email');
$mensaje = field('mensaje', 'description', 'message');
$pagina  = field('pagina_origen') ?: ($_SERVER['HTTP_REFERER'] ?? '');

// Validación mínima.
$emailValido = filter_var($email, FILTER_VALIDATE_EMAIL);
if ($nombre === '' || !$emailValido || $mensaje === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'campos_invalidos']);
    exit;
}

$asunto = 'Contacto web — ' . $nombre;
$cuerpo = "Nombre: $nombre\n"
        . "Email: $email\n"
        . "Página: $pagina\n\n"
        . "Mensaje:\n$mensaje\n";

$enviado = false;

// Preferir PHPMailer + SMTP si está disponible y configurado.
$autoload = __DIR__ . '/vendor/autoload.php';
if (is_file($autoload) && !empty($config['smtp_host'])) {
    require $autoload;
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $config['smtp_host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['smtp_user'];
        $mail->Password   = $config['smtp_pass'];
        $mail->SMTPSecure = $config['smtp_secure'] ?? 'tls';
        $mail->Port       = (int)($config['smtp_port'] ?? 587);
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom($fromAddr, 'Web Forestal Park');
        $mail->addAddress($to);
        $mail->addReplyTo($email, $nombre);
        $mail->Subject = $asunto;
        $mail->Body    = $cuerpo;
        $mail->send();
        $enviado = true;
    } catch (Throwable $e) {
        $enviado = false;
    }
}

// Fallback a mail() del servidor.
if (!$enviado) {
    $headers = "From: $fromAddr\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    $enviado = @mail($to, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, $headers);
}

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'envio_fallido']);
}
