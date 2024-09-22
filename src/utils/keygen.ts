import CryptoJS from "crypto-js";
import { ec as EC } from "elliptic";

// elliptic curve 객체 생성
const ec = new EC("secp256k1");

/**
 * 개인키와 공개키를 생성하는 함수 (privateKey는 10진수로 반환)
 * @returns {Object} - privateKey는 10진수, publicKey는 16진수로 반환
 */
export const generateKeysInDecimal = () => {
  const keyPair = ec.genKeyPair();

  // Convert the private key to hexadecimal first
  const privateKeyHex = keyPair.getPrivate("hex").padStart(64, "0");

  // Convert the hexadecimal private key to decimal format using BigInt
  const privateKeyDecimal = BigInt(`0x${privateKeyHex}`).toString(); // 16진수에서 10진수로 변환한 개인키

  // Generate the public key in hexadecimal format
  const publicKey = keyPair.getPublic("hex"); // 공개키는 16진수로 반환

  return { privateKey: privateKeyDecimal, publicKey, keyPair };
};

/**
 * 10진수 개인키를 입력받아 공개키를 생성하는 함수
 * @param {string} privateKeyDecimal - 10진수 개인키
 * @returns {string} - 16진수로 변환된 공개키
 */
export const convertPrivateKey = (privateKeyDecimal: string) => {
  // Convert the decimal private key to hexadecimal format using BigInt
  const privateKeyHex = BigInt(privateKeyDecimal)
    .toString(16)
    .padStart(64, "0"); // 10진수에서 16진수로 변환

  // Generate the key pair from the private key
  const keyPair = ec.keyFromPrivate(privateKeyHex);

  // Get the public key in hexadecimal format
  const publicKey = keyPair.getPublic("hex");

  return publicKey;
};

// Example usage:
// const { privateKey, publicKey } = generateKeysInDecimal();
// console.log("Private Key (Decimal):", privateKey); // 10진수 개인키 출력
// console.log("Public Key (Hex):", publicKey); // 16진수 공개키 출력

/**
 * Verifies a signature using an external public key.
 *
 * @param {string} message - The original message that was signed.
 * @param {string} signature - The signature in hex format.
 * @param {string} publicKey - The external public key in hex format.
 * @returns {boolean} - Returns true if the signature is valid, false otherwise.
 */
export const verifySignatureWithPublicKey = (
  message: string,
  signature: string,
  publicKey: string
) => {
  // Hash the message using SHA-256
  const messageHash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
  const binaryMessage = Buffer.from(messageHash, "hex");

  try {
    // Create a key pair object from the provided public key
    const externalKeyPair = ec.keyFromPublic(publicKey, "hex");

    // Convert the provided signature from hex to binary/DER format
    const derSignature = Buffer.from(signature, "hex");

    // Verify the signature against the message hash
    const isValid = externalKeyPair.verify(binaryMessage, derSignature);

    // Return the result
    return isValid;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};
