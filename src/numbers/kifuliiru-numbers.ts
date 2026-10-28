/**
 * Kifuliiru Numbers System - TypeScript Migration
 * Converted from Python with full functionality preserved
 */

export class KifuliiruNumbers {
  private units: { [key: number]: string } = {
    0: "Ubusha",
    1: "higuma",
    2: "bubiri",
    3: "bushatu",
    4: "buna",
    5: "butanu",
    6: "ndatu",
    7: "bulinda",
    8: "munaana",
    9: "mweenda",
  }

  private tens: { [key: number]: string } = {
    1: "ikumi",
    2: "makumi gabiri",
    3: "makumi gashatu",
    4: "makumi gana",
    5: "makumi gatanu",
    6: "makumi galiindatu",
    7: "makumi galiinda",
    8: "makumi galimunaana",
    9: "makumi galimweenda",
  }

  private hundreds: { [key: number]: string } = {
    1: "igana",
    2: "magana gabiri",
    3: "magana gashatu",
    4: "magana gana",
    5: "magana gatanu",
    6: "magana galiindatu",
    7: "magana galiinda",
    8: "magana galimunaana",
    9: "magana galimweenda",
  }

  private thousandUnits: { [key: number]: string } = {
    1: "kiguma",
    2: "bibiri",
    3: "bishatu",
    4: "bina",
    5: "bitanu",
    6: "ndatu",
    7: "biriinda",
    8: "munaana",
    9: "mweenda",
  }

  private millionUnits: { [key: number]: string } = {
    1: "muguma",
    2: "ibiri",
    3: "ishatu",
    4: "ina",
    5: "itanu",
    6: "ndatu",
    7: "iriinda",
    8: "munaana",
    9: "mweenda",
    10: "ikumi",
  }

  private capitalizeFirst(text: string): string {
    if (!text) return text
    return text[0].toUpperCase() + text.slice(1)
  }

