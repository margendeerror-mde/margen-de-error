---
titulo: El tamaño de la muestra no es un detalle técnico
seccion: marco
industria: institucional-académica
mecanismo:
  - diseño-sesgado
  - sesgo-de-publicación
  - titular-engañoso
tema: diagnóstico-y-clasificación
fecha: 2026-05-06T11:34:00.000Z
resumen: 'La potencia estadística no es solo una cifra técnica; es el límite de lo que un estudio puede afirmar con honestidad. Por qué los estudios pequeños pueden ser engañosos y los demasiado grandes, irrelevantes para la práctica clínica.'
---

Un estudio con pocos participantes que no encuentra efecto no demuestra que el efecto no existe. Un estudio con demasiados participantes puede encontrar efectos que existen pero cuya magnitud es trivial desde el punto de vista clínico o práctico. El tamaño muestral determina qué preguntas puede responder un estudio —y cuáles no. Esa limitación rara vez aparece en los titulares.

**Dos errores con nombre propio**

En estadística, los errores que puede cometer un estudio al evaluar una hipótesis tienen nombres. El error tipo I es concluir que hay un efecto cuando en realidad no lo hay —un falso positivo. El error tipo II es concluir que no hay efecto cuando en realidad sí lo hay —un falso negativo. El umbral de `p < 0,05` fija la probabilidad de error tipo I. La probabilidad de error tipo II depende del tamaño muestral, del tamaño del efecto que se quiere detectar y de la variabilidad de los datos.

La potencia estadística de un estudio es la probabilidad de que, si el efecto que busca existe, el estudio lo detecte. Una potencia del 80% —el estándar convencional en muchos campos— significa que si el efecto es real, el estudio tiene un 20% de probabilidad de no encontrarlo. El tamaño muestral es el principal instrumento práctico para controlar esa probabilidad, junto con el tamaño del efecto esperado y la variabilidad de los datos.

El problema es que calcular el tamaño muestral adecuado requiere estimar de antemano el efecto que se quiere detectar. En muchos campos, esas estimaciones se basan en estudios previos que tienden a sobreestimar los efectos reales, lo que produce estudios que tienen menos potencia de la que declaran.

**Cuando el estudio es demasiado chico**

Un estudio pequeño que no encuentra efecto produce un resultado que con frecuencia se interpreta erróneamente. "No se encontró diferencia significativa entre el tratamiento y el placebo" se lee como "el tratamiento no funciona". Esa lectura ignora la pregunta crítica: ¿tenía el estudio potencia suficiente para detectar la diferencia si existía?

En 1978, Freiman et al. publicaron en el *New England Journal of Medicine* un análisis de 71 ensayos clínicos publicados con resultados negativos. Calcularon retroactivamente la potencia de cada uno. La mayoría no tenía potencia suficiente para detectar efectos clínicamente relevantes: muchos hubieran necesitado el doble o el triple de participantes para descartar con confianza razonable la existencia del efecto buscado. Esos estudios no probaban que los tratamientos no funcionaran. Probaban que eran demasiado pequeños para saberlo.

El mismo problema persiste décadas después. Un análisis de Button et al. en *Nature Reviews Neuroscience* (2013) estimó que la potencia media de los estudios publicados en neurociencia era de alrededor del 20% bajo supuestos razonables sobre tamaños de efecto. En esas condiciones, la proporción de resultados positivos que son falsos puede ser alta, especialmente cuando el bajo poder se combina con sesgo de publicación.

**Cuando el estudio es demasiado grande**

El problema inverso es menos discutido pero igualmente real. Un estudio con decenas de miles de participantes tiene potencia para detectar diferencias extremadamente pequeñas —diferencias que pueden ser estadísticamente significativas pero clínicamente triviales.

Considérese un fármaco que reduce la presión arterial sistólica en promedio 1 mmHg. Con una muestra suficientemente grande, esa diferencia puede producir un resultado con `p < 0,05`. El estudio concluye que el fármaco "reduce significativamente la presión arterial". La afirmación es estadísticamente correcta. Una reducción de 1 mmHg tiene relevancia clínica limitada a nivel individual, aunque potencialmente relevante a escala poblacional —lo que no es lo mismo que decir que el fármaco es útil para el paciente frente al médico.

