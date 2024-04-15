import { CountdownListItem } from "renderer/AppContext";

const REPEATS_ANNUALLY = 'repeatsAnnually'

const CsvToCountdownList = (csvLocation: string): CountdownListItem[] => {

    const items: CountdownListItem[] = []

    // get da file
    
    
    const csvContent: string = ''

    const csvRows = csvContent.split('\n')

    csvRows.forEach(row => {
        const columns = row.split(',')

        const name = columns[0]
        const date = columns[1]
        const repeatsAnnually = columns[2]

        items.push({
            name,
            date,
            repeatsAnnually: repeatsAnnually === REPEATS_ANNUALLY
        })
    })

    return items
}