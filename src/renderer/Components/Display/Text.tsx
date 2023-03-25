import React from 'react'

export const Heading: React.FC<{
    content: string
    fontSize?: number
    fontWeight?: number
    opacity?: number
    disableMargins?: boolean
}> = (props) => {

    const { 
        content,
        fontSize,
        fontWeight,
        opacity,
        disableMargins
    } = props

    return (
        <h1 style={{
            fontSize,
            fontWeight,
            opacity,
            margin: disableMargins ? 0 : undefined,
        }}>
            {content}
        </h1>
    )
}
