package com.example.studentmgmtsys;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register User
    public User register(User user) {

        if(userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        return userRepository.save(user);
    }

    // Login User
    public boolean login(String username, String password) {

        User user = userRepository.findByUsername(username);

        if(user == null) {
            return false;
        }

        return user.getPassword().equals(password);
    }

	public Optional<Student> findById(int id) {
		// TODO Auto-generated method stub
		return null;
	}

    public List<User> findAll() {

        return userRepository.findAll();

    }


}