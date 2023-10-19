import {
  Alert,
  Box,
  Heading,
  Select,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import GuessTheLogo from "components/guild-game/GuessTheLogo"
import PairTheGuild from "components/guild-game/PairTheGuild"
import _ from "lodash"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  defaultGuilds: GuildBase[]
  defaultCurrentGuild: GuildBase
  randomOrderedGuilds: GuildBase[]
}

const GuessTheGuild = ({
  defaultGuilds,
  defaultCurrentGuild,
  randomOrderedGuilds,
}: Props): JSX.Element => {
  const [guilds, setGuilds] = useState<GuildBase[]>(defaultGuilds)
  const [randomGuilds, setRandomGuilds] = useState<GuildBase[]>(randomOrderedGuilds)
  const [currentGuild, setCurrentGuild] = useState(defaultCurrentGuild)
  const [score, setScore] = useState<number>()
  const [record, setRecord] = useState<number>()
  const [showGuessGame, setShowGuessGame] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [newRecord, setNewRecord] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const scoreFromLocalStorage = localStorage.getItem("score")
    const recordFromLocalStorage = localStorage.getItem("record")

    if (scoreFromLocalStorage) {
      setScore(parseInt(scoreFromLocalStorage))
    } else {
      setScore(0)
    }

    if (recordFromLocalStorage) {
      setRecord(parseInt(recordFromLocalStorage))
    } else {
      setRecord(0)
    }
  }, [])

  // Function that is called when the user successfully guesses the guild
  const onSuccessGuess = (): void => {
    onScoreGuess("guess")
    setIsLoading(true)

    setTimeout(() => {
      initNewGame()
    }, 4000)
  }

  // Resets the score and starts a new game after a failed guess.
  const onFailGuess = (): void => {
    resetScore()
    setIsLoading(true)

    setTimeout(() => {
      initNewGame()
    }, 4000)
  }

  // Updates the score and record based on the type of guess made.
  const onScoreGuess = (type: "pair" | "guess"): void => {
    if (type === "pair") {
      localStorage.setItem("score", (score + 2).toString())
      setScore(score + 2)
    } else {
      localStorage.setItem("score", (score + 1).toString())
      setScore(score + 1)
    }

    if (score + 1 > record || score + 2 > record) {
      if (type === "pair") {
        setRecord(score + 2)
        localStorage.setItem("record", (score + 2).toString())
      } else {
        setRecord(score + 1)
        localStorage.setItem("record", (score + 1).toString())
      }
      setNewRecord(true)

      setTimeout(() => {
        setNewRecord(false)
      }, 4000)
    }
  }

  // Resets the score to 0 and updates the localStorage.
  const resetScore = (): void => {
    localStorage.setItem("score", "0")
    setScore(0)
  }

  // Initializes a new game by fetching a set of guilds from the server and setting the current guild and random guilds.
  const initNewGame = async (): Promise<void> => {
    let randomOffset: number

    if (difficulty === "easy") {
      randomOffset = Math.floor(Math.random() * 100)
    } else if (difficulty === "medium") {
      randomOffset = Math.floor(Math.random() * 500)
    } else {
      randomOffset = Math.floor(Math.random() * 1000)
    }
    const limit = 4

    await fetcher(`/v2/guilds?limit=${limit}&offset=${randomOffset}`).then(
      (newGuilds) => {
        const newCurrentGuild =
          newGuilds[Math.floor(Math.random() * newGuilds.length)]
        setCurrentGuild(newCurrentGuild)
        setGuilds(newGuilds)
        setRandomGuilds(_.shuffle(newGuilds))
        setShowGuessGame(Math.random() < 0.5)
        setIsLoading(false)
      }
    )
  }

  // Callback function that is called when a pair of guilds is successfully guessed. It updates the score by calling `onScoreGuess` function and initiates a new game after a delay of 4 seconds.
  const onPairSuccess = (): void => {
    onScoreGuess("pair")
    setTimeout(() => {
      initNewGame()
    }, 4000)
  }

  return (
    <Layout title="Guess the Guild">
      <Box w="fit-content">
        <Select
          size={isMobile ? "md" : "lg"}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          value={difficulty}
          mb={6}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
      </Box>

      <Box>
        <Heading fontFamily="display" fontSize={isMobile ? "lg" : "xl"}>
          Score: {score}
        </Heading>
        <Heading fontFamily="display" fontSize={isMobile ? "lg" : "xl"}>
          Record: {record}
        </Heading>

        {newRecord && (
          <Alert status="info" mt={6}>
            <Text
              fontFamily="display"
              color={"green.500"}
              fontWeight={700}
              fontSize={isMobile ? "sm" : "xl"}
            >
              New record! {record} points! Congratulations!
            </Text>
          </Alert>
        )}

        <Box mt={10}>
          {showGuessGame ? (
            <GuessTheLogo
              guilds={guilds}
              currentGuild={currentGuild}
              onSuccessGuess={onSuccessGuess}
              onFailGuess={onFailGuess}
              isLoading={isLoading}
            />
          ) : (
            <PairTheGuild
              guilds={guilds}
              randomOrderedGuilds={randomGuilds}
              onSuccessGuess={onPairSuccess}
              onFailGuess={onFailGuess}
            />
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const randomOffset = Math.floor(Math.random() * 100)
  const limit = 4

  const defaultGuilds = await fetcher(
    `/v2/guilds?sort=members&limit=${limit}&offset=${randomOffset}`
  ).catch((_) => [])

  const defaultCurrentGuild =
    defaultGuilds[Math.floor(Math.random() * defaultGuilds.length)]

  const randomOrderedGuilds = _.shuffle(defaultGuilds)

  return {
    props: { defaultGuilds, defaultCurrentGuild, randomOrderedGuilds },
    revalidate: 300,
  }
}

export default GuessTheGuild
