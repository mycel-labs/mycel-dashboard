import { useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { generateRegistrationOptions, verifyRegistrationResponse } from "@simplewebauthn/server";
import { decodeFirst } from "../utils/decode";

const TRANSACTION_STAGE = {
  UNSENT: "Unsent",
  SIGNING_CHALLENGE: "SigningChallenge",
  CREATING_PROOF: "CreatingProof",
  GENERATING_USER_OP: "GeneratingUserOp",
  SENDING_USER_OP: "SendingUserOp",
  QUERYNG_FOR_RECEIPTS: "QueryingForReceipts",
  CONFIRMED: "Confirmed",
};

const useWebAuthn = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState();
  //TODO: VerifiedRegistrationResponse cannot be import
  // const [response, setResponse] = useState<VerifiedRegistrationResponse>({ verified: false });
  const [txHash, setTxHash] = useState("");
  const [stage, setStage] = useState(TRANSACTION_STAGE.UNSENT);
  const [error, setError] = useState("");

  async function createNewCredential() {
    if (stage !== TRANSACTION_STAGE.UNSENT && stage !== TRANSACTION_STAGE.CONFIRMED) {
      return;
    }
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
