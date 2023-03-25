import React from "react"

interface Coords {
    long: number
    lat: number
}

interface CountdownListItem {
    name: string
    date: string
}

export interface AppContextType {
    location: {
        coords: Coords
    },
    countdownList: CountdownListItem[]
}

const contextDefault: AppContextType = {
    location: {
        coords: {
            long: 0,
            lat: 0
        }
    },
    countdownList: []
}

const AppContext = React.createContext<AppContextType>(contextDefault);

export default AppContext