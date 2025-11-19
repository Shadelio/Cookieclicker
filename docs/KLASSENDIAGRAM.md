# Klassendiagram - Cookie Clicker Pro

## UML Klassendiagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          GameManager                             │
├─────────────────────────────────────────────────────────────────┤
│ - state: GameState                                              │
│ - buildings: Building[]                                         │
│ - upgrades: Upgrade[]                                           │
│ - themes: Theme[]                                               │
│ - events: SpecialEvent[]                                        │
│ - ui: UIManager                                                 │
├─────────────────────────────────────────────────────────────────┤
│ + constructor()                                                 │
│ + initializeBuildings(): Building[]                            │
│ + initializeUpgrades(): Upgrade[]                              │
│ + initializeThemes(): Theme[]                                  │
│ + initializeEvents(): SpecialEvent[]                           │
│ + loadBuildingsFromState(): void                               │
│ + loadUpgradesFromState(): void                                │
│ + clickCookie(x: number, y: number): void                      │
│ + buyBuilding(buildingId: string): boolean                     │
│ + buyUpgrade(upgradeId: string): boolean                       │
│ + calculateCPS(): void                                         │
│ + changeTheme(themeId: string): void                           │
│ + triggerRandomEvent(): void                                   │
│ + startGameLoop(): void                                        │
│ + startEventSystem(): void                                     │
│ + updateDisplay(): void                                        │
│ + getStats(): Object                                           │
│ + formatNumber(num: number): string                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ heeft
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          GameState                               │
├─────────────────────────────────────────────────────────────────┤
│ + cookies: number                                               │
│ + totalCookiesEarned: number                                    │
│ + cookiesPerSecond: number                                      │
│ + clickPower: number                                            │
│ + totalClicks: number                                           │
│ + buildings: Object                                             │
│ + upgrades: Object                                              │
│ + currentTheme: string                                          │
│ + unlockedThemes: string[]                                      │
│ + startTime: number                                             │
│ + activeEvent: SpecialEvent | null                              │
├─────────────────────────────────────────────────────────────────┤
│ + constructor()                                                 │
│ + addCookies(amount: number): void                             │
│ + spendCookies(amount: number): boolean                        │
│ + save(): void                                                 │
│ + load(): boolean                                              │
│ + reset(): void                                                │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                          Building                                │
├─────────────────────────────────────────────────────────────────┤
│ + id: string                                                    │
│ + name: string                                                  │
│ + baseCost: number                                              │
│ + baseProduction: number                                        │
│ + icon: string                                                  │
│ + description: string                                           │
│ + count: number                                                 │
│ + productionMultiplier: number                                  │
├─────────────────────────────────────────────────────────────────┤
│ + constructor(id, name, baseCost, baseProduction, icon, desc)  │
│ + getCost(): number                                            │
│ + getProduction(): number                                      │
│ + buy(): void                                                  │
│ + applyUpgrade(multiplier: number): void                       │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                          Upgrade                                 │
├─────────────────────────────────────────────────────────────────┤
│ + id: string                                                    │
│ + name: string                                                  │
│ + cost: number                                                  │
│ + icon: string                                                  │
│ + description: string                                           │
│ + effect: Function                                              │
│ + requirement: Function                                         │
│ + purchased: boolean                                            │
├─────────────────────────────────────────────────────────────────┤
│ + constructor(id, name, cost, icon, desc, effect, requirement) │
│ + isAvailable(gameState: GameState): boolean                   │
│ + purchase(gameState: GameState): boolean                      │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                          Theme                                   │
├─────────────────────────────────────────────────────────────────┤
│ + id: string                                                    │
│ + name: string                                                  │
│ + icon: string                                                  │
│ + requirement: Function                                         │
│ + colors: Object                                                │
├─────────────────────────────────────────────────────────────────┤
│ + constructor(id, name, icon, requirement, colors)             │
│ + isUnlocked(gameState: GameState): boolean                    │
│ + apply(): void                                                │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                       SpecialEvent                               │
├─────────────────────────────────────────────────────────────────┤
│ + id: string                                                    │
│ + title: string                                                 │
│ + description: string                                           │
│ + duration: number                                              │
│ + effect: Object {start: Function, end: Function}              │
│ + icon: string                                                  │
│ + startTime: number | null                                      │
│ + active: boolean                                               │
├─────────────────────────────────────────────────────────────────┤
│ + constructor(id, title, desc, duration, effect, icon)         │
│ + start(gameState: GameState): void                            │
│ + end(gameState: GameState): void                              │
│ + getRemainingTime(): number                                   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                         UIManager                                │
├─────────────────────────────────────────────────────────────────┤
│ - game: GameManager                                             │
├─────────────────────────────────────────────────────────────────┤
│ + constructor(gameManager: GameManager)                        │
│ + initializeEventListeners(): void                             │
│ + showClickEffect(x: number, y: number, amount: number): void  │
│ + updateCookieCount(): void                                    │
│ + updateCPS(): void                                            │
│ + updateClickPower(): void                                     │
│ + renderShop(): void                                           │
│ + renderUpgrades(): void                                       │
│ + updateShop(): void                                           │
│ + updateUpgrades(): void                                       │
│ + updateOwned(): void                                          │
│ + renderThemes(): void                                         │
│ + showStats(): void                                            │
│ + showEvent(event: SpecialEvent): void                         │
│ + hideEvent(): void                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Relaties tussen Klassen

