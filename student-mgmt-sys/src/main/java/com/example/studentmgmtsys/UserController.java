package com.example.studentmgmtsys;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.studentmgmtsys.Student;
import com.example.studentmgmtsys.dto.LoginRequest;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/appuser")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")

    public Optional<Student> find(@PathVariable int id) {

        return userService.findById(id);

    }



    // Register
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request){

        boolean status =
                userService.login(
                        request.getUsername(),
                        request.getPassword());

        if(status){
            return ResponseEntity.ok(true);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(false);
    }
}