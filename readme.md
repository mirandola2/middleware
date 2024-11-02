# Middleware Sito Mirandola 2 📤


> ℹ️ _Il ruolo di questo file è duplice: in primis funge da documentazione per coloro che hanno creato sviluppato il sito ma hanno altresì scarsissima memoria. In secondo luogo vuole essere, anche e soprattutto, una sorta di guida per chi a prescindere dalle proprie competenze vorrebbe_ capirci qualcosa _ed è curioso di cosa tiene in piedi il “backend” del sito del Mirandola 2. Per questa duplice natura - e nell'ottica del principio scout del Trapasso Nozioni - si è cercato di usare un linguaggio chiaro e spiegare cose che per alcuni possono essere ovvie pur sapendo che d'altra parte per forza di cose questo non potrà bastare a capire tutto tutto. Sicuramente è meglio di niente; se vorrete leggerlo, buona caccia!_

Il middleware è ciò che connette il database al frontend, ed è essenziale per proteggere il database che altrimenti sarebbe esposto al pubblico. In questo caso, come database si è scelto di utilizzare **D1** di _Cloudflare_, che oltre ad avere una generosa free tier, è anche molto facile da utilizzare insieme al Cloudflare. 

## Worker ⚙️

I _Cloudflare Workers_ sono ambienti serverless per eseguire semplici script, e data il loro ottimo rapporto fra flessibilità e prestazioni, sono utilizzati come middleware. In particolare questo è scritto in Typescript e fornisce gli endpoints a cui collegarsi dal frontend.  

## Endpoints 🚪

Per _fetchare_ il middleware si deve fare riferimento all'indirizzo [people.mirandola2.workers.dev](https://people.mirandola2.workers.dev/). Ci sono tre endpoints che permettono di interrogare il database per tutte le funzioni per cui è stato concepito.

| Endpoints | Description | Parameters |
|-|-|-|
|`/totem`| Ritorna un json contenente una lista di dizionari comporta da tutti i totem. | - |
|`/data`| Ritorna un json contente i dati di una persona. Richiede come input il nome della persona, e come header la `psk` (preshared key) di autenticazione (maggiori info più avanti) | `name=XYZ`, [obbligatorio] dove XYZ è il nome della persona URL-encoded. 
|`/birthday`| Ritorna un json contentente chi e quando (`tminus` conto alla rovescia in giorni) eventualmente compierà gli anni  nei seguenti i 7 giorni. |  |

### Autenticazione 🔐

L'endpoint `/data` ritornerà un 403 se nella richiesta non è presente anche l'header `Just-A-PSK`, contenente il _digest_ **sha256** della _preshared key_. 

```js
headers: {
      'Content-Type': 'application/json',
      'Just-A-PSK': hash.digest('hex'),
    },
```

Gli altri endpoint non sono soggetti ad autenticazione.


## Database 💾

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
