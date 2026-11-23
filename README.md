# Checklist App

Aplicativo mobile (React Native + Expo) de checklist de atividades.

## Pré-requisitos

- Node.js 18+
- App **Expo Go** no celular ou um emulador
- Backend rodando: [checklist-api](URL_DO_REPO_BACKEND)

## Como rodar

```bash
git clone <https://github.com/luzvsc/checklist-frontend>
cd checklist-app
npm install
```

Edite `src/config.js` com a URL da API:
| Ambiente | URL |
|---|---|
| Celular físico (mesma rede Wi-Fi) | `http://<IP_DA_SUA_MAQUINA>:3000` |
| Emulador Android | `http://10.0.2.2:3000` |
| Emulador iOS / Web | `http://localhost:3000` |

Inicie o app:

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go.

## Funcionalidades (CRUD)

- **Criar** atividade pelo campo de texto
- **Listar** todas as atividades
- **Editar** o título (✏️) e marcar/desmarcar como concluída (toque no item)
- **Excluir** com confirmação (🗑️)
