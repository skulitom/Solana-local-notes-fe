import { Box, VStack, Spacer, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"
import { Note } from "../models/Note"
import { LOCATION_MULTIPLE } from "../utils/constants"

export interface CardProps {
    note: Note
    onClick: () => void
}

export const NoteCard: FC<CardProps> = (props) => {
    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
            _hover={{
                background: "gray.900",
            }}
            onClick={props.onClick}
        >
            <Stack
                w="full"
                align={{ base: "center", md: "stretch" }}
                textAlign={{ base: "center", md: "left" }}
                mt={{ base: 4, md: 0 }}
                ml={{ md: 6 }}
                mr={{ md: 6 }}
            >
                <VStack>
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="lg"
                        letterSpacing="wide"
                        color="gray.200"
                    >
                        {props.note.title}
                    </Text>
                    <Spacer />
                    <Text
                        fontSize="lg"
                        letterSpacing="wide"
                        color="gray.200"
                    >
                        {props.note.text}
                    </Text>
                    <Spacer />
                    <Text color="gray.200">{props.note.latitude/LOCATION_MULTIPLE}</Text>
                    <Text color="gray.200">{props.note.longitude/LOCATION_MULTIPLE}</Text>
                </VStack>
            </Stack>
        </Box>
    )
}
