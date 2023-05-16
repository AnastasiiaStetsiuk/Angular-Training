export const rabinKarp = (text: string, pattern: string, percentage: number = 0.8): boolean => {
    const patternLength = pattern.length
    const thresholdLength = patternLength * percentage

    for (let i = 0; i <= text.length - patternLength; i++) {
        const substring = text.substring(i, i + patternLength)
        let matchCount = 0

        for (let j = 0; j < patternLength; j++) {
            if (substring[j] === pattern[j]) {
                matchCount++
            }
        }

        if (matchCount >= thresholdLength) {
            return true
        }
    }

    return false
}

export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
}
