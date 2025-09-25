import { Box } from "@mui/material"
import { Product } from "../clients/product"
import PageHeader from "./PageHeader"
import StoreItems from "./StoreItems"

const StorePage = () => {
    const products = Product.getAll()
    return <Box>
        <PageHeader title={`${products.length} Products`} />
        <StoreItems />
    </Box>
}

export default StorePage