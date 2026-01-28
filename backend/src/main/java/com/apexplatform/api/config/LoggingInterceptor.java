package com.apexplatform.api.config;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.method.HandlerMethod;

@Component
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        if (handler instanceof HandlerMethod method) {


            String className = method.getBeanType().getName();
            String methodName = method.getMethod().getName();
            String url = request.getRequestURI();

            // Extract simple class name for IntelliJ link
            String simpleClassName = method.getBeanType().getSimpleName();
            String fileName = simpleClassName + ".java";

            // Log in clickable format: ClassName.java:lineNumber (IntelliJ will pick ClassName.java)
            System.out.println(fileName + " -> " + methodName + " -> " + url);

            System.out.println("Controller: " + className + ", Method: " + methodName + ", URL: " + url);
        }

        return true;
    }
}