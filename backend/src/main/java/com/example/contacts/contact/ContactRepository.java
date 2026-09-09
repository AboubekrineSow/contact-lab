package com.example.contacts.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA. The schema and the seed rows are created by Liquibase
 * (see src/main/resources/db/changelog/). Hibernate does not touch the DDL
 * (spring.jpa.hibernate.ddl-auto = none).
 */
public interface ContactRepository extends JpaRepository<Contact, String> {

    List<Contact> findAllByOrderByLastNameAscFirstNameAsc();
}
