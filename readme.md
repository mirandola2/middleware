# Middleware Sito Mirandola 2 📤

> 📦 **Repository archiviata.** Il middleware non esiste più come progetto a sé: dal novembre 2026 le sue funzioni sono parte del sito, in [**mirandola2/frontend**](https://github.com/mirandola2/frontend) (Next.js). Questa repository resta online in sola lettura, come memoria storica. Per sviluppare, cambiare dati o capire come funziona oggi, **leggere il README del frontend**.

Il middleware era un _Cloudflare Worker_ (`people`) che metteva il database **D1** (_Cloudflare_) a disposizione del sito, che a quel tempo era fatto con Nuxt. Serviva a non esporre il database al pubblico e a servire tre cose: i **totem**, il **codice socio** e i **compleanni** dei prossimi giorni.

Con il passaggio a Next.js il sito ha un proprio server e un proprio database (SQLite su [Turso](https://turso.tech), letto con Drizzle ORM): un servizio separato in mezzo non serviva più, e le sue tre funzioni sono state riscritte dentro il sito. I dati (tabelle `totem` e `data`) sono stati copiati nel nuovo database con `scripts/import-d1.mts` del frontend; la tabella `data` si chiama ora `member`.

## Com'era fatto (riferimento storico) 🕰️

Solo per chi deve leggere il vecchio codice, che si trova in `src/worker.ts` (ultimo commit: `90f4ec5`, 11 novembre 2024).
