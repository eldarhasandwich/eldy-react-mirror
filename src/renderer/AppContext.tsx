import React from "react"

export interface SECRETS {
    teslascopeApiKey?: string
    teslafiApiKey?: string
}

interface Coords {
    long: number
    lat: number
}

export interface CountdownListItem {
    name: string
    date: string
    repeatsAnnually?: boolean
}

export interface AppContextType {
    secrets: SECRETS,
    location: {
        coords: Coords
    },
    countdownList: CountdownListItem[],
    teslascope?: {
        vehiclePublicId: string
    },
    currentTime: Date
}

const contextDefault: AppContextType = {
    secrets: {},
    location: {
        coords: {
            long: 0,
            lat: 0
        }
    },
    countdownList: [],
    currentTime: new Date(Date.now())
}

const AppContext = React.createContext<AppContextType>(contextDefault);

export default AppContext