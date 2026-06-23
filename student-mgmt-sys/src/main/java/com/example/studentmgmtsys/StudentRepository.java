package com.example.studentmgmtsys;


import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository
       extends JpaRepository<Student,Integer> {

}