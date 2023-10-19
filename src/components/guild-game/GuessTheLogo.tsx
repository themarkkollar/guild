import {
  Avatar,
  Button,
  Card,
  Center,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { GuildBase } from "types"

type Props = {
  guilds: GuildBase[]
  currentGuild: GuildBase
  isLoading: boolean
  onSuccessGuess: () => void
  onFailGuess: () => void
}

const GuessTheLogo = ({
  guilds,
  currentGuild,
  isLoading,
  onSuccessGuess,
  onFailGuess,
}: Props) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { colorMode } = useColorMode()

  useEffect(() => {
    if (!isLoading) {
      setSuccess(false)
      setError(false)
    }
  }, [isLoading])

  // Handles the guessing logic for the GuessTheLogo game.
  const onGuess = (guildId: number): void => {
    if (guildId === currentGuild.id) {
      onSuccessGuess()
      setSuccess(true)
      setError(false)
    } else {
      onFailGuess()
      setError(true)
      setSuccess(false)
    }
  }

  return (
    <Card py={4} px={10}>
      <Center mt={5}>
        <Text fontWeight={700} fontSize={"xl"} fontFamily="display" align={"center"}>
          Guess the guild by the logo
        </Text>
      </Center>

      <Center mt={5} mb={5}>
        <Avatar src={currentGuild?.imageUrl} size={"xl"} />
      </Center>

      <Center mt={5} mb={5}>
        {success && (
          <Text
            color="green.500"
            fontWeight={600}
            fontFamily="display"
            fontSize={isMobile ? "xs" : "xl"}
            align={"center"}
          >
            Good job! Let me find another one...
          </Text>
        )}
        {error && (
          <Text
            color="red.500"
            fontWeight={600}
            fontFamily="display"
            fontSize={isMobile ? "xs" : "xl"}
            align={"center"}
          >
            Wrong! The correct answer was: {currentGuild.name}
          </Text>
        )}
        {!success && !error && (
          <Text
            fontWeight={600}
            fontFamily="display"
            fontSize={isMobile ? "xs" : "xl"}
            align={"center"}
          >
            ???
          </Text>
        )}
      </Center>

      {guilds?.map((guild) => (
        <Button
          key={guild.id}
          onClick={() => onGuess(guild.id)}
          variant="solid"
          my={2}
          isDisabled={isLoading}
          size={isMobile ? "md" : "xl"}
          fontSize={isMobile ? "md" : "xl"}
        >
          {guild.name}
        </Button>
      ))}
    </Card>
  )
}

export default GuessTheLogo
