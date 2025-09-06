# Axiomancer-backend

## Endpoints
### Create User [POST]
`/create-user`
```js
// Request
{
    username: string;
    password: string;
    email: string;
}

// Response (200 success) 
{
    uid: string;
    username: string;
}

// Response (200 username exists)
{
    message: string;
}
```
### Login User [POST]
`/login-user`
```js
// Request
{
    username: string;
    password: string;
}

// Response (200)
{
    uid: string;
}

// Response (200 incorrect username or password)
{
    message: string;
}

```

### Delete User [POST]
`/delete-user`

```js
// Request
{
    uid: string;
}

// Response (200)
{
    message: string;
}
```

### TODO: Determine these route shapes
/get-game-state

/update-game-state

/get-player-stats

/get-player-inventory

/update-player-stats

/update-player-inventory

### Game documentation
# Axiomancer

## Who is the player?
The player is an innocent child (race decided by player) who knows nothing of the evil, the beautiful, the chaos of the world around them. They see the world through a the ignorance lens of childhood. They are a young child within a small seafaring town. In order for them to make something of themselves, they must go on their pilgrimage _(why? TBD)_. Their earliest memory is of traveling to the Labyrinth's door when their parents went on their last pilgrimage.

## What is the ultimate goal?

> The ultimate goal is for the player teach become the King's new advisor. There will be countless different ways this could play out, with many different endings.

### Childhood (Boat)
During childhood, the player must first explore the neighboring areas of his town in order to accumulate boat pieces to make a boat to travel across the sea. During this time, it's all rainbows and sunshine. It'll resemble the beginning of Kingdom Hearts a little bit.

### Childhood (Get to Labyrinth)
Once the boat is crafted the player must traverse the sea (also handled like normal exploration ie. randomized combat, finding loot, etc.) until they reach the other coast. Then they must travel inland as he hears more and more rumors that the Labyrinth's doors have opened and the King's advisor has just recently died. The more they travel inland, the more the player travels inland, the more evidence there seems to be surrounding the claims.

### Childhood into Adulthood (Inside the Labyrinth)
As the player reaches the labyrinth, he sees the rumors were true and the gargantuan doors have opened. This is almost unheard of. Only the oldest of the races remember hearing rumors that these doors were ever open.

Inside the Labyrinth, the player solves increasingly hard puzzles, battles increasingly more difficult enemies, and finds increasingly rare loot. It'll be a point and click bringing the player from one chamber to the next, over and over, each time aging them an entire year. Meanwhile, he'll still be communicating and combating enemies, Mythical Creatures, and now demons. Until finally, he reaches the end and enters through into the world's largest empire.

### Adulthood in Empire
The player, entering into an entirely alien world will have to find a way to adapt quickly. The very first combat in the city will be matching wits with a child they bump into. It's an unwinnable fight. This is when the player realized just how much more advanced this civilization is and must seek help. During this time, the player visits countless different warring factions within the empire, running errands, sparring with, spying on the neighboring factions, whatever the player decides is still morally acceptable. Each faction has a theme around a common philosophical school of thought (ie. Existentialists vs. Theists). The plan is to gain trust in a faction and for them to provide you a way into the castle. Each faction has a different idea of what's morally okay and how far are you willing to go to achieve your goals.

### Adulthood in Castle
After the player finally achieves a way into the castle, they'll have to either brute force their way to the King's chamber (Body Tactics), set traps and be stealthy (Mind Tactics), or influence guards, maids, and other thinkers with their charm (Heart Tactics). When they finally do, they're met with n-members of the King's royal circle. After besting them all in games of wit, you have finally proven yourself worthy to become the King's advisor and bring stability back to the world.

### _Multiple Endings_
The game will give the players free reign to align themselves with just about anyone. The player can befriend fellow thinkers, lesser mythical creatures, entire factions, cultists, priests, evil paladins, or even demons.

For instance fully "signing your soul over to a demon" allows for fallacy boosts, equipment, static passive (de)buffs, and if they truly give in, the player can summon the demon to fight in their place if they feel outwitted.

