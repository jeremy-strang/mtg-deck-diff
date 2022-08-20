const companions = [
  'Gyruda, Doom of Depths',
  'Jegantha, the Wellspring',
  'Kaheera, the Orphanguard',
  'Keruga, the Macrosage',
  'Lurrus of the Dream-Den',
  'Lutri, the Spellchaser',
  'Obosh, the Preypiercer',
  'Umori, the Collector',
  'Yorion, Sky Nomad',
  'Zirda, the Dawnwaker',
]

//
export interface DeckLine {
  quantity: number
  card: string
  cardData?: object
}

//
export class Deck {
  companion: DeckLine[]
  mainDeck: DeckLine[]
  sideboard: DeckLine[]

  constructor(companion?: DeckLine[], mainDeck?: DeckLine[], sideboard?: DeckLine[]) {
    this.companion = companion ?? []
    this.mainDeck = mainDeck ?? []
    this.sideboard = sideboard ?? []
  }

  static parse(deckListStr: string): Deck {
    const parsedDeck = new Deck([], [], [])
    const companionsSetLower = new Set(companions.map(comp => comp.toLowerCase()))

    if (deckListStr) {
      let mainDone = false
      let companionDone = true
      for (let line of deckListStr.trim().split('\n').map(l => l.trim().replace(/[\t]/g, ' '))) {
        if (line === 'Companion') {
          companionDone = false
        }

        if (!companionDone && (['', 'Deck', 'Sideboard'].indexOf(line) > -1)) {
          companionDone = true
        } else if (line === '' || line === 'Sideboard') {
          mainDone = true
        }

        if (line.startsWith('+')) {
          line = line.slice(0, line.length)
        }

        if (line.includes(' (')) {
          line = line.slice(0, line.indexOf(' ('))
        }

        let cardName = line.slice(line.indexOf(' '), line.length).trim()
        
        if (/^\d+\s+.*$/.test(line)) {
          let deckLine: DeckLine = {
            quantity: parseInt(line.slice(0, line.indexOf(' '))),
            card: cardName,
          }

          if (!companionDone) {
            parsedDeck.companion = [deckLine]
          } else if (!mainDone) {
            parsedDeck.mainDeck.push(deckLine)
          } else {
            parsedDeck.sideboard.push(deckLine)
            if (companionsSetLower.has(cardName.toLowerCase()) && parsedDeck.companion.length === 0) {
              parsedDeck.companion = [deckLine]
            }
          }
        }
      }
    }

    return parsedDeck
  }

  toString(isDiff?: boolean): string {
    let result = ''

    const joinDeckLines = (deckLines: DeckLine[]) =>
      deckLines.map(item => `${item.quantity > 0 && isDiff ? '+' : ''}${item.quantity} ${item.card}`).join('\n')

    if (this.companion.length > 0) {
      const companionStr = joinDeckLines(this.companion)
      result += `Companion\n${companionStr}\n\n`
    }
    if (this.mainDeck.length > 0) {
      const mainStr = joinDeckLines(this.mainDeck)
      result += `Deck\n${mainStr}\n\n`
    }
    if (this.sideboard.length > 0) {
      const sideStr = joinDeckLines(this.sideboard)
      result += `Sideboard\n${sideStr}\n\n`
    }
    return result
  }

  computeDiff(otherDeck: Deck, ignoredCardNames?: string[]): Deck {
    const ignoredNames = ignoredCardNames ? new Set<string>(ignoredCardNames.map((n) => n.toLowerCase())) : new Set<string>()
    const filterNames = (line: DeckLine) => !ignoredNames.has(line.card.toLowerCase())

    const diff = new Deck(
      this.computeSubDiff(this.companion.filter(filterNames), otherDeck.companion.filter(filterNames)),
      this.computeSubDiff(this.mainDeck.filter(filterNames), otherDeck.mainDeck.filter(filterNames)),
      this.computeSubDiff(this.sideboard.filter(filterNames), otherDeck.sideboard.filter(filterNames)))
    return diff
  }

  private buildCardQuantityMap(items: DeckLine[]): Map<string, number> {
    const result = new Map<string, number>()
    for (let item of items) {
      if (result.has(item.card)) {
        result.set(item.card, item.quantity + (result.get(item.card) ?? 0))
      } else {
        result.set(item.card, item.quantity)
      }
    }
    return result
  }

  private computeSubDiff(deckLines: DeckLine[], otherDeckLines: DeckLine[]): DeckLine[] {
    const thisDeckMap = this.buildCardQuantityMap(deckLines)
    const otherDeckMap = this.buildCardQuantityMap(otherDeckLines)
    const diffDeckMap = new Map<string, number>()


    for (let cq of deckLines) {
      let otherQuantity = otherDeckMap.has(cq.card) ? otherDeckMap.get(cq.card) : 0
      if (otherQuantity !== cq.quantity) {
        diffDeckMap.set(cq.card, (otherQuantity ?? 0) - cq.quantity)
      }
    }

    for (let cq of otherDeckLines) {
      let thisQuantity = thisDeckMap.has(cq.card) ? thisDeckMap.get(cq.card) : 0
      if (thisQuantity !== cq.quantity && !diffDeckMap.has(cq.card)) {
        diffDeckMap.set(cq.card, cq.quantity - (thisQuantity ?? 0))
      }
    }

    const subDiff: DeckLine[] = []

    for (let pair of Array.from(diffDeckMap)) {
      subDiff.push({
        quantity: pair[1],
        card: pair[0],
      })
    }

    return subDiff
  }
}
