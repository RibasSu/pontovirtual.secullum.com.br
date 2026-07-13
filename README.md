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

Os arquivos gerados ficam em `dist/`. Por padrão, esse comando gera um instalador `.exe` único para Windows.

## Gerar app para Linux

```bash
bun run dist:linux
```

Esse comando gera um AppImage e um pacote `.deb` em `dist/`.

## Gerar Windows e Linux

```bash
bun run dist:all
```

Para gerar `.zip` portable manual:

```bash
bun run dist:win:zip
```

Em Linux, o `.exe` NSIS precisa de `wine`. Em Windows, ele pode ser gerado diretamente.

## Publicar atualização

```bash
bun run dist:release
```

Esse comando publica os artefatos no GitHub Releases de `RibasSu/pontovirtual.secullum.com.br`.
Para publicar, configure `GH_TOKEN` no ambiente com permissão de release.
No Windows, a atualização automática funciona com o instalador `.exe` NSIS; o `.zip` portable é apenas para distribuição manual.

## Observações

- O aplicativo depende de internet, pois carrega `https://pontovirtual.secullum.com.br/`.
- Antes de abrir o site, o aplicativo verifica se existe conexão. Sem internet, ele mostra uma tela local com a opção de tentar novamente.
- O app libera câmera, microfone, localização e notificações apenas para o domínio do Ponto Virtual Secullum.
- O app usa a logo oficial de `https://pontovirtual.secullum.com.br/favicon-amarelo.svg` como ícone e na tela offline.
- A cor da marca usada na interface offline é `#ffcc1a`.
- O login em `https://autenticador.secullum.com.br/` permanece dentro da janela do app.
- Links fora dos domínios internos do app abrem no navegador padrão.
- O app verifica atualizações automaticamente pelo GitHub Releases quando está empacotado.
- Recarregar, zoom e tela cheia ficam disponíveis no menu do aplicativo.
