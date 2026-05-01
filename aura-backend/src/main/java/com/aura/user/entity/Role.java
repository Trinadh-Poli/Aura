package com.aura.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_roles")
@IdClass(RoleId.class)
public class Role {
    
    @Id
    @Column(name = "user_id")
    private Long userId;
    
    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private RoleType role;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    // No-args constructor
    public Role() {
    }
    
    // Constructor
    public Role(Long userId, RoleType role) {
        this.userId = userId;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public RoleType getRole() {
        return role;
    }
    
    public void setRole(RoleType role) {
        this.role = role;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;
        Role roleObj = (Role) o;
        return userId != null && userId.equals(roleObj.getUserId()) && 
               role != null && role.equals(roleObj.getRole());
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
