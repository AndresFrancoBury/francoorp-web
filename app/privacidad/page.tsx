export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#f0ede6', fontFamily: "'DM Sans', sans-serif", padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <a href="/" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(240,237,230,0.4)', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Volver al inicio</a>

        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#c9b99a', marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.05, color: '#f0ede6', marginBottom: 16 }}>Política de Privacidad</h1>
        <p style={{ fontSize: 14, color: 'rgba(240,237,230,0.45)', marginBottom: 56 }}>Última actualización: abril de 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 40 }}>

          <S title="1. Quiénes somos">
            Francoorp es una agencia digital con sede en Bogotá, Colombia, especializada en producción audiovisual, desarrollo web e inteligencia artificial. Operamos a través del sitio web <strong style={{ color: '#c9b99a' }}>www.francoorp.com</strong>. Para consultas sobre esta política escríbenos a <a href="mailto:gerencia@francoorp.com" style={{ color: '#c9b99a' }}>gerencia@francoorp.com</a>.
          </S>

          <S title="2. Datos que recopilamos">
            Recopilamos los siguientes datos cuando usas nuestra plataforma: nombre completo, cédula o NIT, correo electrónico, número de teléfono, número de WhatsApp y dirección. Cuando conectas tu canal de YouTube, accedemos a nombre del canal, foto de perfil, número de suscriptores, cantidad de videos y vistas totales — únicamente con tu autorización expresa. También recopilamos los links de material audiovisual, instrucciones de edición y comprobantes de pago necesarios para prestar el servicio.
          </S>

          <S title="3. Para qué usamos tus datos">
            Usamos tu información exclusivamente para gestionar y entregar los servicios contratados, generar cuentas de cobro, enviarte notificaciones sobre el estado de tus proyectos vía WhatsApp, y personalizar tu experiencia en la plataforma. <strong>No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales.</strong>
          </S>

          <S title="4. Servicios de terceros">
            Para operar nuestra plataforma usamos: <strong>Supabase</strong> (almacenamiento y autenticación), <strong>Twilio</strong> (notificaciones WhatsApp), <strong>Google OAuth / YouTube Data API</strong> (autenticación y datos del canal con tu autorización) y <strong>Vercel</strong> (alojamiento). Cada uno tiene su propia política de privacidad.
          </S>

          <S title="5. Datos de YouTube">
            Cuando conectas tu canal de YouTube accedemos únicamente a información pública: nombre, foto de perfil, suscriptores, videos y vistas. Estos datos se muestran solo en tu perfil dentro de la plataforma. No publicamos ni modificamos el contenido de tu canal. Puedes revocar este acceso en cualquier momento desde tu perfil o desde <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: '#c9b99a' }}>myaccount.google.com/permissions</a>.
          </S>

          <S title="6. Retención de datos">
            Conservamos tus datos mientras mantengas una relación activa con Francoorp. Si solicitas la eliminación de tu cuenta, borraremos tus datos en un plazo de 30 días hábiles, excepto los que debamos conservar por obligaciones legales o fiscales.
          </S>

          <S title="7. Tus derechos">
            De acuerdo con la Ley 1581 de 2012 de Colombia, tienes derecho a conocer, actualizar y rectificar tus datos personales; solicitar prueba de la autorización otorgada; ser informado sobre el uso de tus datos; revocar la autorización y solicitar la supresión de tus datos; y acceder gratuitamente a tus datos personales. Para ejercer cualquiera de estos derechos escríbenos a <a href="mailto:gerencia@francoorp.com" style={{ color: '#c9b99a' }}>gerencia@francoorp.com</a>.
          </S>

          <S title="8. Seguridad">
            Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o alteración. Toda la comunicación entre tu navegador y nuestra plataforma está cifrada mediante HTTPS.
          </S>

          <S title="9. Cambios a esta política">
            Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos a través del correo electrónico registrado en tu cuenta. El uso continuado de la plataforma después de dichos cambios constituye tu aceptación de la política actualizada.
          </S>

          <S title="10. Contacto">
            <span>Si tienes preguntas sobre esta política, contáctanos en:</span>
            <div style={{ marginTop: 16, padding: '20px 24px', border: '1px solid rgba(201,185,154,0.2)', borderRadius: 12, background: 'rgba(201,185,154,0.04)' }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#f0ede6', marginBottom: 8 }}>Francoorp</p>
              <p style={{ fontSize: 14, color: 'rgba(240,237,230,0.5)', marginBottom: 4 }}>Bogotá, Colombia</p>
              <a href="mailto:gerencia@francoorp.com" style={{ fontSize: 14, color: '#c9b99a', textDecoration: 'none' }}>gerencia@francoorp.com</a>
            </div>
          </S>

        </div>
      </div>
    </div>
  )
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid rgba(240,237,230,0.08)', paddingTop: 32 }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: '#f0ede6', marginBottom: 16 }}>{title}</h2>
      <div style={{ fontSize: 15, color: 'rgba(240,237,230,0.6)', lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}
