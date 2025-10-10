export class SeedService {
  private static instance: SeedService
  private currentSeed: string = 'default'

  private constructor() {}

  static getInstance(): SeedService {
    if (!SeedService.instance) {
      SeedService.instance = new SeedService()
    }
    return SeedService.instance
  }

  getSeed(): string {
    return this.currentSeed
  }

  setSeed(seed: string): void {
    this.currentSeed = seed
  }

  generateDeterministicId(prefix: string): string {
    const seed = this.currentSeed
    const timestamp = Date.now()
    const hash = this.simpleHash(`${seed}-${prefix}-${timestamp}`)
    return `${prefix}-${hash}`
  }

  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  getDeterministicRandom(min: number, max: number, index: number): number {
    const seed = this.simpleHash(`${this.currentSeed}-${index}`)
    const random = parseInt(seed, 36) / Math.pow(36, seed.length)
    return Math.floor(random * (max - min + 1)) + min
  }
}
