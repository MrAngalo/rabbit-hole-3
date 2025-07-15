export function fixPlural(singular: string, plural: string, count: number) {
    return count === 1 ? singular : plural;
}
