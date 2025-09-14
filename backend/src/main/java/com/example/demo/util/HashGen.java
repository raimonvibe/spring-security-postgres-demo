package com.example.demo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGen {
  public static void main(String[] args) {
    var enc = new BCryptPasswordEncoder();   // cost 10 by default
    System.out.println("admin -> " + enc.encode("admin"));
    System.out.println("user  -> " + enc.encode("user"));
  }
}
