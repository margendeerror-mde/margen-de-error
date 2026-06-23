const fs = require('fs');

const scriptText = `En 1969, un ejecutivo de una tabacalera escribió una frase interna que resumía una de las estrategias de comunicación más efectivas del último siglo.
“La duda es nuestro producto.”
No era una declaración pública.
No era un slogan.
Era un memorando interno de Brown & Williamson, una de las grandes tabacaleras estadounidenses.
La frase se hizo pública décadas después, durante los juicios contra la industria.
Pero para entonces, la estrategia ya había sobrevivido al tabaco.
Porque las tabacaleras descubrieron algo importante.
No necesitaban demostrar que fumar era seguro.
Solo necesitaban impedir que existiera certeza de que hacía daño.
Para los años cincuenta, la evidencia que vinculaba el cigarrillo con el cáncer de pulmón empezaba a volverse difícil de ignorar.
Los estudios se acumulaban.
Las asociaciones aparecían una y otra vez.
Y en 1964, el informe del Surgeon General de Estados Unidos fue concluyente:
Fumar mata.
Pero la industria entendió rápidamente que refutar toda esa evidencia iba a ser casi imposible.
Entonces eligió otra estrategia.
No atacar directamente los hechos.
Atacar la sensación de consenso.
Cada nuevo estudio era respondido con otro estudio.
Cada conclusión con una objeción.
Cada consenso con una entrevista diciendo que todavía faltaban datos.
Siempre había una duda pendiente.
Un mecanismo no completamente explicado.
Una variable más por estudiar.
Una razón para esperar.
La discusión nunca terminaba.
Y mientras el debate seguía abierto…
el negocio podía seguir funcionando.
La estrategia era sofisticada porque imitaba perfectamente el lenguaje del escepticismo científico legítimo.
Después de todo, la ciencia funciona cuestionando evidencia.
Exigiendo mejores estudios.
Replicando resultados.
Discutiendo resultados ambiguos.
Desde afuera, era difícil distinguir entre crítica científica real…
y manufactura deliberada de incertidumbre.
Ese era el punto.
Y muchos de los científicos involucrados no eran farsantes.
Algunos tenían carreras reales.
Papers reales.
Credenciales impecables.
No usaban teorías absurdas.
No hablaban como conspiranoicos.
Hablaban exactamente como científicos.
Y eso hacía que todo fuera mucho más difícil de detectar.
La estrategia no necesitaba convencer a todo el mundo de que el tabaco era seguro.
Solo necesitaba producir suficiente confusión como para impedir una conclusión social clara.
Porque la mayoría de las personas no necesita certeza absoluta para actuar.
Pero sí necesita sentir que existe consenso.
Y destruir esa sensación puede ser suficiente.
Si el público percibe que los expertos siguen discutiendo…
entonces cualquier regulación parece apresurada.
Cualquier alarma parece exagerada.
Cualquier decisión puede posponerse.
La incertidumbre se vuelve paralizante.
Y funcionó.
Funcionó durante décadas.
Cuando finalmente los documentos internos de las tabacaleras empezaron a hacerse públicos, mostraron algo perturbador:
La industria sabía perfectamente lo que estaba vendiendo.
Pero para entonces, el modelo ya había sido exportado.
La industria azucarera usó estrategias similares para desplazar la atención hacia las grasas como principal causa de enfermedad cardiovascular.
La industria del plomo retrasó regulaciones durante años cuestionando la solidez de la evidencia existente.
Y décadas después, la industria de combustibles fósiles aplicó mecanismos muy parecidos frente al consenso climático.
A veces cambiaban los argumentos.
A veces cambiaban los científicos.
A veces cambiaba el producto.
Pero la lógica era la misma.
Sembrar suficiente incertidumbre como para frenar decisiones.
Ese es el problema con la duda.
La duda legítima es parte esencial de la ciencia.
Sin escepticismo, no existe método científico.
Pero esa misma lógica también puede convertirse en una herramienta de relaciones públicas.
Y desde afuera, las dos cosas pueden verse exactamente iguales.
La duda no fue un efecto secundario.
Fue el producto.`;

const words = scriptText.replace(/\\n/g, ' ').split(' ').filter(w => w.trim() !== '');
const totalAudioMs = 240000; // 4 minutes approx
const msPerWord = Math.floor(totalAudioMs / words.length);

const captions = words.map((word, index) => {
  const startMs = index * msPerWord;
  return {
    text: word,
    startMs: startMs,
    endMs: startMs + msPerWord - 50,
    timestampMs: startMs,
    confidence: 1
  };
});

fs.writeFileSync('./public/captions.json', JSON.stringify(captions, null, 2));
console.log('Approximate captions generated!');
