# Pers Träningshub

React via CDN, Supabase-projekt `amtzgpiddevnuoxpvevj`. Deployas av Vercel vid push av `index.html`.

## Bygget
- **`traningshub.html` är källan.** Där ligger JSX i `<script type="text/babel">` plus inloggningslagret i egna block längst ner.
- **`index.html` är byggd output. Redigera den aldrig för hand.** Den skrivs över nästa gång någon kör bygget, och handändringar försvinner spårlöst.
- Bygg med `npm install && node build.js`. Skriptet kompilerar med Babel (`runtime: "classic"` – `automatic` ger import-satser som spräcker filen), minifierar med Terser (`mangle:false` bevarar funktionsnamn), tar bort Babel-CDN:en och kontrollerar att inloggningen finns kvar.
- Använd bara `/* */`-kommentarer i JSX. En `//`-kommentar som hamnar på en minifierad rad kommenterar bort resten av filen.
- Filer flyttas som filer (git eller filuppladdning), aldrig via urklipp – urklipp förstör radbrytningar.

## Säkerhet
- Inloggning krävs (formuläret längst ner i `traningshub.html` startar appen via `window.__startHub`). Samma konto som Gläntan.
- training_logs och app_state har kolumnen owner (default auth.uid()). Begränsande policy `hub_only_owner` släpper bara igenom ägarens rader; anon har inga rättigheter. Ändra aldrig så att något blir läsbart för anon.
- Trigger `hub_claim` på auth.users ger rader utan ägare till Pers konto när det bekräftas.
- Repot är publikt: lägg aldrig hemliga nycklar här. Den publika anon-nyckeln är okej.
