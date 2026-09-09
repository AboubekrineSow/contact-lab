package com.example.contacts.contact;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String id) {
        super("Contact not found: " + id);
    }
}
