import { decodeFirst } from "@/utils/decode";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";
import { useState } from "react";

const useWebAuthn = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState();
  //TODO: VerifiedRegistrationResponse cannot be import
  // const [response, setResponse] = useState<VerifiedRegistrationResponse>({ verified: false });
  const [error, setError] = useState("");

  async function createNewCredential() {
    setError("");
    try {
      const generatedRegistrationOptions = await generateRegistrationOptions({
        rpName: "demo",
        rpID: window.location.hostname,
        userID: username || "Based Account",
        userName: username || "Based Account",
        attestationType: "direct",
        challenge: "asdf",
        supportedAlgorithmIDs: [-7],
      });
      const startRegistrationResponse = await startRegistration(generatedRegistrationOptions);
      const verificationResponse = await verifyRegistrationResponse({
        response: startRegistrationResponse,
        expectedOrigin: window.location.origin,
        expectedChallenge: generatedRegistrationOptions.challenge,
        supportedAlgorithmIDs: [-7],
      });
      setResponse(verificationResponse);
      if (!verificationResponse.registrationInfo) {
        return;
      }
      console.log("response", response);
      const { id } = startRegistrationResponse;
      const { credentialID, credentialPublicKey, counter } = verificationResponse.registrationInfo;

      const publicKey = decodeFirst<any>(credentialPublicKey);
      const kty = publicKey.get(1);
      const alg = publicKey.get(3);
      const crv = publicKey.get(-1);
      const x = publicKey.get(-2);
      const y = publicKey.get(-3);
      const n = publicKey.get(-1);

      localStorage.setItem(
        id,
        JSON.stringify({
          credentialID: Array.from(credentialID),
          credentialPublicKey: Array.from(credentialPublicKey),
          counter,
        }),
      );
      localStorage.setItem("user-registered", "true");
    } catch (e) {
      setError(e.message || "An unknown error occured");
    }
  }

  return {
    createNewCredential,
    response,
    error,
  };
};

export default useWebAuthn;
