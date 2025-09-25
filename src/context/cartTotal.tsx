import { createContext, ReactElement, useContext, useState } from 'react'

const CartTotalContext = createContext({ cartTotal: 0, setCartTotal: (newTotal: 0) => { } })

export const CartTotalProvider = ({ children }: { children: ReactElement | ReactElement[] }) => {
    const [cartTotal, setCartTotal] = useState(0);

    return <CartTotalContext.Provider value={{ cartTotal, setCartTotal }}>
        {children}
    </CartTotalContext.Provider>
}

export const useCartTotal = () => {
    return useContext(CartTotalContext)
}