/**
 * Derives a key from a password using PBKDF2 with Web Crypto API
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Import the password as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive the encryption key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

/**
 * Decrypts data using AES-256-GCM (compatible with Node.js crypto)
 * Expects base64 encoded string containing: salt + iv + tag + encrypted data
 */
export async function decrypt(encryptedData: string, password: string): Promise<string> {
  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract components (in bytes)
    const SALT_LENGTH = 32;
    const IV_LENGTH = 16;
    const TAG_LENGTH = 16;
    
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    // Derive key from password
    const key = await deriveKey(password, salt);
    
    // Combine ciphertext and tag for GCM mode
    const dataWithTag = new Uint8Array(ciphertext.length + tag.length);
    dataWithTag.set(ciphertext);
    dataWithTag.set(tag, ciphertext.length);
    
    // Decrypt using AES-GCM
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      dataWithTag
    );
    
    // Convert decrypted ArrayBuffer to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`);
  }
}

/**
 * Generates a default decryption key based on workspace identifier
 */
export async function generateDefaultKey(workspaceId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(workspaceId + "howdare-default-key");
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

