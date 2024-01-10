import { startAuthentication, startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server'
import { getSignature, decodeFirst } from '~/utils/decode'

const REGISTRATION_OPTIONS: GenerateRegistrationOptionsOpts = {
  rpName: 'Mycel',
  rpID: typeof window !== 'undefined' ? window.location.hostname : import.meta.env.VITE_HOSTNAME ?? '',
  userID: 'Mycel user',
  userName: 'A Mycel user',
  attestationType: 'none',
  supportedAlgorithmIDs: [-7],
  challenge: 'asdf',
  authenticatorSelection: {
    residentKey: 'required',
    userVerification: 'preferred',
  },
}

export const createNewCredential = async () => {
  try {
    const registrationOptions = await generateRegistrationOptions({ excludeCredentials: [], ...REGISTRATION_OPTIONS })
    const startRegistrationResponse = await startRegistration(registrationOptions)
    console.log('startRegistrationResponse:', startRegistrationResponse)
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: startRegistrationResponse,
      expectedOrigin:
        typeof window !== 'undefined' ? window.location.origin : `https://${import.meta.env.VITE_HOSTNAME}` ?? '',
      expectedChallenge: registrationOptions.challenge,
      supportedAlgorithmIDs: [-7],
      requireUserVerification: true,
    })
    console.log('4:', verified, registrationInfo)
    if (!registrationInfo) {
      return
    }
    const { id, response } = startRegistrationResponse
    const { credentialID, credentialPublicKey, counter, credentialDeviceType } = registrationInfo

    const publicKey = decodeFirst<any>(credentialPublicKey)
    const kty = publicKey.get(1)
    const alg = publicKey.get(3)
    const crv = publicKey.get(-1)
    const x = publicKey.get(-2)
    const y = publicKey.get(-3)
    const n = publicKey.get(-1)
    console.log('5:', id, credentialID, credentialPublicKey, credentialDeviceType, counter)

    return {
      id,
      credentialID,
      credentialPublicKey,
      credentialDeviceType,
      counter,
      transports: response.transports,
    }
  } catch (e) {
    console.log(e?.message || 'An unknown error occured')
  }
}

export const loginCredential = async (authenticator) => {
  try {
    const authenticationOptions = await generateAuthenticationOptions({
      rpID: REGISTRATION_OPTIONS.rpID,
      allowCredentials: [
        {
          id: authenticator.credentialID,
          type: 'public-key',
          transports: authenticator.transports,
        },
      ],
      challenge: 'asdf',
      userVerification: 'preferred',
    })
    const authenticationResponse = await startAuthentication(authenticationOptions)
    const { result, updatedSignature } = await getSignature(authenticationResponse, authenticator)
    console.log('3', authenticationResponse, result, updatedSignature)

    const response = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedOrigin:
        typeof window !== 'undefined' ? window.location.origin : `https://${import.meta.env.VITE_HOSTNAME}` ?? '',
      expectedChallenge: authenticationOptions.challenge,
      expectedRPID: window.location.hostname,
      authenticator: {
        credentialID: Uint8Array.from(authenticator.credentialID),
        credentialPublicKey: Uint8Array.from(authenticator.credentialPublicKey),
        counter: authenticator.counter,
      },
      requireUserVerification: true,
    })

    return {
      result,
      response,
      updatedSignature,
    }
  } catch (e) {
    console.log(e?.message || 'An unknown error occured')
  }
}

export const isWebAuthnSupported = browserSupportsWebAuthn()
