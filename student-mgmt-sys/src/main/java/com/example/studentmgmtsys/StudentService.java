package com.example.studentmgmtsys;


import java.util.List;

import org.springframework.stereotype.Service;


@Service
public class StudentService {

    private StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public Student save(Student student) {
        return repository.save(student);
    }
    public Student findById(int id){
        return repository.findById(id)
                         .orElse(null);
    }

    public List<Student> findAll() {
        return repository.findAll();
    }

    public void delete(int id) {
        repository.deleteById(id);
    }
}