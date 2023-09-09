# Middleware

Il middleware è ciò che connette il database al frontend, ed è essenziale per nascondere all'utente finale le chiavi.
Il database utilizzato è lo sperimentale (e gratuito) **D1** di Cloudflare.

## Worker

Il worker è lo script al centro del middleware, scritto in Typescript, fornisce gli endpoints a cui collegarsi dal frontend. 

La struttura è molto simile a quella dell'esempio presente nella documentazione ufficiale 

## Endpoints

Per fetchare il middleware si deve fare riferimento all'indirizzo [people.mirandola2.workers.dev](https://people.mirandola2.workers.dev/).

| Endpoints | Description | Parameters |
|-|-|-|
|`/totem`| Ritorna un json contenente una lista di dizionari comporta da tutti i totem. | |
|`/data`| Ritorna un json contente i dati di una persona - richiede come input il codice fiscale | &id=XYZ
|`/birthday`| Ritorna un json contentente chi e quando (conto alla rovescia in giorni) eventualmente compierà gli anni  nei seguenti i 7 giorni. | |


## Database

A breve verrà inserita la documentazione basilare per usare Wrangler, il tool a riga di comando per connettersi a D1.  

Una volta connesso, per eseguire una query è sufficiente usare il comando `npx wrangler d1 execute` insieme ad una query SQLite.

```sh
npx wrangler d1 execute people --local --command "SELECT * from totem"
```

Nell'esempio qui sopra, `--local` fa sì che il comando abbia effetto solo locale, per far sì che le modifiche vengano applicate bisogna ometterlo.
**People** è invece il nome del database.

Le tables di _people_ sono _totem_ e _data_. 

Per eseguire un intero file sql servirà utilizzare:

```sh
npx wrangler d1 execute people --file schema.sql
```
