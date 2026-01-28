package com.apexplatform.api.common;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpStatusCodeException;

@ControllerAdvice
public class GlobalExceptionHandler {

  private static final Pattern GEMINI_RETRY_DELAY_SECONDS =
      Pattern.compile("\"retryDelay\"\\s*:\\s*\"(\\d+)s\"");

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
    Map<String, Object> details = new HashMap<>();
    Map<String, String> fieldErrors = new HashMap<>();
    for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
      fieldErrors.put(fe.getField(), fe.getDefaultMessage());
    }
    details.put("fieldErrors", fieldErrors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiError(
            Instant.now(),
            400,
            "Bad Request",
            "Validation failed",
            req.getRequestURI(),
            details
        ));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleIllegalArg(IllegalArgumentException ex, HttpServletRequest req) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiError(
            Instant.now(),
            400,
            "Bad Request",
            ex.getMessage(),
            req.getRequestURI(),
            Map.of()
        ));
  }

  @ExceptionHandler(HttpStatusCodeException.class)
  public ResponseEntity<ApiError> handleUpstreamHttp(HttpStatusCodeException ex, HttpServletRequest req) {
    String body = ex.getResponseBodyAsString();
    if (body != null && body.length() > 4000) body = body.substring(0, 4000) + "...(truncated)";

    Map<String, Object> details = new HashMap<>();
    details.put("upstreamStatus", ex.getStatusCode().value());
    details.put("upstreamBody", body);

    int upstream = ex.getStatusCode().value();

    // Prefer propagating rate limit / quota exhaustion to the client so UI can backoff.
    if (upstream == 429) {
      HttpHeaders headers = new HttpHeaders();
      String retryAfter = ex.getResponseHeaders() == null ? null : ex.getResponseHeaders().getFirst("Retry-After");

      Integer retryAfterSeconds = null;
      if (retryAfter != null && !retryAfter.isBlank()) {
        try {
          retryAfterSeconds = Integer.parseInt(retryAfter.trim());
        } catch (Exception ignored) {
          // ignore
        }
      }
      if (retryAfterSeconds == null && body != null) {
        Matcher m = GEMINI_RETRY_DELAY_SECONDS.matcher(body);
        if (m.find()) {
          try {
            retryAfterSeconds = Integer.parseInt(m.group(1));
          } catch (Exception ignored) {
            // ignore
          }
        }
      }
      if (retryAfterSeconds != null) {
        headers.set("Retry-After", String.valueOf(retryAfterSeconds));
        details.put("retryAfterSeconds", retryAfterSeconds);
      }

      return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
          .headers(headers)
          .body(new ApiError(
              Instant.now(),
              429,
              "Too Many Requests",
              "LLM provider quota/rate limit exceeded",
              req.getRequestURI(),
              details
          ));
    }

    // For other upstream failures, keep them as a gateway error but expose upstream details for debugging.
    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
        .body(new ApiError(
            Instant.now(),
            502,
            "Bad Gateway",
            "LLM provider error",
            req.getRequestURI(),
            details
        ));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ApiError(
            Instant.now(),
            500,
            "Internal Server Error",
            "Unexpected error",
            req.getRequestURI(),
            Map.of("exception", ex.getClass().getName())
        ));
  }
}

