package cloud.intensive.kpt.global.security.test;

import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

public class WithMockCustomUserSecurityContextFactory
        implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser annotation) {

        Member member = Member.builder()
                .id(annotation.id())
                .email(annotation.email())
                .password("encoded")
                .role(MemberRole.valueOf(annotation.role()))
                .build();

        CustomUserDetails principal = new CustomUserDetails(member);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        return context;
    }
}