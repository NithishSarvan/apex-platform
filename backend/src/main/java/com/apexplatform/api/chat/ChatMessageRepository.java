package com.apexplatform.api.chat;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
  List<ChatMessage> findAllByChatOrderByCreatedAtAsc(Chat chat);
  Page<ChatMessage> findAllByChat(Chat chat, Pageable pageable);
  void deleteAllByChat(Chat chat);
}

