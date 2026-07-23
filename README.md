# Compasso

**Sua vida no compasso certo.** Rotina, estoque do que você não pode deixar acabar e uma
lista de desejos que acompanha o preço por você — tudo num lugar só.

App em React + TypeScript + Vite, implementado a partir do design `Compasso.dc.html`.

## Funcionalidades

- **Rotina**
  - **Hoje** — checklist do dia por período (Manhã / Tarde / Noite), com barra de conclusão,
    ofensiva (streak) e alertas de horário (atrasado / em X min).
  - **Semana** — mapa de calor da semana e do mês, meta mínima ajustável e recompensa/punição.
  - **Estoque** — controle de consumíveis (remédios, vitaminas, skincare) com barra de
    depleção, dias restantes, data estimada de reposição e alertas de estoque baixo/urgente.
- **Wishlist** — cole o link de um produto e o app "lê" nome, imagem e preço, acompanha o
  histórico de preço (sparkline) e avisa quando bater a meta.
- **Ajustes** — tema claro/escuro, cor de destaque e notificações.
- Persistência local (`localStorage`) — seus dados ficam no navegador.

## Como rodar

```bash
npm install
npm run dev       # servidor de desenvolvimento (http://localhost:5173)
npm run build     # build de produção (typecheck + bundle em dist/)
npm run preview   # pré-visualiza o build
npm run typecheck # apenas checagem de tipos
```

## Estrutura

```
src/
  App.tsx                 # shell + navegação (Rotina / Wishlist)
  main.tsx                # entrada React
  index.css               # tokens de design + estilos globais (.btn, .input, .tag, .dialog…)
  types.ts                # tipos de domínio
  hooks/
    useCompasso.ts        # estado central, ações e persistência
  lib/
    storage.ts            # helpers de localStorage
    format.ts             # BRL, parseBRL, uid, hostOf
    theme.ts              # paletas de destaque + variáveis de tema (claro/escuro)
    styles.ts             # builders de estilo (tabs, nav, segmentos)
    data.ts               # dados-semente, detecção de produto, histórico de preço
  components/
    Login.tsx  Header.tsx
    Hoje.tsx  Semana.tsx  Estoque.tsx  Wishlist.tsx
    SettingsDialog.tsx  AddDialog.tsx  Toast.tsx  Icon.tsx
```

> Protótipo — a "leitura" de produtos da Wishlist e o histórico de preços são simulados
> localmente (nenhuma chamada de rede é feita).