The catch is that you will just be that demon's puppet when you become advisor or else you'll have a fate worse than death (which is definitely and ending a player could experience).

That's just a few examples for how this can be implemented.

## What is the setting?
>(THE MOST IMPORTANT NOTE: The setting is incredibly similar to the game Mork Borg. I want everything to be festering, dreary, disease-ridden, and dystopian)

### The Empire

At the heart of the world, there is the largest empire ever built surrounded by the largest labyrinth ever built. It's a fully self-sustaining city, complete with the most advanced thinkers of the world. It's so big, there are in-fact mines in the walls, forests, and even a lake.

### The Starting Town
The Player begins their journey in a humble little sea-faring village that exists along the largest river in the world on one side, and ocean on the other side. Nobody's particularly wealthy and family is the most important thing to these people.

### Necronia (Placeholder name)
A town forever scourged in darkness, death, and unholy ideals. This is where all the cultists, evil paladins, executioners, and undead come from. There's a large black pyramid in the center of the village ozzing a green fluid down it's size like a neon green waterfall. It's larger than any other mountain in the world. This is also where the King's old advisor was from.

> (Note: _The Player will not have access to this area unless they unlock a specific ending that will add a new optional questline if achieved_)

### The Labyrinth
Filled with ladders, chutes, stairs, secret passageways, traps, mythical creatures, other thinkers on their pilgrimage, cultists, demons, dead ends, and various trials. The inside will have seemingly impossible rooms, like a room where everything is white and a single, very large tree is growing upside-down, with its roots in the ceiling.

> (NOTE: _I want the labyrinth to look and behave like the book "Maze - Solve the World's Most Challenging Puzzle (1985)_")

#### Other Notable places:
* A Mountain range of Volcanos connected via underground cave systems
* Cityscape (streets)
* Cityscape (courtroom)
* A Swamp city inhabited by anthropomorphic Cockroaches.
* A series of Islands

## Who are the enemies? (Just the beginning of the compendium)
### Forest Spirits (In forest north of the starting town)
Simple little sprites that like to stir up chaos by constantly straw-manning people into believing all types of things. This'll be the player's introduction to the combat in the game.

### Starting Forest Legendary Elk
This Legendary Elk is met at the center of the forest and if bested in combat, will share his secret to the forest. After being bested in battle, the Elk will ask a simple thought experiment (ie. Trolley problem) and will teach the player either a fallacy or a paradox. Either way, the player accumulates their first ever "Special Atk". The Elk will then request the player travels further north to some loggers destroying the forest and to use their newly-found power to drive out the loggers. If the player succeeds, the Elk promises to assist the player in acquiring the lumber needed for the boat.

### Demons (Introduced after player dies in the city)
Demons are a special entity that offers two different boons:
1) An Upgrade (whether that's equipment, your base stats, your fallacies, paradoxes, etc.)
2) The ability to summon the demon to assist in combat.

For #1, this requires the player to sacrifice something (or someone). The player must break one of their core beliefs and take a hit to their stats in order to accept the boon without becoming "Inauthentic" (when a player makes a decision that goes against their pillars of principles).

For #2, this requires a much greater sacrifice, however, it's not immediate. The player must sacrifice their own soul in order to gain an exuberant amount of power very quickly. There'll be no downside until the player becomes the King's Advisor. The player will have the choice of doing what the demon asks of them. Or they can turn their back on the demon and try to get away by "duping" the demon. This will cause a number of different endings, almost all of them with terrible endings.

#### Enemies that need more explanation still:
* Cultists of Necronia
* Evil Paladins of Necronia
* Evil Clerics of Necronia
* Ex-priests of Necronia
* Priests of starting towns and other towns
* Philosophers from all around the world
* 

## What does exploration look like?
Exploration will be broken down into 3 parts for the Exploration Screen:
1) Player stats will be at the bottom of the page (ie. Health, Mana, Body, Mind, Hearth, and Experience). 

> Note: _Take a look at exploration_collapsed.png_ for reference
> Note: _Take a look at exploration_expanded.png_ to understand the functionality of the exploration screen.

