import {
  Avatar,
  Box,
  Card,
  Center,
  Grid,
  GridItem,
  Tag,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { GuildBase } from "types"

type Props = {
  guilds: GuildBase[]
  randomOrderedGuilds: GuildBase[]
  onSuccessGuess: () => void
  onFailGuess: () => void
}

const PairTheGuild = ({
  guilds,
  randomOrderedGuilds,
  onSuccessGuess,
  onFailGuess,
}: Props) => {
  const [step, setStep] = useState(0)
  const [guessedGuilds, setGuessedGuilds] = useState<GuildBase[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { colorMode } = useColorMode()

  useEffect(() => {
    setError(false)
    setSuccess(false)
  }, [guilds, randomOrderedGuilds])

  // Handles the guessing logic for the PairTheGuild game.
  const onGuess = (guildId: number): void => {
    if (guildId === randomOrderedGuilds[step].id) {
      setStep(step + 1)
      guessedGuilds.push(randomOrderedGuilds[step])

      if (step === guilds.length - 1) {
        setStep(0)
        setGuessedGuilds([])
        onSuccessGuess()
        setSuccess(true)
      }
    } else {
      setError(true)
      setGuessedGuilds([])
      setStep(0)
      onFailGuess()
    }
  }

  // Formats a number to include a "k" suffix if it is greater than 1000.
  const formatNumber = (number: number): string => {
    if (number > 1000) {
      const formattedNumber = (number / 1000).toFixed(0)
      return `${formattedNumber}k`
    } else {
      return number.toString()
    }
  }

  return (
    <Card py={4} px={10}>
      <Center mt={5}>
        <Text
          fontWeight={700}
          fontSize={"xl"}
          fontFamily="display"
          align={"center"}
          mb={5}
        >
          Pair the logos to their guilds
        </Text>
      </Center>

      <Center>
        {guilds?.map((guild) => (
          <Box key={guild.id} m={isMobile ? 2 : 5}>
            <Avatar
              style={{
                cursor: "pointer",
                opacity: error || success ? 0.5 : 1,
                pointerEvents: error || success ? "none" : "auto",
              }}
              src={guild.imageUrl}
              size={isMobile ? "md" : "lg"}
              onClick={() => onGuess(guild.id)}
            />
          </Box>
        ))}
      </Center>

      <Center>
        {error && (
          <Text
            color="red.500"
            fontWeight={600}
            fontFamily="display"
            fontSize={isMobile ? "xs" : "xl"}
            align={"center"}
          >
            Wrong! You can see the correct order below.
          </Text>
        )}

        {success && (
          <Text
            color="green.500"
            fontWeight={600}
            fontFamily="display"
            fontSize={isMobile ? "xs" : "xl"}
            align={"center"}
          >
            Correct order! Let me find another one...
          </Text>
        )}
      </Center>

      <Box>
        {randomOrderedGuilds?.map((guild) => (
          <Card
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            my={isMobile ? 3 : 5}
            key={guild.id}
            px={isMobile ? 3 : 10}
            py={5}
          >
            <Grid templateColumns="repeat(4, 1fr)">
              <GridItem colSpan={1} mr={isMobile ? 4 : 0}>
                <Box
                  border={`${error ? "2px solid red" : "1px dashed grey"}`}
                  borderRadius={100}
                  width={isMobile ? 14 : 20}
                  height={isMobile ? 14 : 20}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {(guessedGuilds.includes(guild) || error || success) && (
                    <Avatar
                      size={isMobile ? "sm" : "lg"}
                      src={guild.imageUrl}
                      width={isMobile ? 14 : 20}
                      height={isMobile ? 14 : 20}
                      padding={1}
                    />
                  )}
                </Box>
              </GridItem>

              <GridItem colSpan={3}>
                <Box>
                  <Text
                    mb={2}
                    fontFamily={"display"}
                    fontWeight={700}
                    fontSize={isMobile ? "md" : "xl"}
                  >
                    {guild.name}
                  </Text>

                  <Tag mr={2} fontSize={isMobile ? "2xs" : "md"}>
                    {guild.rolesCount} role
                  </Tag>
                  <Tag fontSize={isMobile ? "2xs" : "md"}>
                    {formatNumber(guild.memberCount)}
                  </Tag>
                </Box>
              </GridItem>
            </Grid>
          </Card>
        ))}
      </Box>
    </Card>
  )
}

export default PairTheGuild
