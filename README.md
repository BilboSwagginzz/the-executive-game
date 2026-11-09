# The Executive Game 🚬🥃

**The Executive Game** is a web-based, *Sopranos*-themed poker deckbuilder heavily inspired by the addictive mechanics of *Balatro*. 

Step into the late-90s New Jersey underworld as a rising Capo running an unsanctioned high-stakes poker game. Build synergistic card combos, manage a volatile crew of mobsters, and dodge federal indictments to ensure you can kick up the weekly Vig to the Boss. 

## ♠️ Core Mechanics

*   **Pay the Vig:** Survive 6 intense Seasons across three blind tiers (The Drop, The Sit-Down, and The Crisis).
*   **Manage the Crew:** Recruit a roster of 35 authentic characters (Jokers) with unique synergies. Place them strategically, but beware—mobsters are volatile. When they stop earning, use the *Whack / Sever Ties* mechanic to clear up table space.
*   **Front Businesses (Planets):** Level up specific poker hands by investing in local rackets, from Barone Sanitation to Satriale’s Pork Store.
*   **Favors & Hits (Consumables):** Bribe the D.A., launder your stash, or go to the mattresses to alter your deck on the fly.
*   **The FBI Heat Meter:** A diegetic cassette-tape heat meter tracks your exposure. Play too many illegal hands or violent crew members, and you risk a federal raid.

## 📺 Aesthetic & Atmosphere

*   **1999 HBO CRT Filter:** A custom-built shader featuring microscopic scanlines, slight tube curvature, and edge chromatic aberration to simulate a heavy late-90s television.
*   **Tactile Casino Physics:** Photo-realistic clay chips, crisp linen-finish playing cards, and *Balatro*-style sequential scoring animations that pop off the dark green felt.
*   **Dynamic Environments:** The table lighting reacts to the game state—from the neon pink/purple glow of the Bada Bing shop to the freezing blue snow of the Pine Barrens Boss Blind. 
*   **Tactile Audio:** Custom noise-buffer synthesis and low-pass heavy thuds replace arcade MIDIs for a grounded, weighty casino feel.

## 🛠️ Tech Stack & Development

This project was built with a modern web stack (React, TypeScript, Tailwind) and rapidly prototyped using AI-assisted "vibe coding" (Gemini/Claude) to iterate on complex scoring logic, state management, and custom CSS animations. 

*   **Frontend:** React, TypeScript, Vite
*   **Styling & UI:** Tailwind CSS, custom CSS Keyframes for card wobbles and scoring pops
*   **State Management:** React Hooks for complex deck arrays, bankroll interest, and crew modifier sequencing

## 🚀 How to Play (Local Dev)

1. Clone the repository: `git clone https://github.com/Bilboswagginzz/the-executive-game.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `localhost:5173` in your browser. Just remember: keep your hands off the Boss's cut.
