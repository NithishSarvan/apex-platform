package com.apexplatform.api.security;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class CryptoService {
  private static final String AES_GCM_NO_PADDING = "AES/GCM/NoPadding";
  private static final int GCM_TAG_LENGTH_BITS = 128;
  private static final int IV_LENGTH_BYTES = 12;

  private final SecretKey key;
  private final SecureRandom rng = new SecureRandom();

  public CryptoService(CryptoProperties props) {
    byte[] raw = props.encryptionKey().getBytes(StandardCharsets.UTF_8);
    if (raw.length < 32) {
      throw new IllegalArgumentException("APP_ENCRYPTION_KEY must be at least 32 bytes for AES-256");
    }
    byte[] keyBytes = new byte[32];
    System.arraycopy(raw, 0, keyBytes, 0, 32);
    this.key = new SecretKeySpec(keyBytes, "AES");
  }

  /**
   * Returns base64(iv || ciphertext) where ciphertext includes GCM tag.
   */
  public String encryptToBase64(String plaintext) {
    try {
      byte[] iv = new byte[IV_LENGTH_BYTES];
      rng.nextBytes(iv);
      Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);
      cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
      byte[] ct = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

      byte[] out = new byte[iv.length + ct.length];
      System.arraycopy(iv, 0, out, 0, iv.length);
      System.arraycopy(ct, 0, out, iv.length, ct.length);
      return Base64.getEncoder().encodeToString(out);
    } catch (Exception e) {
      throw new IllegalArgumentException("Encryption failed");
    }
  }

  public String decryptFromBase64(String base64) {
    try {
      byte[] in = Base64.getDecoder().decode(base64);
      if (in.length <= IV_LENGTH_BYTES) throw new IllegalArgumentException("Invalid ciphertext");
      byte[] iv = new byte[IV_LENGTH_BYTES];
      byte[] ct = new byte[in.length - IV_LENGTH_BYTES];
      System.arraycopy(in, 0, iv, 0, IV_LENGTH_BYTES);
      System.arraycopy(in, IV_LENGTH_BYTES, ct, 0, ct.length);

      Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);
      cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
      byte[] pt = cipher.doFinal(ct);
      return new String(pt, StandardCharsets.UTF_8);
    } catch (Exception e) {
      throw new IllegalArgumentException("Decryption failed");
    }
  }
}

