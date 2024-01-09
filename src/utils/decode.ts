import * as cborx from 'cbor-x'
import base64 from '@hexagon/base64'
import { AsnParser } from '@peculiar/asn1-schema'
import { ECDSASigValue } from '@peculiar/asn1-ecc'

const encoder = new cborx.Encoder({
  mapsAsObjects: false,
  tagUint8Array: false,
})

export function decodeFirst<Type>(input: Uint8Array): Type {
  const decoded = encoder.decodeMultiple(input) as undefined | Type[]

  if (decoded === undefined) {
    throw new Error('CBOR input data was empty')
  }

  /**
   * Typing on `decoded` is `void | []` which causes TypeScript to think that it's an empty array,
   * and thus you can't destructure it. I'm ignoring that because the code works fine in JS, and
   * so this should be a valid operation.
   */
  const [first] = decoded

  return first
}

function toDataView(array: Uint8Array): DataView {
  return new DataView(array.buffer, array.byteOffset, array.length)
}

export function parseAuthenticatorData(authData: Uint8Array) {
  if (authData.byteLength < 37) {
    throw new Error(`Authenticator data was ${authData.byteLength} bytes, expected at least 37 bytes`)
  }

  let pointer = 0
  const dataView = toDataView(authData)

  const rpIdHash = authData.slice(pointer, (pointer += 32))

  const flagsBuf = authData.slice(pointer, (pointer += 1))
  const flagsInt = flagsBuf[0]

  // Bit positions can be referenced here:
  // https://www.w3.org/TR/webauthn-2/#flags
  const flags = {
    up: !!(flagsInt & (1 << 0)), // User Presence
    uv: !!(flagsInt & (1 << 2)), // User Verified
    be: !!(flagsInt & (1 << 3)), // Backup Eligibility
    bs: !!(flagsInt & (1 << 4)), // Backup State
    at: !!(flagsInt & (1 << 6)), // Attested Credential Data Present
    ed: !!(flagsInt & (1 << 7)), // Extension Data Present
    flagsInt,
  }

  const counterBuf = authData.slice(pointer, pointer + 4)
  const counter = dataView.getUint32(pointer, false)
  pointer += 4

  let aaguid: Uint8Array | undefined = undefined
  let credentialID: Uint8Array | undefined = undefined
  let credentialPublicKey: Uint8Array | undefined = undefined
  let credentialPublicKeyDecoded: Uint8Array | undefined = undefined

  if (flags.at) {
    aaguid = authData.slice(pointer, (pointer += 16))

    const credIDLen = dataView.getUint16(pointer)
    pointer += 2

    credentialID = authData.slice(pointer, (pointer += credIDLen))

    // Decode the next CBOR item in the buffer, then re-encode it back to a Buffer
    const firstDecoded = decodeFirst(authData.slice(pointer))
    const firstEncoded = Uint8Array.from(encoder.encode(firstDecoded))

    credentialPublicKey = firstEncoded
    credentialPublicKeyDecoded = firstDecoded as any
    pointer += firstEncoded.byteLength
  }

  return {
    rpIdHash,
    flagsBuf,
    flags,
    counter,
    counterBuf,
    aaguid,
    credentialID,
    credentialPublicKey,
    credentialPublicKeyDecoded,
  }
}

export function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length)
  result.set(a, 0)
  result.set(b, a.length)
  return result
}

export function shouldRemoveLeadingZero(bytes: Uint8Array): boolean {
  return bytes[0] === 0x0 && (bytes[1] & (1 << 7)) !== 0
}

export async function getSignature(authenticationResponse, authenticator) {
  const clientDataJSON = base64.toArrayBuffer(authenticationResponse.response.clientDataJSON, true)
  const authenticatorData = base64.toArrayBuffer(authenticationResponse.response.authenticatorData, true)
  const signature = base64.toArrayBuffer(authenticationResponse.response.signature, true)
  const parsed = parseAuthenticatorData(new Uint8Array(authenticatorData))

  const hashedClientData = await window.crypto.subtle.digest('SHA-256', clientDataJSON)
  const preimage = concatUint8Arrays(new Uint8Array(authenticatorData), new Uint8Array(hashedClientData))
  const hashedMessage = await window.crypto.subtle.digest('SHA-256', preimage)

  const publicKey = decodeFirst<any>(Uint8Array.from(authenticator.credentialPublicKey))
  const kty = publicKey.get(1)
  const alg = publicKey.get(3)
  const crv = publicKey.get(-1)
  const x = publicKey.get(-2)
  const y = publicKey.get(-3)
  const n = publicKey.get(-1)

  const keyData = {
    kty: 'EC',
    crv: 'P-256',
    x: base64.fromArrayBuffer(x, true),
    y: base64.fromArrayBuffer(y, true),
    ext: false,
  }

  const parsedSignature = AsnParser.parse(signature, ECDSASigValue)
  let rBytes = new Uint8Array(parsedSignature.r)
  let sBytes = new Uint8Array(parsedSignature.s)

  if (shouldRemoveLeadingZero(rBytes)) {
    rBytes = rBytes.slice(1)
  }

  if (shouldRemoveLeadingZero(sBytes)) {
    sBytes = sBytes.slice(1)
  }

  const updatedSignature = concatUint8Arrays(rBytes, sBytes)

  const key = await window.crypto.subtle.importKey(
    'jwk',
    keyData,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['verify']
  )

  const result = await window.crypto.subtle.verify(
    { hash: { name: 'SHA-256' }, name: 'ECDSA' },
    key,
    updatedSignature,
    preimage
  )

  return {
    result,
    updatedSignature,
  }
}
