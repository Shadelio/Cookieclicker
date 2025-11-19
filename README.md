# Cookie Clicker Pro

Een professionele, feature-rijke Cookie Clicker game gebouwd met JavaScript, HTML en CSS.

## 📋 Project Informatie

**Groepsgrootte:** 2 personen  
**Technologieën:** JavaScript (ES6+), HTML5, CSS3, TailwindCSS, Font Awesome  
**Copyright:** © 2024 Cookie Clicker Pro Team

## ✨ Features

### Kern Functionaliteit
- ✅ **Klikken op een cookie** - Interactieve cookie met visuele feedback
- ✅ **Puntentelling** - Real-time tracking van cookies
- ✅ **Automatische productie-eenheden** - 10 verschillende autoclickers
- ✅ **Upgrades systeem** - 8+ unieke upgrades voor verbeterde productie
- ✅ **Overzicht van gekochte items** - Duidelijk overzicht van bezittingen
- ✅ **Visuele effecten** - Animaties bij klikken en events
- ✅ **Speciale evenementen** - 3 verschillende tijdelijke events
- ✅ **Thema's en skins** - 6 verschillende thema's om te unlocken
- ✅ **Opslag systeem** - Automatische save in browser localStorage

### Autoclickers (10 stuks)
1. **Cursor** - Automatische klik (0.1/s)
2. **Oma** - Vriendelijke cookie bakker (1/s)
3. **Boerderij** - Groeit cookie planten (8/s)
4. **Mijn** - Delft cookie erts (47/s)
5. **Fabriek** - Massaproductie (260/s)
6. **Bank** - Cookie investeringen (1,400/s)
7. **Tempel** - Cookie offers (7,800/s)
8. **Tovenaar** - Magische cookies (44,000/s)
9. **Ruimteschip** - Ruimte cookies (260,000/s)
10. **Portaal** - Dimensie cookies (1,600,000/s)

### Upgrades (8 stuks)
1. **Versterkte Vingers** - Klik kracht x2
2. **Titanium Muisknoppen** - Klik kracht x2
3. **Dubbele Cursors** - Cursor productie x2
4. **Oma's Geheim Recept** - Oma productie x2
5. **Genetisch Gemodificeerde Cookies** - Boerderij productie x2
6. **Cookie Imperium** - Alle productie x1.5
7. **Mega Klik** - Klik kracht x3
8. **Industriële Revolutie** - Fabriek productie x2

### Thema's (6 stuks)
1. **Klassiek** - Standaard oranje thema (altijd beschikbaar)
2. **Donker** - Dark mode (unlock: 1,000 cookies)
3. **Roze Droom** - Roze thema (unlock: 10,000 cookies)
4. **Ocean Breeze** - Blauw thema (unlock: 50,000 cookies)
5. **Natuur** - Groen thema (unlock: 100,000 cookies)
6. **Mystiek** - Paars thema (unlock: 500,000 cookies)

### Speciale Events (3 stuks)
1. **Gouden Cookie** - Klik kracht x7 voor 30 seconden
2. **Cookie Frenzy** - Alle productie x3 voor 60 seconden
3. **Gelukscookie** - Ontvang 10% van je totale cookies

## 🏗️ Architectuur

### Class Structuur
Het spel gebruikt een object-georiënteerde architectuur met de volgende klassen:

- **GameState** - Beheert de spelstatus en opslag
- **Building** - Representeert een autoclicker type
- **Upgrade** - Representeert een upgrade item
- **Theme** - Representeert een thema/skin
- **SpecialEvent** - Beheert tijdelijke events
- **GameManager** - Hoofdklasse die het spel coördineert
- **UIManager** - Beheert alle UI updates en interacties

### Bestandsstructuur
```
Cookie clicker/
├── index.html          # Hoofdpagina
├── styles.css          # Custom styling
├── game.js            # Game logic (alle klassen)
├── README.md          # Deze file
├── KLASSENDIAGRAM.md  # UML klassendiagram
├── ACTIVITEITENDIAGRAM.md  # Activiteitendiagram
└── ACCEPTATIETESTS.md # Acceptatietests
```

## 🚀 Installatie & Gebruik

1. **Clone of download** het project
2. **Open** `index.html` in een moderne webbrowser
3. **Start met klikken** op de cookie!

Geen build stap nodig - het spel draait direct in de browser.

## 💾 Save Systeem

Het spel slaat automatisch je voortgang op in de browser's localStorage:
- **Auto-save** elke 10 seconden
- **Save bij aankoop** van gebouwen en upgrades
- **Persistent** tussen sessies

## 🎮 Gameplay Tips

1. **Begin met klikken** om je eerste cookies te verdienen
2. **Koop Cursors** als eerste autoclicker (goedkoopst)
3. **Investeer in upgrades** zodra ze beschikbaar komen
4. **Let op speciale events** voor bonus cookies
5. **Unlock thema's** door cookies te verzamelen

## 📊 Statistieken

Het spel houdt de volgende statistieken bij:
- Totaal cookies verdiend
- Huidige cookies
- Cookies per seconde
- Totaal aantal kliks
- Klik kracht
- Speeltijd
- Gebouwen gekocht
- Upgrades gekocht

## 🎨 Frontend Library

**TailwindCSS** - Gebruikt voor moderne, responsive styling
- Utility-first CSS framework
- Responsive design
- Gradient backgrounds
- Flexbox & Grid layouts

**Font Awesome** - Voor alle iconen
- 6.4.0 versie
- Solid icons

## 📝 Leerdoelen

- ✅ **Code structuur** - OOP met ES6 classes
- ✅ **Copyright** - Duidelijk vermeld in code en documentatie
- ✅ **Plannen** - Backlog en checklist gemaakt
- ✅ **Scrum** - Iteratieve ontwikkeling
- ✅ **User stories** - Alle eisen omgezet naar user stories
- ✅ **Acceptatietests** - Minimaal 50% coverage
- ✅ **Activiteitendiagram** - Basis flow gedocumenteerd
- ✅ **Frontend CSS library** - TailwindCSS gebruikt
- ✅ **Klassendiagram** - UML diagram van alle klassen

## 🧪 Testing

Zie `ACCEPTATIETESTS.md` voor gedetailleerde acceptatietests.

## 👥 Team

Cookie Clicker Pro Team - 2024

## 📄 Licentie

Dit project is gemaakt voor educatieve doeleinden.

---

**Veel plezier met het verzamelen van cookies! 🍪**
