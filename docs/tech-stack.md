# Stack Técnica

## Engine

**Unity 2D**
- Versão recomendada: LTS mais recente (Unity 6 LTS ou 2022 LTS)
- Template: 2D Core
- Linguagem: C#

---

## SDKs e Plugins

| SDK               | Finalidade                         | Versão     |
|-------------------|------------------------------------|------------|
| Google AdMob      | Anúncios (rewarded + interstitial) | Última     |
| Unity IAP         | Compra "remover anúncios"          | Nativo     |
| Firebase Analytics| Eventos e retenção (opcional)      | Última     |
| Firebase Crashlytics | Monitorar crashes (opcional)    | Última     |

---

## Estrutura do projeto Unity

```
cloud-bird/
├── Assets/
│   ├── Scenes/
│   │   ├── MainMenu.unity
│   │   ├── Game.unity
│   │   └── GameOver.unity
│   ├── Scripts/
│   │   ├── Bird.cs              # Controle do personagem
│   │   ├── PipeMove.cs          # Movimento dos obstáculos
│   │   ├── PipeSpawner.cs       # Gerador de obstáculos
│   │   ├── ScoreZone.cs         # Trigger de pontuação
│   │   ├── GameManager.cs       # Estado do jogo
│   │   ├── UIManager.cs         # Interface
│   │   └── AdManager.cs         # Controle de anúncios
│   ├── Sprites/
│   │   ├── Bird/
│   │   ├── Obstacles/
│   │   ├── Background/
│   │   └── UI/
│   ├── Audio/
│   │   ├── SFX/
│   │   └── Music/
│   └── Prefabs/
│       ├── Bird.prefab
│       ├── Pipe.prefab
│       └── Ground.prefab
```

---

## Scripts principais

### Bird.cs
Responsável por:
- Gravidade (via Rigidbody2D)
- Pulo ao tocar na tela / clicar
- Estado: vivo / morto
- Rotação visual baseada na velocidade

### PipeSpawner.cs
Responsável por:
- Gerar obstáculos em intervalos
- Variar posição Y aleatoriamente
- Aumentar velocidade conforme score

### GameManager.cs
Responsável por:
- Estado global (menu / jogando / morto)
- Score atual e recorde (PlayerPrefs)
- Acionar anúncios via AdManager

### AdManager.cs
Responsável por:
- Inicializar AdMob
- Carregar e exibir Rewarded Ad
- Carregar e exibir Interstitial
- Lógica de intervalo (não mostrar toda hora)

---

## Publicação

| Item                    | Ferramenta                    |
|-------------------------|-------------------------------|
| Build Android           | Unity Build Settings → AAB    |
| Assinatura              | Keystore (gerado no Unity)    |
| Loja                    | Google Play Console           |
| Conta desenvolvedor     | R$ ~125 (taxa única de $25)   |
| Conta AdMob             | Gratuita                      |
| Política de privacidade | GitHub Pages ou Google Sites  |

---

## Requisitos mínimos Android

- API Level 21+ (Android 5.0)
- Cobertura: ~99% dos dispositivos Android ativos

---

## Ferramentas auxiliares

| Ferramenta   | Uso                              |
|--------------|----------------------------------|
| Claude / ChatGPT | Geração de código C#         |
| DALL·E / Leonardo | Geração de sprites          |
| Suno         | Geração de música de fundo       |
| Freesound    | Efeitos sonoros gratuitos        |
| GitHub       | Versionamento do projeto         |
