package com.apexplatform.api.chat.dto;

public record SendMessageRequest(
    String content,
    String overrideConfigJson
) {}

