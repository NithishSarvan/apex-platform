package com.apexplatform.api.chat.dto;

import java.util.UUID;

public record CreateChatRequest(
    UUID modelId,
    String title
) {}

