
import React, { useContext, useEffect, useState } from 'react'
import AppContext from 'renderer/AppContext';
import { Heading } from '../Display/Text';

const TimelyReminder: React.FC = () => {

    const { currentTime } = useContext(AppContext);

    if (currentTime.getDay() === 0 && currentTime.getHours() > 18) { // it is sunday, after 6pm
        return (
            <Heading
                content={'// Bins go out tonight //'}
                colour='orange'
                fontWeight={200}
                fontSize={40}
            />
        )
    }

    return null
}

export default TimelyReminder