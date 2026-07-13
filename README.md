# Ponto Virtual Secullum Desktop

Aplicativo desktop para Windows e Linux que abre o Ponto Virtual Secullum em uma janela própria.

## Rodar localmente

```bash
bun install
bun start
```

## Gerar app para Windows

```bash
bun run dist:win
```

Os arquivos gerados ficam em `dist/`. Por padrão, esse comando gera um `.zip` portable para Windows.

## Gerar app para Linux

```bash
bun run dist:linux
```

Esse comando gera um AppImage e um pacote `.deb` em `dist/`.

## Gerar Windows e Linux

```bash
bun run dist:all
```

Para gerar instalador `.exe` com NSIS:

```bash
bun run dist:win:installer
```

Em Linux, o instalador NSIS precisa de `wine`. Em Windows, ele pode ser gerado diretamente.

## Observações

- O aplicativo depende de internet, pois carrega `https://pontovirtual.secullum.com.br/`.
- Antes de abrir o site, o aplicativo verifica se existe conexão. Sem internet, ele mostra uma tela local com a opção de tentar novamente.
- O app libera câmera, microfone, localização e notificações apenas para o domínio do Ponto Virtual Secullum.
- O login em `https://autenticador.secullum.com.br/` permanece dentro da janela do app.
- Links fora dos domínios internos do app abrem no navegador padrão.
- Recarregar, zoom e tela cheia ficam disponíveis no menu do aplicativo.