  numberToKifuliiru(num: number): string {
    // Handle negative numbers
    if (num < 0) {
      return `Butali ${this.numberToKifuliiru(Math.abs(num))}`
    }

    // Special case
    if (num === 0) {
      return "Ubusha"
    }

    let result = ""

    // Handle sextillions (1,000,000,000,000,000,000,000+) - Trilliard
    if (num >= 1000000000000000000000) {
      const sextillions = Math.floor(num / 1000000000000000000000)
      const remainder = num % 1000000000000000000000

      if (sextillions === 1) {
        result = "Umutirilyari"
      } else if (sextillions <= 10) {
        result = `Imitirilyari ${this.millionUnits[sextillions]}`
      } else {
        const sextillionsPart = this.numberToKifuliiru(sextillions).toLowerCase()
        result = `Imitirilyari ${sextillionsPart}`
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("imitirilyoni")) {
          result += ` ne'mitirilyoni${remainderText.slice(12)}`
        } else if (remainderText.startsWith("ibilyari")) {
          result += ` ne'bilyari${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ibilyoni")) {
          result += ` ne'bilyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyari")) {
          result += ` ne'milyari${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyoni")) {
          result += ` ne'milyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle quintillions (1,000,000,000,000,000,000+) - Trillion
    if (num >= 1000000000000000000) {
      const quintillions = Math.floor(num / 1000000000000000000)
      const remainder = num % 1000000000000000000

      if (quintillions === 1) {
        result = "Umutirilyoni"
      } else if (quintillions <= 10) {
        result = `Imitirilyoni ${this.millionUnits[quintillions]}`
      } else {
        const quintillionsPart = this.numberToKifuliiru(quintillions).toLowerCase()
        result = `Imitirilyoni ${quintillionsPart}`
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("ibilyari")) {
          result += ` ne'bilyari${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ibilyoni")) {
          result += ` ne'bilyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyari")) {
          result += ` ne'milyari${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyoni")) {
          result += ` ne'milyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle quadrillions (1,000,000,000,000,000+) - Billiard
    if (num >= 1000000000000000) {
      const quadrillions = Math.floor(num / 1000000000000000)
      const remainder = num % 1000000000000000

      if (quadrillions === 1) {
        result = "Umubilyari"
      } else if (quadrillions <= 10) {
        result = `Ibilyari ${this.millionUnits[quadrillions]}`
      } else {
        const quadrillionsPart = this.numberToKifuliiru(quadrillions).toLowerCase()
        result = `Ibilyari ${quadrillionsPart}`
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("ibilyoni")) {
          result += ` ne'bilyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyari")) {
          result += ` ne'milyari${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyoni")) {
          result += ` ne'milyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle trillions (1,000,000,000,000+) - Billion (French)
    if (num >= 1000000000000) {
      const trillions = Math.floor(num / 1000000000000)
      const remainder = num % 1000000000000

      if (trillions === 1) {
        result = "Umubilyoni"
      } else if (trillions <= 10) {
        result = `Ibilyoni ${this.millionUnits[trillions]}`
      } else {
        const trillionsPart = this.numberToKifuliiru(trillions).toLowerCase()
        result = `Ibilyoni ${trillionsPart}`
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("imilyari")) {
          result += ` ne'milyari${remainderText.slice(8)}`
        } else if (remainderText.startsWith("imilyoni")) {
          result += ` ne'milyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle billions (1,000,000,000+)
    if (num >= 1000000000) {
      const billions = Math.floor(num / 1000000000)
      const remainder = num % 1000000000

      if (billions === 1) {
        result = "Umulyari"
      } else if (billions <= 10) {
        result = `Imilyari ${this.millionUnits[billions]}`
      } else {
        const billionsPart = this.numberToKifuliiru(billions).toLowerCase()
        result = `Imilyari ${billionsPart}`
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("imilyoni")) {
          result += ` ne'milyoni${remainderText.slice(8)}`
        } else if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle millions (1,000,000+)
    if (num >= 1000000) {
      const millions = Math.floor(num / 1000000)
      const remainder = num % 1000000

      if (millions === 1) {
        result = "Umulyoni"
      } else if (millions <= 10) {
        result = `Imilyoni ${this.millionUnits[millions]}`
      } else {
        const millionsPart = this.numberToKifuliiru(millions).toLowerCase()
        result = `Imilyoni ${millionsPart}`
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle thousands (1,000+)
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000)
      const remainder = num % 1000

      if (thousands === 1) {
        result = "Kihumbi"
      } else if (thousands <= 9) {
        result = `Bihumbi ${this.thousandUnits[thousands]}`
      } else if (thousands === 10) {
        result = "Bihumbi ikumi"
      } else if (thousands < 20) {
        result = `Bihumbi ikumi na ${this.thousandUnits[thousands - 10]}`
      } else if (thousands < 100) {
        const tensDigit = Math.floor(thousands / 10)
        const unitsDigit = thousands % 10

        result = `Bihumbi ${this.tens[tensDigit]}`
        if (unitsDigit > 0) {
          result += ` na ${this.thousandUnits[unitsDigit]}`
        }
      } else {
        const hundredsDigit = Math.floor(thousands / 100)
        const tensRemainder = thousands % 100

        result = `Bihumbi ${this.hundreds[hundredsDigit]}`

        if (tensRemainder > 0) {
          const tensRemainderText = this.numberToKifuliiru(tensRemainder).toLowerCase()

          if (tensRemainderText.startsWith("ikumi")) {
            result += ` n'ikumi${tensRemainderText.slice(5)}`
          } else {
            result += ` na ${tensRemainderText}`
          }
        }
      }

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle hundreds (100-999)
    if (num >= 100) {
      const hundredsDigit = Math.floor(num / 100)
      const remainder = num % 100

      result = this.hundreds[hundredsDigit]

      if (remainder > 0) {
        const remainderText = this.numberToKifuliiru(remainder).toLowerCase()

        if (remainderText.startsWith("ikumi")) {
          result += ` n'ikumi${remainderText.slice(5)}`
        } else {
          result += ` na ${remainderText}`
        }
      }

      return this.capitalizeFirst(result)
    }

    // Handle tens (10-99)
    if (num >= 10) {
      const tensDigit = Math.floor(num / 10)
      const unitsDigit = num % 10

      result = this.tens[tensDigit]

      if (unitsDigit > 0) {
        result += ` na ${this.units[unitsDigit]}`
      }

      return this.capitalizeFirst(result)
    }

    // Handle units (1-9)
    return this.capitalizeFirst(this.units[num])
  }

  numberToEnglish(num: number): string {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 
                   'sixteen', 'seventeen', 'eighteen', 'nineteen']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    
    if (num === 0) return 'Zero'
    if (num < 10) return ones[num].charAt(0).toUpperCase() + ones[num].slice(1)
    if (num < 20) return teens[num - 10].charAt(0).toUpperCase() + teens[num - 10].slice(1)
    if (num < 100) {
      const result = tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100)
      const remainder = num % 100
      const result = ones[hundred] + ' hundred' + (remainder ? ' ' + this.numberToEnglish(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000)
      const remainder = num % 1000
      const result = this.numberToEnglish(thousand) + ' thousand' + (remainder ? ' ' + this.numberToEnglish(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000)
      const remainder = num % 1000000
      const result = this.numberToEnglish(million) + ' million' + (remainder ? ' ' + this.numberToEnglish(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000000) {
      const billion = Math.floor(num / 1000000000)
      const remainder = num % 1000000000
      const result = this.numberToEnglish(billion) + ' billion' + (remainder ? ' ' + this.numberToEnglish(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000000000) {
      const trillion = Math.floor(num / 1000000000000)
      const remainder = num % 1000000000000
      const result = this.numberToEnglish(trillion) + ' trillion' + (remainder ? ' ' + this.numberToEnglish(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000000000000) {
      const quadrillion = Math.floor(num / 1000000000000000)
      const remainder = num % 1000000000000000
      const result = this.numberToEnglish(quadrillion) + ' quadrillion' + (remainder ? ' ' + this.numberToEnglish(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    return num.toString()
  }

  numberToFrench(num: number): string {
    const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 
                   'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 
                  'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix']
    
    if (num === 0) return 'Zéro'
    if (num < 10) return ones[num].charAt(0).toUpperCase() + ones[num].slice(1)
    if (num < 20) return teens[num - 10].charAt(0).toUpperCase() + teens[num - 10].slice(1)
    if (num < 100) {
      if (num === 20) return 'Vingt'
      if (num < 70) {
        const result = tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
      if (num < 80) {
        if (num === 70) return 'Soixante-dix'
        const result = 'soixante-' + teens[num - 70]
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
      if (num < 100) {
        if (num === 80) return 'Quatre-vingt'
        if (num === 90) return 'Quatre-vingt-dix'
        if (num < 90) {
          // 81-89
          const result = 'quatre-vingt-' + ones[num - 80]
          return result.charAt(0).toUpperCase() + result.slice(1)
        } else {
          // 91-99
          const result = 'quatre-vingt-' + teens[num - 90]
          return result.charAt(0).toUpperCase() + result.slice(1)
        }
      }
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100)
      const remainder = num % 100
      const result = (hundred === 1 ? '' : ones[hundred] + ' ') + 'cent' + (remainder ? ' ' + this.numberToFrench(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000)
      const remainder = num % 1000
      const result = (thousand === 1 ? '' : this.numberToFrench(thousand) + ' ') + 'mille' + (remainder ? ' ' + this.numberToFrench(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000)
      const remainder = num % 1000000
      const result = this.numberToFrench(million) + ' million' + (remainder ? ' ' + this.numberToFrench(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000000) {
      const milliard = Math.floor(num / 1000000000)
      const remainder = num % 1000000000
      const result = this.numberToFrench(milliard) + ' milliard' + (remainder ? ' ' + this.numberToFrench(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000000000) {
      const billion = Math.floor(num / 1000000000000)
      const remainder = num % 1000000000000
      const result = this.numberToFrench(billion) + ' billion' + (remainder ? ' ' + this.numberToFrench(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000000000000000000) {
      const billiard = Math.floor(num / 1000000000000000)
      const remainder = num % 1000000000000000
      const result = this.numberToFrench(billiard) + ' billiard' + (remainder ? ' ' + this.numberToFrench(remainder) : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    return num.toString()
  }

  numberToSwahili(num: number): string {
    const ones = ['', 'moja', 'mbili', 'tatu', 'nne', 'tano', 'sita', 'saba', 'nane', 'tisa']
    const tens = ['', '', 'ishirini', 'thelathini', 'arobaini', 'hamsini', 'sitini', 'sabini', 'themanini', 'tisini']
    
    if (num === 0) return 'Sifuri'
    if (num < 10) return ones[num].charAt(0).toUpperCase() + ones[num].slice(1)
    if (num === 10) return 'Kumi'
    if (num < 20) {
      const result = 'kumi na ' + ones[num - 10]
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 100) {
      const ten = Math.floor(num / 10)
      const one = num % 10
      const result = tens[ten] + (one ? ' na ' + ones[one] : '')
      return result.charAt(0).toUpperCase() + result.slice(1)
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100)
      const remainder = num % 100
      if (hundred === 1) {
        const result = 'mia moja' + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      } else {
        const result = 'mia ' + ones[hundred] + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000)
      const remainder = num % 1000
      if (thousand === 1) {
        const result = 'elfu moja' + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      } else {
        const result = 'elfu ' + this.numberToSwahili(thousand).toLowerCase() + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
    }
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000)
      const remainder = num % 1000000
      if (million === 1) {
        const result = 'milioni moja' + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      } else {
        const result = 'milioni ' + this.numberToSwahili(million).toLowerCase() + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
    }
    if (num < 1000000000000) {
      const billion = Math.floor(num / 1000000000)
      const remainder = num % 1000000000
      if (billion === 1) {
        const result = 'bilioni moja' + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      } else {
        const result = 'bilioni ' + this.numberToSwahili(billion).toLowerCase() + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
    }
    if (num < 1000000000000000) {
      const trillion = Math.floor(num / 1000000000000)
      const remainder = num % 1000000000000
      if (trillion === 1) {
        const result = 'trilioni moja' + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      } else {
        const result = 'trilioni ' + this.numberToSwahili(trillion).toLowerCase() + (remainder ? ' na ' + this.numberToSwahili(remainder) : '')
        return result.charAt(0).toUpperCase() + result.slice(1)
      }
    }
    return num.toString()
  }

  // Helper method to generate number data for a range
  generateNumberData(start: number, end: number): Array<{
    value: number
    kifuliiru: string
    english: string
    french: string
    kiswahili: string
    metadata: {
      length: number
      complexity: 'simple' | 'complex'
      category: 'basic' | 'advanced'
    }
  }> {
    const data: Array<{
      value: number
      kifuliiru: string
      english: string
      french: string
      kiswahili: string
      metadata: {
        length: number
        complexity: 'simple' | 'complex'
        category: 'basic' | 'advanced'
      }
    }> = []
    
    for (let num = start; num <= end; num++) {
      const kifuliiru = this.numberToKifuliiru(num)
      const english = this.numberToEnglish(num)
      const french = this.numberToFrench(num)
      const kiswahili = this.numberToSwahili(num)
      
      data.push({
        value: num,
        kifuliiru,
        english,
        french,
        kiswahili,
        metadata: {
          length: kifuliiru.length,
          complexity: kifuliiru.length > 20 ? 'complex' : 'simple',
          category: num <= 100 ? 'basic' : 'advanced'
        }
      })
    }
    
    return data
  }
}

// Export singleton instance
export const kifuliiruNumbers = new KifuliiruNumbers()
