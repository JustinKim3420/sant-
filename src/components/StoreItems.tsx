import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { Product } from "../clients/product"

const StoreItems = () => {
    const products = Product.getAll()
    return <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem'
        }}
    >
        {
            products.map(product => {
                return <Card
                    sx={{
                        flex: '1 1 4rem'
                    }}
                >
                    <CardContent
                        sx={{
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant='h6' fontWeight={900}>{product.name}</Typography>
                        <Typography variant='h6'>${product.sellingPrice}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {

                        }}>
                            Add to cart
                        </Button>
                    </CardActions>
                </Card>
            })
        }
    </Box>
}

export default StoreItems