package com.aura.user.entity;

import java.io.Serializable;
import java.util.Objects;

public class RoleId implements Serializable {
    
    private Long userId;
    private RoleType role;
    
    // No-args constructor
    public RoleId() {
    }
    
    // All-args constructor
    public RoleId(Long userId, RoleType role) {
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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RoleId roleId = (RoleId) o;
        return Objects.equals(userId, roleId.userId) && role == roleId.role;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(userId, role);
    }
}
