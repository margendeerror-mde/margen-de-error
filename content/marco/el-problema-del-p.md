---
titulo: El problema del p menor a cero coma cero cinco
seccion: marco
industria: institucional-académica
mecanismo:
  - diseño-sesgado
  - sesgo-de-publicación
  - cherry-picking
  - normalización-por-repetición
tema: diagnóstico-y-clasificación
fecha: 2025-03-18T00:00:00.000Z
resumen: 'La ciencia moderna decidió que un resultado es ''significativo'' si la probabilidad de que ocurra por azar es menor al 5%. El criterio tiene 90 años, fue adoptado por convención y su creador advirtió que no debía usarse como se usa. La crisis de replicación de la última década sugiere que ese umbral nos ha llevado a creer cosas que probablemente no son verdad.'
---

En 1925, el estadístico Ronald Fisher publicó *Statistical Methods for Research Workers*, un manual que iba a transformar la forma en que la ciencia empírica evalúa sus resultados. En ese libro apareció, como ejemplo pedagógico, el umbral de `p = 0,05`.

La idea era simple: si un experimento produce un resultado que, bajo la hipótesis nula (que no hay efecto real), ocurriría por azar menos del 5% de las veces, el resultado merece atención. Fisher lo presentó como una guía informal para decidir si un experimento valía la pena repetir, no como un criterio binario para decidir si algo es verdad.

Noventa años después, `p < 0,05` es la puerta de entrada a las revistas científicas, el umbral que determina si una carrera académica avanza y el criterio con el que se toman decisiones de política pública y práctica clínica. Fisher no habría reconocido ese uso.

**Qué significa p \< 0,05 y qué no**

El valor p responde a esta pregunta: si no hubiera ningún efecto real, ¿qué tan probable sería observar un resultado tan extremo como este, o más extremo, simplemente por azar?

`P < 0,05` significa que esa probabilidad es menor al 5%.

Lo que no significa: que hay un 95% de probabilidad de que el efecto sea real. Que el efecto es grande. Que el resultado es clínicamente relevante. Que el estudio fue bien diseñado. Que el hallazgo se va a replicar.

Estas confusiones no son raras entre el público general. Son comunes en papers publicados, en comunicados de prensa y en libros de texto.

**El problema estructural: publicar o perecer**

El umbral de `p < 0,05` produce un sesgo sistémico cuando se combina con el sistema de incentivos de la investigación académica.

Los estudios con `p < 0,05` se publican. Los estudios con `p > 0,05` —que "no encontraron efecto"— se quedan en el cajón. No porque los investigadores sean deshonestos: el sistema de publicación simplemente no tiene interés en resultados negativos. El problema se llama publication bias o sesgo de publicación.

La consecuencia es que la literatura científica publicada sobreestima sistemáticamente el tamaño de los efectos reales. Si de diez estudios sobre una intervención, tres encuentran un efecto significativo (por azar o por efecto real) y siete no lo encuentran, los tres se publican y los siete no. El lector de la literatura ve tres confirmaciones y ninguna refutación.

**El p-hacking**

Dentro de un estudio, un investigador toma docenas de decisiones analíticas: qué variables incluir como covariables, cómo manejar los valores extremos, qué subgrupos analizar, si incluir o excluir ciertos participantes, en qué momento hacer el análisis. Cada decisión afecta el valor p.

El p-hacking —la práctica de probar múltiples opciones analíticas hasta encontrar una que produzca `p < 0,05`— puede ser deliberado o inconsciente. Un investigador que genuinamente cree en su hipótesis tomará decisiones que favorecen confirmarla sin necesariamente ser consciente de que las está tomando.

En 2011, los psicólogos Joseph Simmons, Leif Nelson y Uri Simonsohn demostraron que con suficiente flexibilidad analítica podían producir, de forma reproducible, un resultado estadísticamente significativo para una hipótesis absurda: que escuchar la canción "When I'm Sixty-Four" de los Beatles hacía que los participantes fueran, en promedio, un año y medio más jóvenes. El resultado tenía `p < 0,05`. Era artefacto puro.

**La crisis de replicación**

En 2015, un consorcio de 270 investigadores publicó en *Science* los resultados del Proyecto de Replicación en Psicología: habían intentado replicar 100 estudios publicados en revistas de psicología con alto factor de impacto. El 97% de los estudios originales tenía resultados estadísticamente significativos. En las replicaciones, solo el 36% produjo resultados significativos.

Estudios similares en medicina, neurociencia y economía encontraron tasas de replicación de entre el 50% y el 65% en áreas con mejores controles metodológicos.

Esto no significa que la mitad de la ciencia sea falsa. Significa que el sistema de producción y publicación de resultados científicos tiene una tendencia estructural a producir falsos positivos, y que esa tendencia no ha sido corregida.

**Lo que está cambiando y lo que no**

En 2019, la Asociación Americana de Estadística publicada una declaración firmada por 800 estadísticos recomendando abandonar el término "estadísticamente significativo" y dejar de usar el umbral de `p = 0,05` como criterio binario.

Algunas revistas han adoptado políticas de pre-registro de estudios: los investigadores declaran su hipótesis y metodología antes de recolectar datos, lo que hace el p-hacking más difícil. Los resultados de estudios pre-registrados tienden a mostrar efectos más pequeños y tasas de replicación más altas que los no pre-registrados.

El sistema de incentivos académicos —donde publicar resultados positivos en revistas de alto impacto sigue siendo la moneda que determina contrataciones, fondos y reconocimiento— no ha cambiado sustancialmente.

El p-valor seguirá siendo el guardián de la puerta mientras la puerta esté diseñada para dejar pasar principalmente resultados positivos.

**Referencias**

* Fisher RA. *Statistical Methods for Research Workers*. Oliver & Boyd, 1925.
* Open Science Collaboration. "Estimating the reproducibility of psychological science." *Science*, 2015. DOI: 10.1126/science.aac4716
* Simmons JP, Nelson LD, Simonsohn U. "False-Positive Psychology: Undisclosed Flexibility in Data Collection and Analysis." *Psychological Science*, 2011. DOI: 10.1177/0956797611417632
* Wasserstein RL, Schirm AL, Lazar NA. "Moving to a World Beyond 'p \< 0.05'." *The American Statistician*, 2019. DOI: 10.1080/00031305.2019.1583913
* Ioannidis JPA. "Why Most Published Research Findings Are False." *PLOS Medicine*, 2005. DOI: 10.1371/journal.pmed.0020124
