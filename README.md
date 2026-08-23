# Voxform

Next.js website with the StyleLab voice-profile runtime ported to server routes.

## Local setup

Copy `.env.example` to `.env.local` and add server-side credentials:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6
ELEVENLABS_API_KEY=...
```

`OPENAI_API_KEY` powers writing analysis and the live clone chat. `ELEVENLABS_API_KEY` powers Scribe v2 transcription for recorded and uploaded voice samples. Keys are read only by server routes and are never sent to the browser.

```bash
npm run dev -- --port 3001
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
