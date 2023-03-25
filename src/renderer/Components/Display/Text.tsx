import React from 'react'

export const Heading: React.FC<{
    content: string
    fontSize?: number
    fontWeight?: number
    opacity?: number
    disableMargins?: boolean
}> = (props) => {

    const { 
        fontSize,
        fontWeight,
        opacity
    } = props

    return (
        <h1 style={{
            fontSize,
            fontWeight,
            opacity,
            margin: props.disableMargins ? 0 : undefined,
        }}>
            {props.content}
        </h1>
    )
}

export const TableCell: React.FC<{
    content: string
    fontSize?: number
    fontWeight?: number
    colour?: string
    opacity?: number
}> = (props) => {

    const {
        colour,
        fontSize,
        fontWeight,
        opacity
    } = props;

    return (
        <td
            style={{
                color: colour,
                fontSize,
                fontWeight,
                opacity
            }}
        >
            {props.content}
        </td>
    )
}