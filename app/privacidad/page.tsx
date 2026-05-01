import GlobalMenu from "@/components/GlobalMenu";

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 min-h-screen">
      <GlobalMenu />
      <header className="mb-16 mt-12">
        <h1 className="font-serif text-4xl mb-8">Política de Privacidad</h1>
        <p className="tag-text !text-accent">CONTENIDO EN DESARROLLO</p>
      </header>
      <div className="prose prose-lg content-serif">
        <p>Estamos trabajando en nuestra política de privacidad para asegurar la máxima transparencia en el tratamiento de tus datos.</p>
      </div>
    </div>
  );
}
