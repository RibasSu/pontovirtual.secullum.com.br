# Ponto Virtual Secullum Desktop

Aplicativo desktop para Windows que abre o Ponto Virtual Secullum em uma janela própria.

## Rodar localmente

```bash
bun install
bun start
```

## Gerar instalador para Windows

```bash
bun run dist:win
```

Os arquivos gerados ficam em `dist/`. Por padrao, esse comando gera um `.zip` portable para Windows.

Para gerar instalador `.exe` com NSIS:

```bash
bun run dist:win:installer
```

Em Linux, o instalador NSIS precisa de `wine`. Em Windows, ele pode ser gerado diretamente.

## Observações

- O aplicativo depende de internet, pois carrega `https://pontovirtual.secullum.com.br/`.
- O app libera câmera, microfone, localização e notificações apenas para o domínio do Ponto Virtual Secullum.
- Links fora do domínio do Ponto Virtual Secullum abrem no navegador padrão.
- Recarregar, zoom e tela cheia ficam disponíveis no menu do aplicativo.
