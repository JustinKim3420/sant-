import { Box, Typography } from "@mui/material"
import { ReactElement } from "react"

interface PageHeaderProps {
    title: string
    actionButtons?: ReactElement
}

const PageHeader = (props: PageHeaderProps) => {
    const { title, actionButtons } = props
    return <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between'
        }}
    >
        <Typography variant='h4'>{title}</Typography>
        {
            actionButtons
                ? <Box>{actionButtons}</Box>
                : <></>
        }
    </Box>
}
export default PageHeader