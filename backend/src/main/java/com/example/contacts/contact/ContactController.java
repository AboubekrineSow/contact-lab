package com.example.contacts.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactRepository repository;

    public ContactController(ContactRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Contact> list() {
        return repository.findAllByOrderByLastNameAscFirstNameAsc();
    }

    @GetMapping("/{id}")
    public Contact get(@PathVariable String id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    @PostMapping
    public ResponseEntity<Contact> create(@RequestBody @Valid Contact contact, UriComponentsBuilder uri) {
        contact.setId(null); // let @UuidGenerator assign it
        Contact saved = repository.save(contact);
        URI location = uri.path("/api/contacts/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable String id, @RequestBody @Valid Contact contact) {
        if (!repository.existsById(id)) {
            throw new NotFoundException(id);
        }
        contact.setId(id);
        return repository.save(contact);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException(id);
        }
        repository.deleteById(id);
    }
}
