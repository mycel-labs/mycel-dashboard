import { useStore } from '~/store/index'
import { loginCredential, createNewCredential } from '~/utils/webauthn'

const useWebAuthn = () => {
  const authenticator = useStore((state) => state.authenticator)
  const updateAuthenticator = useStore((state) => state.updateAuthenticator)

  const auth = async () => {
    console.log('0', authenticator)
    if (!authenticator?.id) {
      const res = await createNewCredential()
      updateAuthenticator(res)
      console.log('1', authenticator)
    }
    console.log('2', authenticator)
    const res = await loginCredential(authenticator)
    return res?.updatedSignature ?? false
  }

  return {
    auth,
  }
}

export default useWebAuthn
