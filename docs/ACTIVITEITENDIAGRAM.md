# Activiteitendiagram - Cookie Clicker Pro

## Hoofdactiviteiten Flow

```
                    [START]
                       │
                       ▼
            ┌──────────────────────┐
            │  Laad Opgeslagen     │
            │  Speldata            │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Initialiseer Game   │
            │  - Buildings         │
            │  - Upgrades          │
            │  - Themes            │
            │  - Events            │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Render UI           │
            │  - Shop              │
            │  - Upgrades          │
            │  - Stats             │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Start Game Loop     │
            │  (10x per seconde)   │
            └──────────────────────┘
                       │
                       ▼
        ╔══════════════════════════════╗
        ║   MAIN GAME LOOP             ║
        ║   (Continuous)               ║
        ╚══════════════════════════════╝
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   [User Click]  [Auto Prod]   [Random Event]
        │              │              │
        └──────────────┴──────────────┘
                       │
                       ▼
                    [END]
```

## 1. Cookie Klik Activiteit

```
                [User klikt op Cookie]
                       │
                       ▼
            ┌──────────────────────┐
            │  Registreer Klik     │
            │  Positie (x, y)      │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Voeg Cookies toe    │
            │  (clickPower)        │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Verhoog Total       │
            │  Clicks Counter      │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Toon Visueel        │
            │  Effect (+X)         │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Update Display      │
            │  - Cookie Count      │
            │  - Upgrades          │
            └──────────────────────┘
                       │
                       ▼
                   [Klaar]
```

## 2. Building Kopen Activiteit

```
            [User klikt op Building]
                       │
                       ▼
            ┌──────────────────────┐
            │  Bereken Kosten      │
            │  (exponentieel)      │
            └──────────────────────┘
                       │
                       ▼
            ╔══════════════════════╗
            ║  Genoeg Cookies?     ║
            ╚══════════════════════╝
                │              │
              JA│              │NEE
                │              │
                ▼              ▼
    ┌──────────────────┐  ┌──────────────────┐
    │ Trek Cookies af  │  │ Toon "Te duur"   │
    └──────────────────┘  │ Visuele feedback │
                │         └──────────────────┘
                │                    │
                ▼                    │
    ┌──────────────────┐            │
    │ Verhoog Count    │            │
    │ van Building     │            │
    └──────────────────┘            │
                │                    │
                ▼                    │
    ┌──────────────────┐            │
    │ Bereken nieuwe   │            │
    │ CPS (Cookies/s)  │            │
    └──────────────────┘            │
                │                    │
                ▼                    │
    ┌──────────────────┐            │
    │ Update UI        │            │
    │ - Shop           │            │
    │ - Owned Items    │            │
    │ - CPS Display    │            │
    └──────────────────┘            │
                │                    │
                ▼                    │
    ┌──────────────────┐            │
    │ Save Game        │            │
    └──────────────────┘            │
                │                    │
                └────────────────────┘
                         │
                         ▼
                     [Klaar]
```

## 3. Upgrade Kopen Activiteit

```
            [User klikt op Upgrade]
                       │
                       ▼
            ╔══════════════════════╗
            ║  Is Beschikbaar?     ║
            ║  (requirement check) ║
            ╚══════════════════════╝
                │              │
              JA│              │NEE
                │              │
                ▼              ▼
    ╔══════════════════╗  ┌──────────────────┐
    ║ Genoeg Cookies?  ║  │ Toon "Locked"    │
    ╚══════════════════╝  │ Bericht          │
        │          │       └──────────────────┘
      JA│          │NEE              │
        │          │                 │
        ▼          ▼                 │
┌─────────────┐ ┌─────────────┐    │
│Trek Cookies │ │Toon "Te duur"│    │
│af           │ │Bericht       │    │
└─────────────┘ └─────────────┘    │
        │              │             │
        ▼              │             │
┌─────────────┐       │             │
│Markeer als  │       │             │
│Purchased    │       │             │
└─────────────┘       │             │
        │              │             │
        ▼              │             │
┌─────────────┐       │             │
│Pas Effect   │       │             │
│toe op Game  │       │             │
│- Click Power│       │             │
│- Building   │       │             │
│  Multiplier │       │             │
└─────────────┘       │             │
        │              │             │
        ▼              │             │
┌─────────────┐       │             │
│Herbereken   │       │             │
│CPS          │       │             │
└─────────────┘       │             │
        │              │             │
        ▼              │             │
┌─────────────┐       │             │
│Update UI    │       │             │
│- Upgrades   │       │             │
│- Shop       │       │             │
└─────────────┘       │             │
        │              │             │
        ▼              │             │
┌─────────────┐       │             │
│Save Game    │       │             │
└─────────────┘       │             │
        │              │             │
        └──────────────┴─────────────┘
                       │
                       ▼
                   [Klaar]
```

## 4. Automatische Productie Loop

```
        [Game Loop Tick - elke 100ms]
                       │
                       ▼
            ┌──────────────────────┐
            │  Bereken Productie   │
            │  (CPS / 10)          │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Loop door alle      │
            │  Buildings           │
            └──────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐            ┌──────────────┐
│Building 1    │    ...     │Building N    │
│Production    │            │Production    │
└──────────────┘            └──────────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Som alle Productie  │
            │  = Total CPS         │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Voeg Cookies toe    │
            │  aan GameState       │
            └──────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Update UI           │
            │  - Cookie Count      │
            │  - CPS Display       │
            └──────────────────────┘
                       │
                       ▼
            ╔══════════════════════╗
            ║  10 seconden         ║
            ║  verstreken?         ║
            ╚══════════════════════╝
                │              │
              JA│              │NEE
                │              │
                ▼              │
    ┌──────────────────┐      │
    │ Auto-Save Game   │      │
    └──────────────────┘      │
                │              │
                └──────────────┘
                       │
                       ▼
            [Wacht 100ms, herhaal]
```

