# Game Design Document (GDD)

## Mecânica principal

- O passarinho cai constantemente por gravidade
- Ao tocar na tela, ele bate as asas e sobe
- Obstáculos vêm da direita para a esquerda
- Objetivo: sobreviver o máximo possível sem bater

## Loop do jogo

```
Tela inicial → Toca pra começar → Gameplay → Bate → Game Over → Toca pra tentar de novo
```

## Sessão típica
- Duração: 30 a 90 segundos
- Reinício rápido (sem loading)

---

## Telas

### 1. Tela Inicial
- Logo do jogo
- Personagem animado no centro
- Botão "Jogar"
- Botão de som (on/off)

### 2. Gameplay
- Pontuação no topo
- Personagem controlável
- Obstáculos gerados aleatoriamente
- Fundo em parallax (céu, nuvens)

### 3. Game Over
- "Você bateu!" (amigável, não assustador)
- Pontuação da partida
- Recorde
- Botão "Tentar de novo"
- Botão "Assistir anúncio para continuar" (rewarded ad — 1 vez por partida)

### 4. Pausa (opcional)
- Botão de pause durante o jogo
- Opção de ir ao menu

---

## Obstáculos

Em vez de canos verdes clássicos, usar variações infantis:
- Nuvens com gap no meio
- Balões gigantes
- Arco-íris bloqueando o caminho
- Castelos nas nuvens
- Pipa e linha

## Progressão de dificuldade

| Pontuação | Velocidade | Gap dos obstáculos |
|-----------|------------|---------------------|
| 0–5       | Lenta      | Grande              |
| 6–15      | Média      | Médio               |
| 16–30     | Rápida     | Menor               |
| 31+       | Máxima     | Mínimo aceitável    |

---

## Pontuação

- +1 ponto a cada obstáculo passado
- Recorde salvo localmente
- (Futuro) Ranking global

---

## Física

- Gravidade: ajustar para parecer mais leve que o original
- Impulso do pulo: suave, com pequena animação de "bater asas"
- Colisão: ligeiramente tolerante (forgiving hitbox)

---

## Feedback visual

- Passarinho pisca ao morrer
- Confetes ao bater recorde
- Partículas de nuvem ao passar obstáculo
- Expressão do personagem muda com velocidade (normal / assustado / feliz)

---

## Feedback sonoro

- Som de "bater asas" ao pular
- Som de moeda/estrela ao marcar ponto
- Som fofo ao morrer (não assustador)
- Musiquinha alegre em loop de fundo (pode ser desligada)
