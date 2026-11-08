# Pers Träningshub

React via CDN, Supabase-projekt `amtzgpiddevnuoxpvevj`. Deployas av Vercel vid push av `index.html`.

## Bygget
- **`traningshub.html` är källan.** Där ligger JSX i `<script type="text/babel">` plus inloggningslagret i egna block längst ner.
- **`index.html` är byggd output. Redigera den aldrig för hand.** Den skrivs över nästa gång någon kör bygget, och handändringar försvinner spårlöst.
- Bygg med `npm install && node build.js`. Skriptet kompilerar med Babel (`runtime: "classic"` – `automatic` ger import-satser som spräcker filen), minifierar med Terser (`mangle:false` bevarar funktionsnamn), tar bort Babel-CDN:en och kontrollerar att inloggningen finns kvar.
- Använd bara `/* */`-kommentarer i JSX. En `//`-kommentar som hamnar på en minifierad rad kommenterar bort resten av filen.
- Filer flyttas som filer (git eller filuppladdning), aldrig via urklipp – urklipp förstör radbrytningar.

## Planen bor i databasen, inte i koden

Årsplanen och veckoplanen är redigerbara av Per i appen och av en Claude-chatt direkt mot Supabase. `PROGRAM_PLAN` i källan är bara utgångsläget – det som står i `app_state` vinner. Ändra alltså planer i databasen, inte i koden.

`app_state` är `(key, value)` där value är en JSON-sträng.

**`week-plan`** – visas som "Veckans pass" på förstasidan:
```json
{"week":"2026-W46","text":"Tis: ABC 20 kg · 18 set @ 1:40\nTor: Press · 7 clean + 3 press @ 24 kg\nLör: ABC 24 kg · 19 set @ 1:35","updated":"2026-11-09"}
```
En rad per pass. Text före ett kolon blir etikett. `week` är ISO-vecka – kortet visas bara under den veckan och går sedan tomt igen, vilket är avsikten: det tomma kortet är påminnelsen om att summera veckan. Skriv aldrig en plan för en vecka som redan passerat.

**`goals`** – mål plus överstyrningar per program under `prog_<id>` (`abf1`, `giant`, `host`, `goal`):
```json
{"prog_goal":{"period":"...","dateEnd":"2027-03-31","status":"Nu 26 set · 30 EMOM mars 2027","structure":"...","startGoal":"...","endGoal":"...","progression":"...","notes":"..."}}
```
Alla fält är frivilliga; de som saknas faller tillbaka på `PROGRAM_PLAN`. Tom sträng betyder medvetet tomt. `status` visas som parentes på förstasidan och är rätt ställe för "var vi faktiskt står nu". `dateEnd` styr om programmet visas som avklarat.

## Säkerhet
- Inloggning krävs (formuläret längst ner i `traningshub.html` startar appen via `window.__startHub`). Samma konto som Gläntan.
- training_logs och app_state har kolumnen owner (default auth.uid()). Begränsande policy `hub_only_owner` släpper bara igenom ägarens rader; anon har inga rättigheter. Ändra aldrig så att något blir läsbart för anon.
- Trigger `hub_claim` på auth.users ger rader utan ägare till Pers konto när det bekräftas.
- Repot är publikt: lägg aldrig hemliga nycklar här. Den publika anon-nyckeln är okej.
