package com.apexplatform.api.providers;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "provider_secrets")
public class ProviderSecret {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "provider_id", nullable = false, unique = true)
  private Provider provider;

  @Column(name = "encrypted_secret", nullable = false)
  private String encryptedSecret;

  @Column(name = "key_version", nullable = false)
  private int keyVersion = 1;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public UUID getId() {
    return id;
  }

  public Provider getProvider() {
    return provider;
  }

  public void setProvider(Provider provider) {
    this.provider = provider;
  }

  public String getEncryptedSecret() {
    return encryptedSecret;
  }

  public void setEncryptedSecret(String encryptedSecret) {
    this.encryptedSecret = encryptedSecret;
  }

  public int getKeyVersion() {
    return keyVersion;
  }

  public void setKeyVersion(int keyVersion) {
    this.keyVersion = keyVersion;
  }
}

