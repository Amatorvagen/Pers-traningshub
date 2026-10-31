# Pers Träningshub

En fil: index.html (React via CDN, Supabase-projekt `amtzgpiddevnuoxpvevj`). Deployas av Vercel vid push.

## Säkerhet
- Inloggning krävs (formuläret längst ner i index.html startar appen via `window.__startHub`). Samma konto som Gläntan.
- training_logs och app_state har kolumnen owner (default auth.uid()). Begränsande policy `hub_only_owner` släpper bara igenom ägarens rader; anon har inga rättigheter. Ändra aldrig så att något blir läsbart för anon.
- Trigger `hub_claim` på auth.users ger rader utan ägare till Pers konto när det bekräftas.
- Repot är publikt: lägg aldrig hemliga nycklar här. Den publika anon-nyckeln är okej.