La distinción entre significancia estadística y significancia clínica existe desde hace décadas en la literatura metodológica. En la práctica, la confusión entre ambas es persistente. El tamaño del efecto y los intervalos de confianza son la información que permite evaluar si un resultado estadísticamente significativo importa. Esa información está disponible en los papers. Rara vez es la que circula.

**El ciclo de la imprecisión**

Los estudios pequeños con efectos sobreestimados no son solo un problema de interpretación. Son la materia prima de meta-análisis posteriores. Cuando se combinan múltiples estudios con baja potencia, el resultado hereda sus sesgos: los que llegaron a publicarse son, en promedio, los que tuvieron resultados positivos. Los efectos reportados son, en promedio, más grandes que los efectos reales. Los estudios pequeños sobreestiman efectos por mecanismos relacionados pero distintos a los de los ensayos gratuitos detenidos temprano —en ambos casos opera la captura de fluctuaciones favorables, pero por vías diferentes. El meta-análisis puede producir una estimación precisa de un número que no corresponde a la realidad.

Ioannidis describió este patrón en detalle: los primeros estudios en un campo tienden a mostrar efectos más grandes que los estudios de replicación más tardíos y más robustos. La tendencia de los hallazgos a oscilar entre resultados contradictorios antes de que la evidencia se estabilice es conocida como efecto Proteus.

**Lo que el tamaño muestral no puede resolver**

El tamaño muestral adecuado es condición necesaria para que un estudio sea informativo, pero no suficiente. Un estudio grande con mala medición, con sesgo de selección o con confusores no controlados sigue siendo deficiente. La potencia estadística es una propiedad del diseño que indica la capacidad del estudio para detectar efectos si existen —no una medida de la validez de sus conclusiones una vez obtenido el resultado.

Lo que sí hace el tamaño muestral es fijar los límites de lo que un estudio puede y no puede afirmar. Un estudio pequeño con resultado negativo no puede concluir que el tratamiento no funciona —solo puede concluir que no encontró evidencia de que funcione con la muestra que tenía. Un estudio grande con resultado positivo no puede, por sí solo, establecer la relevancia práctica del efecto encontrado.

Esas limitaciones no son detalles técnicos. Son el contenido real de lo que el estudio demostró. La distancia entre eso y lo que el titular dice es, con frecuencia, el lugar donde la evidencia científica se convierte en otra cosa.

**Referencias**

* Freiman JA et al. ["The importance of beta, the type II error and sample size in the design and interpretation of the randomized control trial."](https://doi.org/10.1056/NEJM197809282991304) *New England Journal of Medicine*, 1978. DOI: [10.1056/NEJM197809282991304](https://doi.org/10.1056/NEJM197809282991304)
* Button KS et al. ["Power failure: why small sample size undermines the reliability of neuroscience."](https://doi.org/10.1038/nrn3475) *Nature Reviews Neuroscience*, 2013. DOI: [10.1038/nrn3475](https://doi.org/10.1038/nrn3475)
* Ioannidis JPA. ["Why Most Published Research Findings Are False."](https://doi.org/10.1371/journal.pmed.0020124) *PLOS Medicine*, 2005. DOI: [10.1371/journal.pmed.0020124](https://doi.org/10.1371/journal.pmed.0020124)
* Ioannidis JPA, Trikalinos TA. ["An exploratory test for an excess of significant findings."](https://doi.org/10.1177/1740774507079441) *Clinical Trials*, 2007. DOI: [10.1177/1740774507079441](https://doi.org/10.1177/1740774507079441)
* Cohen J. ["The statistical power of abnormal-social psychological research: a review."](https://doi.org/10.1037/h0045186) *Journal of Abnormal and Social Psychology*, 1962. DOI: [10.1037/h0045186](https://doi.org/10.1037/h0045186)
* Guyatt GH et al. ["Determining optimal therapy — randomized trials in individual patients."](https://doi.org/10.1056/NEJM198601163140301) *New England Journal of Medicine*, 1986. DOI: [10.1056/NEJM198601163140301](https://doi.org/10.1056/NEJM198601163140301)
