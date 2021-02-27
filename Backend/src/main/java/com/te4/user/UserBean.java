 /*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.user;

import com.te4.backend.ConnectionFactory;
import at.favre.lib.crypto.bcrypt.BCrypt;
import javax.ejb.Stateless;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 *
 * @author Mohame Nader Alhamwi
 */
@Stateless
public class UserBean {
    /**/
    public User createUser(String auth){
        auth = auth.substring(6).trim();
        byte[] bytes = Base64.getDecoder().decode(auth);
        auth = new String(bytes);
        int colon = auth.indexOf(":");
        String userName = auth.substring(0, colon);
        String password = auth.substring(colon+1);
        return new User(userName, password);
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user , Method GET 
     * metoden kollar om userName och password fins i databasen.
     * */ 
    public boolean logInUser(User user){
        try (Connection con = ConnectionFactory.getConnection()){
            
            String sql = "SELECT * FROM user WHERE userName=?";
            
            PreparedStatement stmt = con.prepareStatement(sql);
            stmt.setString(1, user.getUserName());
            ResultSet data = stmt.executeQuery();
            
            if(data.next()){
                String bcryptHashString = data.getString("password");
                BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), bcryptHashString);
                user.setAdminStatus(data.getInt("adminStatus"));
                return result.verified;
            }else{
                return false;
            }
        } catch (Exception e) {
           System.out.println("Error UserBean.logInUser: " +e.getMessage());
            return false;
        }
    }
    
    /**
     * den roppars när man gör en fetch från http://localhost:8080/Backend/resources/user , Method POST 
     * metoden sparar anvädndare information
     * */
    public int saveUser(User user){
       try (Connection con = ConnectionFactory.getConnection()){
           
           String hashedpassword = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
           
           String insertUser = String.format("INSERT INTO user VALUES ('%s','%s', '%s', '%s');", user.getUserName(), user.getEmail(), hashedpassword, 0);
           
           PreparedStatement stmt = con.prepareStatement(insertUser);
           int rows = stmt.executeUpdate(insertUser);
           return rows;
       } catch (Exception e) {
           System.out.println("Error UserBean.saveUser: " +e.getMessage());
           return 0;
       }
   }
}