## What does combat look like?

Combat is broken down into a few steps that are all done at the same time. It'll look something like this:

- Combat initiates
- Player chooses between: Body/Mind/Soul/Items
- Enemy secretly makes the same choice
- The player then selects an action:
    - Attack
    - Special Attack
    - Defend
- Again, the enemy does the same.
- The Outcome is calculated
    - If either side chose Atk/spAtk, they'll have to make an attack roll (1d20), success is dependant upon any bonuses or penalities the player has to their attack. If that calculated number is higher than the defending player's evasion, damage is calculated.
        - Damage is dependent on the character's stats and buffs, and the enemies's debuffs, but also whether they are in an advantageous position.
        - Body > Mind > Heart > Body*
            - _Will elaborate more below_
- Once the damage and (de)buffs are calculated, check the speed of each player in that moment (since debuffs can lower speed).
- Fastest player deals damage/(de)buffs first (Unless otherwise stated via equipment, etc.)
- Repeat the process until the player and the combatant have decided to agree to disagree or either player drops to 0hp

### Special Rules for Combat

- Player chooses between Body, Mind, and Heart
- Player then chooses Atk, spAtk, or Defend


> Remember: _Body > Mind > Heart > Body_

> __x__ = damage (Damage a player or enemy down to 0 HP and combat is over)

> __bdb__ = buff or debuff

> __special__ = Fallacy/Paradox testing

> __<->__ = Damage in both ways if 2nd combatant doesn't die from the atk

> __ag__ = Agreement (3 agreement points and combat comes to an "agree to disagree")

```
Format: pSelection <-> eSelection =
             playerDamageToEnemy <-> enemyDamageToPlayer>
```
#### When player has ADVANTAGE
* Atk <-> Atk     = 1x <-> 0.5x
* Atk <-> spAtk   = 1x <-> 0.25x (w/ bdb)
* Atk <-> Def     = 0.5x <-> 0.25x/0x (Fallacy Mini-game*)
* spAtk <-> Atk   = 1x (w/bdb) <-> 0.5x
* spAtk <-> spAtk = 1x (w/bdb) <-> 0.5x (w/bdb)
* spAtk <-> Def   = 0.5 (w/bdb) <-> 0.25x/0x (Fallacy Mini-game*)
* Def <-> Atk     = 0x/0.5x <-> 0x/0.25x (Fallacy Mini-game*)
* Def <-> spAtk   = 0x/0.5x <-> 0x/0.10 (Fallacy Mini-game*)
* Def <-> Def     =  0x <-> 0x (Gain 1 agreement Point)

#### When Neither player has ADVANTAGE OR DISADVANTAGE
* Atk <-> Atk     = 1x <-> 1x
* Atk <-> spAtk   = 1x <-> 0.50 (w/bdb) 
* Atk <-> Def     = 0.5x <-> 0.5x/0.25x (Fallacy Mini-game*)
* spAtk <-> Atk   = 0.5x (w/bdb) <-> 1x
* spAtk <-> spAtk = 0.5x (w/ bdb) <-> 0.5x (w/bdb)
* spAtk <-> Def   = 0x/0.50x (w/ bdb) <-> 0x/0.5x 
* Def <-> Atk     = 0x/0.50x <-> 1x
* Def <-> spAtk   = 0x/0.50x <-> 0.5x (w/bdb)
* Def <-> Def     = 0x <-> 0x (Gain 1 agreement Point)

#### When player has DISADVANTAGE
* Atk <-> Atk     = 0.5x <-> 1x
* Atk <-> spAtk   = 0.25x (w/ bdb applied after the hit) <-> 1x 
* Atk <-> Def     = 0x/0.25x/ (Fallacy Mini-game*) <-> 0.5x 
* spAtk <-> Atk   = 0.5x <-> 1x (w/bdb) 
* spAtk <-> spAtk = 0.5x (w/bdb) <-> 1x (w/bdb) 
* spAtk <-> Def   = 0x/0.25x (Fallacy Mini-game*) <-> 0.5 (w/bdb)
* Def <-> Atk     = 0x/0.25x (Fallacy Mini-game*) <-> 0x/0.5x 
* Def <-> spAtk   = 0x/0.10 (Fallacy Mini-game*) <-> 0x/0.5x
* Def <-> Def     = 0x <-> 0x (Gain 1 agreement Point)

