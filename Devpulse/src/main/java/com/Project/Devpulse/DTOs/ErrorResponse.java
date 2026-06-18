package com.Project.Devpulse.DTOs;


import java.sql.Timestamp;

public record ErrorResponse(
        String message,
        int status,
        String error,
        Timestamp timestamp
) { }
//  Java automatically generates:
//  Constructor
//  Getters
//  toString()
//  equals()
//  hashCode()
