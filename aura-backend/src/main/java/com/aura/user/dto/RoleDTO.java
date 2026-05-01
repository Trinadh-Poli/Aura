package com.aura.user.dto;

import com.aura.user.entity.RoleType;

public class RoleDTO {
    
    private RoleType role;
    
    // No-args constructor
    public RoleDTO() {
    }
    
    // Constructor
    public RoleDTO(RoleType role) {
        this.role = role;
    }
    
    // Getters and Setters
    public RoleType getRole() {
        return role;
    }
    
    public void setRole(RoleType role) {
        this.role = role;
    }
}