#### Fallacy Mini-game
If either player or enemy chooses "Def", then the person who didn't say defend will use a fallacy of their choice. If the "Defensive" player can select from their list of fallacies they're able to spot, they take half, or no damage at all.

## What does the SiteMap look like?
* Landing Page
* Login Page
* Register Page
* Loading Screen
  * Take creative liberties here, but render this page while "/get-character" is loading.
* Character Page
    * Render Loading page while we hit "/get-character". The response will contain `{hasCharacter: boolean}`
    * Character Selection Page (hasCharacter == false):
        * I'd like to see an area that's a dotted line, curved rectangle (border radius) with a "+" icon in the center and the text "Create Character". If the user clicks on this
        * Once the user clicks on "Create Character" render a character creations screen. The can select the their portrait from a dropdown list of images. Whatever they select, render it large, inside the card. Also, in the card will be their starting stats. These portraits can be found here in "/public/images/portraits. Please include all of them in the dropdown, but for now, only "elf", "Drake", and "Arc-mage" can be used. If the player chooses one of the other portraits, render the image as normal, except add a "Locked" overlay to the image and prevent the user from clicking "Create Character".
    * Character Selection Page (hasCharacter == true)
        * This is simple, just make a giant card that has their character's current stats on it. Again, as "Dark Fantasy" as possible. Take inspiration from "Mork Borg", "Elden Ring", and "Buriedbornes". Once the user clicks on their character, bring then to "/exploration" and render their stats on the card.
    * I'd like a single source of truth while we mock this, so please make a CharacterContext. This is what will call "/get-character" and it will store all the character's current data to be used in any child component.
* [Map Exploration Page](exploration_collapsed.png)
  * Explanation: (/exploration)
    * This page consists of three windows:
      * Top left Pane: A Higher Order Component called Description that houses the player's current map location description or current interaction. At the top it will have either "Location Icon and 'Location'" or "Event Icon and 'Event'". This component will also have a "ButtonContainer" section, and whatever components are children of this <Description> (top left pane) component, will render as buttons at the bottom left/
      * Top Right Pane: For now, this will just be a "Image". What I'd like to see is that this "Map" use a useMapLocation Hook that get's the player's current location and then renders a specific map based on that information. For now, just have it be an image with a custom hook that just returns which image to render. For now, just use whatever picsum link you'd like.
      * Bottom Pane: This will contain the character's portrait, name, Max Hit Points, Current Hitpoints, Max Mind Points, Current Mind Points, an experience bar with current and amount needed to level up, three stats "Body", "Mind", and "Heart" with their respective values. I would like this pane to be clickable as it will expand and collapse. [This image is the collapsed version](exploration_collapsed.png) and [This image is the expanded version](exploration_expanded.png). Lastly, there's the the tooltip in the lower left hand corner of this pane. For now, fill it with a list of Lorum Ipsum, but it will eventually contain all stats and mechanics of the game.
* [Combat Page](combat.png)
  * Top pane will have the enemy's portrait, Name, Current, and max HP.
  * Middle Pane will have the updated log of the battle. The results of each turn will be put in here. For now, just lorem ipsum
  * Bottom Pane
  * Left Pane: Current Character's portrait, Name, Level, current HP, Max HP, current MP, and max MP. There'll be trhee buttons inside this card: Body, Mind, Heart. Each one of these, when clicked, will change the color of the "Attack/defend/Sp. Atk buttons. This is because if you look at the game-documentation, a player has to select the "move type" first, then their action. So for instance, they click Body, then Attack. Depending on if they chose Body, Mind, or HEart, either the player is at an advantage (ie. Body > Mind), Equal (ie. Body > Body), or Disadvantage (ie. Body > Heart).