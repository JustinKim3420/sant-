import { Box } from "@mui/material"
import { ReactElement } from "react"

const Page = ({ children }: { children: ReactElement | ReactElement[] }) => {

    return <Box
        sx={{
            padding: "2rem"
        }}
    >
        {children}
    </Box>
}
export default Page