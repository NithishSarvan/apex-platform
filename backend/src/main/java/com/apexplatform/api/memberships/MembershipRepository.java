package com.apexplatform.api.memberships;

import com.apexplatform.api.tenants.Tenant;
import com.apexplatform.api.users.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {
  List<Membership> findAllByUser(User user);
  Optional<Membership> findFirstByUserOrderByCreatedAtAsc(User user);
  Optional<Membership> findByTenantAndUser(Tenant tenant, User user);
}

