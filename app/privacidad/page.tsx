import GlobalMenu from "@/components/GlobalMenu";

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 min-h-screen">
      <GlobalMenu />
      <header className="mb-16 mt-12">
        <h1 className="font-serif text-4xl mb-8">Política de Privacidad y Términos Legales</h1>
        <p className="tag-text !text-accent">EXENCIÓN GLOBAL DE RESPONSABILIDAD</p>
      </header>
      <div className="prose prose-lg content-serif text-white/80 space-y-6">
        <p>
          Este sitio web, "Margen de Error", es un proyecto de periodismo científico independiente y exploración de datos. Toda la información, artículos, podcasts y visualizaciones presentados aquí tienen un propósito estrictamente divulgativo, periodístico y educativo.
        </p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Exención Global de Responsabilidad</h2>
        <p>
          Al acceder, navegar o utilizar este sitio web, usted acepta expresamente que lo hace bajo su propio riesgo. El autor y los creadores de "Margen de Error" se eximen, en la máxima medida permitida por la ley aplicable en cualquier jurisdicción global, de toda responsabilidad civil, penal, administrativa, contractual o extracontractual derivada del uso, interpretación o aplicación de la información aquí contenida.
        </p>
        <p>
          No garantizamos la exactitud absoluta, integridad, actualidad o idoneidad de los contenidos para ningún propósito particular. Nada de lo publicado en este sitio web debe interpretarse como asesoramiento médico, legal, financiero, profesional o de cualquier otra índole. Ante cualquier decisión crítica, sugerimos consultar siempre con un profesional certificado en la materia correspondiente.
        </p>
        <p>
          Nos exoneramos expresamente de cualquier tipo de responsabilidad por daños directos, indirectos, incidentales, consecuentes, punitivos o de cualquier otra naturaleza (incluyendo, sin limitación, la pérdida de datos, ingresos o lucro cesante) que pudieran surgir del uso o la imposibilidad de uso de esta plataforma, así como de cualquier error, omisión o inexactitud en sus contenidos, o fallos técnicos del sitio.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Enlaces a Terceros</h2>
        <p>
          Este sitio contiene enlaces a plataformas de terceros (como Spotify, redes sociales, fuentes académicas y sitios de noticias). No tenemos control sobre el contenido, políticas de privacidad o prácticas de dichos sitios de terceros, y por lo tanto, declinamos toda responsabilidad sobre los mismos. El uso de esos enlaces es bajo el propio riesgo y criterio del usuario.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Privacidad y Tratamiento de Datos</h2>
        <p>
          "Margen de Error" no recopila de forma activa datos personales sensibles de sus visitantes. Cualquier información técnica recabada automáticamente por los servidores (como direcciones IP, tipo de navegador, tiempo de visita) o mediante herramientas de analítica estándar, se utiliza exclusivamente para fines estadísticos, de mantenimiento técnico y mejora de la experiencia de usuario.
        </p>
        <p>
          No vendemos, comercializamos ni transferimos a terceros ningún tipo de información personal, si la hubiera, salvo que exista una obligación legal ineludible dictada por una autoridad competente. Al continuar navegando, usted consiente el uso de cookies y tecnologías similares necesarias para el funcionamiento y analítica básica del sitio web.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">Modificaciones</h2>
        <p>
          Nos reservamos el derecho exclusivo de modificar, suspender, eliminar o actualizar cualquier contenido de esta web, así como estos términos legales y de privacidad, en cualquier momento, sin previo aviso y sin asumir ninguna obligación por ello.
        </p>
      </div>
    </div>
  );
}