### Compositie (heeft-een relatie)
- **GameManager** heeft een **GameState**
- **GameManager** heeft een **UIManager**
- **GameManager** heeft meerdere **Building** objecten
- **GameManager** heeft meerdere **Upgrade** objecten
- **GameManager** heeft meerdere **Theme** objecten
- **GameManager** heeft meerdere **SpecialEvent** objecten

### Afhankelijkheden
- **UIManager** is afhankelijk van **GameManager**
- **Upgrade** is afhankelijk van **GameState** (voor effect en requirement)
- **Theme** is afhankelijk van **GameState** (voor unlock requirement)
- **SpecialEvent** is afhankelijk van **GameState** (voor effect)
- **Building** wordt gebruikt door **GameManager** en **GameState**

## Dataflow

```
User Input (Click/Buy)
        │
        ▼
   UIManager
        │
        ▼
  GameManager
        │
        ├──► GameState (update data)
        │
        ├──► Building (buy/calculate)
        │
        ├──► Upgrade (purchase/apply)
        │
        ├──► Theme (unlock/apply)
        │
        └──► SpecialEvent (trigger/end)
        │
        ▼
   UIManager (update display)
        │
        ▼
   DOM Update
```

## Design Patterns

### 1. **Singleton Pattern**
- `GameManager` wordt slechts één keer geïnstantieerd als globale `game` variabele

### 2. **Observer Pattern**
- `UIManager` observeert veranderingen in `GameState` en update de UI

### 3. **Strategy Pattern**
- `Upgrade.effect` en `Upgrade.requirement` zijn functies die verschillende strategieën implementeren
- `SpecialEvent.effect` bevat start/end strategieën

### 4. **Factory Pattern**
- `initializeBuildings()`, `initializeUpgrades()`, `initializeThemes()`, `initializeEvents()` fungeren als factory methods

## Belangrijke Methoden

### GameManager
- **startGameLoop()**: Start de hoofdgame loop (10x per seconde)
- **calculateCPS()**: Berekent cookies per seconde van alle buildings
- **triggerRandomEvent()**: Triggert willekeurige special events

### GameState
- **save()**: Slaat spelstatus op in localStorage
- **load()**: Laadt spelstatus uit localStorage
- **addCookies()**: Voegt cookies toe en update totaal

### Building
- **getCost()**: Berekent huidige kosten (exponentieel scaling)
- **getProduction()**: Berekent totale productie met multipliers

### UIManager
- **renderShop()**: Rendert alle beschikbare buildings
- **renderUpgrades()**: Rendert beschikbare en gekochte upgrades
- **showClickEffect()**: Toont visueel effect bij klikken

## Extensibility

Het systeem is ontworpen voor eenvoudige uitbreiding:
- Nieuwe **Buildings** toevoegen in `initializeBuildings()`
- Nieuwe **Upgrades** toevoegen in `initializeUpgrades()`
- Nieuwe **Themes** toevoegen in `initializeThemes()`
- Nieuwe **Events** toevoegen in `initializeEvents()`

Alle nieuwe items volgen dezelfde class structuur en worden automatisch geïntegreerd in het spel.