## 5. Special Event Activiteit

```
        [Event Timer - elke 30 sec]
                       │
                       ▼
            ╔══════════════════════╗
            ║  Random Check        ║
            ║  (5% kans)           ║
            ╚══════════════════════╝
                │              │
            TRIGGER│           │SKIP
                │              │
                ▼              │
    ╔══════════════════╗      │
    ║ Event al actief? ║      │
    ╚══════════════════╝      │
        │          │           │
      NEE│         │JA         │
        │          │           │
        ▼          └───────────┘
┌─────────────┐               │
│Kies Random  │               │
│Event        │               │
│- Golden     │               │
│- Frenzy     │               │
│- Lucky      │               │
└─────────────┘               │
        │                      │
        ▼                      │
┌─────────────┐               │
│Start Event  │               │
│- Apply      │               │
│  Effect     │               │
└─────────────┘               │
        │                      │
        ▼                      │
┌─────────────┐               │
│Toon Event   │               │
│Banner       │               │
│- Title      │               │
│- Timer      │               │
└─────────────┘               │
        │                      │
        ▼                      │
┌─────────────┐               │
│Start Timer  │               │
│Countdown    │               │
└─────────────┘               │
        │                      │
        ▼                      │
╔═══════════════╗             │
║ Event Duur    ║             │
║ Verstreken?   ║             │
╚═══════════════╝             │
        │                      │
        ▼                      │
┌─────────────┐               │
│End Event    │               │
│- Remove     │               │
│  Effect     │               │
└─────────────┘               │
        │                      │
        ▼                      │
┌─────────────┐               │
│Verberg      │               │
│Banner       │               │
└─────────────┘               │
        │                      │
        ▼                      │
┌─────────────┐               │
│Herbereken   │               │
│CPS          │               │
└─────────────┘               │
        │                      │
        └──────────────────────┘
                │
                ▼
            [Klaar]
```

## 6. Thema Wisselen Activiteit

```
        [User klikt op Thema]
                │
                ▼
        ╔══════════════╗
        ║ Is Unlocked? ║
        ╚══════════════╝
            │        │
          JA│        │NEE
            │        │
            ▼        ▼
    ┌──────────┐ ╔════════════════╗
    │Pas Thema │ ║ Voldoet aan    ║
    │toe       │ ║ Requirement?   ║
    └──────────┘ ╚════════════════╝
            │        │          │
            │      JA│          │NEE
            │        │          │
            │        ▼          ▼
            │  ┌──────────┐ ┌────────┐
            │  │Unlock    │ │Toon    │
            │  │Thema     │ │"Locked"│
            │  └──────────┘ └────────┘
            │        │          │
            │        ▼          │
            │  ┌──────────┐    │
            │  │Pas Thema │    │
            │  │toe       │    │
            │  └──────────┘    │
            │        │          │
            └────────┴──────────┘
                     │
                     ▼
            ┌──────────────┐
            │Update CSS    │
            │Classes       │
            └──────────────┘
                     │
                     ▼
            ┌──────────────┐
            │Save Current  │
            │Theme         │
            └──────────────┘
                     │
                     ▼
            ┌──────────────┐
            │Refresh Theme │
            │UI            │
            └──────────────┘
                     │
                     ▼
                 [Klaar]
```

## 7. Save/Load Systeem

```
        [Auto-Save Trigger]
                │
                ▼
        ┌──────────────┐
        │Verzamel Game │
        │State Data    │
        │- Cookies     │
        │- Buildings   │
        │- Upgrades    │
        │- Themes      │
        │- Stats       │
        └──────────────┘
                │
                ▼
        ┌──────────────┐
        │Converteer    │
        │naar JSON     │
        └──────────────┘
                │
                ▼
        ┌──────────────┐
        │Sla op in     │
        │localStorage  │
        └──────────────┘
                │
                ▼
            [Klaar]


        [Game Start - Load]
                │
                ▼
        ╔══════════════╗
        ║ Save Data    ║
        ║ Bestaat?     ║
        ╚══════════════╝
            │        │
          JA│        │NEE
            │        │
            ▼        ▼
    ┌──────────┐ ┌──────────┐
    │Lees JSON │ │Start     │
    │uit       │ │Nieuw Spel│
    │localStorage│└──────────┘
    └──────────┘      │
            │         │
            ▼         │
    ┌──────────┐     │
    │Parse JSON│     │
    └──────────┘     │
            │         │
            ▼         │
    ┌──────────┐     │
    │Herstel   │     │
    │GameState │     │
    └──────────┘     │
            │         │
            ▼         │
    ┌──────────┐     │
    │Herstel   │     │
    │Buildings │     │
    └──────────┘     │
            │         │
            ▼         │
    ┌──────────┐     │
    │Herstel   │     │
    │Upgrades  │     │
    └──────────┘     │
            │         │
            └─────────┘
                │
                ▼
        ┌──────────────┐
        │Render UI met │
        │Geladen Data  │
        └──────────────┘
                │
                ▼
            [Klaar]
```

## Belangrijke Opmerkingen

1. **Game Loop**: Draait 10x per seconde (elke 100ms) voor vloeiende updates
2. **Auto-Save**: Gebeurt automatisch elke 10 seconden
3. **Event System**: Controleert elke 30 seconden met 5% kans op event
4. **UI Updates**: Gebeuren na elke significante actie (klik, koop, etc.)
5. **Exponentiële Kosten**: Building kosten stijgen met factor 1.15 per aankoop
6. **Requirement Checks**: Upgrades en Themes controleren voorwaarden voor beschikbaarheid
