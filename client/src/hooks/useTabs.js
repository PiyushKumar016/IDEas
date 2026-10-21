import React, { useContext } from 'react'
import { tabsContext } from '../contexts/tabsContext'

export default function useTabs() {
    return useContext(tabsContext);
}
