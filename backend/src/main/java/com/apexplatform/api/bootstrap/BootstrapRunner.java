package com.apexplatform.api.bootstrap;

import com.apexplatform.api.tenants.Tenant;
import com.apexplatform.api.tenants.TenantRepository;
import com.apexplatform.api.users.User;
import com.apexplatform.api.users.UserRepository;
import com.apexplatform.api.memberships.Membership;
import com.apexplatform.api.memberships.MembershipRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BootstrapRunner {

  @Bean
  CommandLineRunner bootstrap(
      BootstrapProperties props,
      TenantRepository tenantRepo,
      UserRepository userRepo,
      MembershipRepository membershipRepo,
      PasswordEncoder encoder
  ) {
    return args -> {
      Tenant tenant = tenantRepo.findByName(props.defaultTenantName())
          .orElseGet(() -> {
            Tenant t = new Tenant();
            t.setName(props.defaultTenantName());
            return tenantRepo.save(t);
          });

      User admin = userRepo.findByEmail(props.adminEmail())
          .orElseGet(() -> {
            User u = new User();
            u.setTenant(tenant);
            u.setEmail(props.adminEmail());
            u.setRole("ADMIN");
            u.setPasswordHash(encoder.encode(props.adminPassword()));
            return userRepo.save(u);
          });

      membershipRepo.findByTenantAndUser(tenant, admin)
          .orElseGet(() -> {
            Membership m = new Membership();
            m.setTenant(tenant);
            m.setUser(admin);
            m.setRole("OWNER");
            return membershipRepo.save(m);
          });
    };
  }
}

