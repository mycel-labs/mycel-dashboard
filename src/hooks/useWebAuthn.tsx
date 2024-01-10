import { useStore } from '~/store/index'
import { loginCredential, createNewCredential } from '~/utils/webauthn'

const useWebAuthn = () => {
  const { updateAuthenticator } = useStore()

  const auth = async () => {
    console.log('0', useStore.getState().authenticator)
    if (!useStore.getState().authenticator?.id) {
      const res = await createNewCredential()
      updateAuthenticator(res)
      console.log('1', useStore.getState().authenticator, res)
    }
    console.log('2', useStore.getState().authenticator)
    const res = await loginCredential(useStore.getState().authenticator)
    return res?.updatedSignature ?? false
  }

  return {
    auth,
  }
}

export default useWebAuthn
