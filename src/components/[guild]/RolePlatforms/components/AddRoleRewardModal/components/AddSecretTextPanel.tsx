import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import SecretTextDataForm, {
  SecretTextRewardForm,
} from "platforms/SecretText/SecretTextDataForm/SecretTextDataForm"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const AddSecretTextPanel = ({ onSuccess }: Props) => {
  const { id: userId } = useUser()

  const methods = useForm<SecretTextRewardForm>({ mode: "all" })

  const name = useWatch({ control: methods.control, name: "name" })
  const text = useWatch({ control: methods.control, name: "text" })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const onContinue = (data: SecretTextRewardForm) => {
    append({
      guildPlatform: {
        platformName: "TEXT",
        platformGuildId: `text-${userId}-${Date.now()}`,
        platformGuildData: {
          text: data.text,
          name: data.name,
          imageUrl: data.imageUrl,
        },
      },
      isNew: true,
      visibility: roleVisibility,
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <SecretTextDataForm>
        <Button
          colorScheme="indigo"
          isDisabled={!name?.length || !text?.length}
          w="max-content"
          ml="auto"
          onClick={methods.handleSubmit(onContinue)}
        >
          Continue
        </Button>
      </SecretTextDataForm>
    </FormProvider>
  )
}
export default AddSecretTextPanel
