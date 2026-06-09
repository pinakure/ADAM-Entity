const Phonem = { 
    a : 'A',
    e : 'EBG',
    i : 'ICDRZ',
    o : 'O',
    u : 'U',
};

const ProPhonem = {
    /* VOCALS */
    A : 'a',
    E : 'e',
    I : 'i',
    O : 'o',
    U : 'u',
    /* OCLUSIVE */
    B : 'bilabial',
    P : 'bilabial',
    T : 'dental',
    D : 'dental',
    K : 'velar',
    G : 'velar',
    /* FRICATIVE */
    F : 'labiodental',
    Z : 'interdental',
    S : 'alveolic',
    J : 'velar',
    /* AFRICATED */
    CH : 'palatal',
    /* NASAL */
    M : 'bilabial',
    N : 'alveolic',
    Ñ : 'palatal',
    /* LATERAL LIQUID */
    L : 'liquid',
    Y : 'liquid',
    /* VIBRANT LIQUID */
    RR : 'vibrant',
    R  : 'vibrant',

}

Phonem.prototype.M = 'm';
/*------------------------------------------------------------------

/a/: Vocal abierta y central.
/e/: Vocal semiabierta y anterior.
/i/: Vocal cerrada y anterior.
/o/: Vocal semiabierta y posterior.
/u/: Vocal cerrada y posterior.

--------------------------------------------------------------------
OCLUSIVAS (El aire se detiene por completo y se libera de golpe)

/p/: Bilabial sorda (ej. pato)
/b/: Bilabial sonora (ej. vaso, beso)
/t/: Dental sorda (ej. taza)
/d/: Dental sonora (ej. dedo)
/k/: Velar sorda (ej. casa, queso)
/g/: Velar sonora (ej. gato, guerra)

--------------------------------------------------------------------
FRICATIVAS (El aire pasa rozando por un estrechamiento)

/f/: Labiodental sorda (ej. foco)
/z/: Interdental sorda (ej. zapato, cero en España)
/s/: Alveolar sorda (ej. sapo)
/j/ (o /x/): Velar sorda (ej. caja, gente)

--------------------------------------------------------------------
AFRICADAS (El sonido empieza como oclusivo y termina como fricativo)

/ch/ (o /t͡ʃ/): Palatal sorda (ej. chile)

--------------------------------------------------------------------
NASALES (El aire escapa por la cavidad nasal):

/m/: Bilabial (ej. mano)
/n/: Alveolar (ej. nata)
/ñ/: Palatal (ej. niño)

--------------------------------------------------------------------
LÍQUIDAS: Laterales (El aire sale por los lados de la lengua)

/l/: Alveolar (ej. luna)
/y/ (o /ʎ/ en distinción con 'll'): Palatal (ej. lluvia, ayer)

--------------------------------------------------------------------
LÍQUIDAS: Vibrantes (La lengua vibra contra el paladar)

/r/: Vibrante simple, alveolar (ej. pero)
/rr/ (o /r̄/): Vibrante múltiple, alveolar (ej. perro)

------------------------------------------------------------------*/