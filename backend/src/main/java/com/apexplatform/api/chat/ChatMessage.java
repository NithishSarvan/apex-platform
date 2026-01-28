package com.apexplatform.api.chat;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.ColumnTransformer;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "chat_id", nullable = false)
  private Chat chat;

  @Column(nullable = false)
  private String role; // user | assistant | system

  @Column(nullable = false, columnDefinition = "text")
  private String content;

  @Column(name = "metadata_json", columnDefinition = "jsonb")
  @ColumnTransformer(read = "metadata_json::text", write = "?::jsonb")
  private String metadataJson;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  public UUID getId() {
    return id;
  }

  public Chat getChat() {
    return chat;
  }

  public void setChat(Chat chat) {
    this.chat = chat;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getMetadataJson() {
    return metadataJson;
  }

  public void setMetadataJson(String metadataJson) {
    this.metadataJson = metadataJson;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}

