# Roadmap

## Visão geral

```
Semana 1 → Protótipo jogável
Semana 2 → Jogo completo (sem arte final)
Semana 3 → Arte, sons, polish
Semana 4 → Monetização + build + publicação
```

---

## Semana 1 — Protótipo

**Meta:** Jogo jogável, sem arte, só mecânica funcionando.

- [ ] Instalar Unity Hub + Unity LTS
- [ ] Criar projeto 2D Core "cloud-bird"
- [ ] Criar cena principal
- [ ] Implementar personagem com gravidade
- [ ] Implementar pulo ao tocar na tela
- [ ] Criar prefab de obstáculo (2 blocos com gap)
- [ ] Implementar movimento dos obstáculos (direita → esquerda)
- [ ] Implementar spawner de obstáculos
- [ ] Implementar colisão → reiniciar cena
- [ ] Implementar pontuação (trigger entre obstáculos)
- [ ] Mostrar score na tela

**Critério de sucesso:** conseguir jogar 10 partidas seguidas sem bug.

---

## Semana 2 — Jogo completo

**Meta:** Todas as telas e sistemas funcionando.

- [ ] Tela inicial (menu)
- [ ] Tela de game over com pontuação e recorde
- [ ] Salvar recorde localmente (PlayerPrefs)
- [ ] Progressão de dificuldade por pontuação
- [ ] Botão de som (on/off)
- [ ] Parallax no fundo (nuvens se movendo)
- [ ] Testar no celular Android (APK debug)

**Critério de sucesso:** qualquer pessoa consegue jogar sem instrução.

---

## Semana 3 — Arte e polish

**Meta:** Jogo com identidade visual própria e sons.

- [ ] Definir personagem final (gerar com IA)
- [ ] Criar/gerar sprite do personagem (idle + flap + dead)
- [ ] Criar/gerar sprites dos obstáculos
- [ ] Criar/gerar fundo e nuvens
- [ ] Criar ícone do jogo
- [ ] Adicionar musiquinha de fundo
- [ ] Adicionar efeitos sonoros (pulo, ponto, morte)
- [ ] Ajustar feedback visual (animações, partículas)

**Critério de sucesso:** parece um jogo de verdade quando alguém olha.

---

## Semana 4 — Monetização e publicação

**Meta:** Publicar na Play Store com anúncios funcionando.

- [ ] Criar conta Google Play Developer ($25)
- [ ] Criar conta AdMob
- [ ] Integrar SDK do AdMob no Unity
- [ ] Implementar Rewarded Ad (tela de game over)
- [ ] Implementar Interstitial Ad (a cada 3 mortes)
- [ ] Implementar IAP "Remover anúncios" (R$ 4,90 ou R$ 7,90)
- [ ] Criar política de privacidade (obrigatório para Play Store com ads)
- [ ] Criar assets da loja (screenshots + ícone + banner)
- [ ] Escrever descrição do jogo (PT-BR)
- [ ] Gerar APK assinado (AAB)
- [ ] Submeter para review na Play Store

**Critério de sucesso:** jogo aprovado e ao vivo na Play Store.

---

## Pós-lançamento (mês 2+)

- [ ] Monitorar crashes (Firebase Crashlytics)
- [ ] Acompanhar retenção D1/D7
- [ ] Acompanhar receita AdMob
- [ ] Coletar avaliações e responder
- [ ] Decidir: iterar neste jogo ou lançar próximo

---

## Decisões pendentes

- Personagem final: pintinho, passarinho, dinossauro baby?
- Obstáculos: nuvens, canos estilizados, outros?
- Monetização: tem loja de skins ou só remove-ads?
