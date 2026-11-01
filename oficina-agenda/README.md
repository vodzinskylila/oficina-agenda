# Torque Oficina — Agenda de reservas

Front end em React + JavaScript (Vite) para reservar a entrada de carros na oficina.
Sem backend: as reservas ficam salvas no `localStorage` do navegador.

## Rodar

```bash
npm install
npm run dev
```

Abra o endereço que o terminal mostrar (normalmente http://localhost:5173).

## O que tem

- Agenda em visão **mensal** e **semanal**
- CRUD completo: criar, editar e excluir reservas (exclusão em dois cliques)
- **Limite de 10 carros por semana** (segunda a domingo), validado ao criar e ao mover uma reserva para outra semana
- Domingos fechados; não dá para reservar datas passadas
- Medidor de vagas da semana e lista das próximas entradas
- Visual preto / laranja / creme, botões arredondados, responsivo

## Estrutura

```
src/
  App.jsx                 tela principal e estado da interface
  index.css               todo o estilo (variáveis de cor no :root)
  hooks/useBookings.js    CRUD + regra das 10 vagas + localStorage
  utils/dates.js          datas, semanas e formatação
  components/
    MonthView.jsx         calendário mensal
    WeekView.jsx          visão semanal
    BookingModal.jsx      formulário de criar/editar
    WeekMeter.jsx         medidor de vagas
    DeleteButton.jsx      botão de excluir com confirmação
```

## Ajustes rápidos

- Limite de vagas: `MAX_PER_WEEK` em `src/utils/dates.js`
- Cores: variáveis `--orange`, `--ink`, `--cream` em `src/index.css`
- Serviços do formulário: lista `SERVICES` em `BookingModal.jsx`
- Para trocar o `localStorage` por uma API depois, só o `useBookings.js` precisa mudar
