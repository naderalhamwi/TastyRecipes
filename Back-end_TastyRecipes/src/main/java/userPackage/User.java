/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package userPackage;

/**
 *
 * @author Elev
 */
public class User {
    private String userName;
    private String password;
    private String email;
    private int adminStatus;

    public User(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    
    public User(String userName, String password, String email, int adminStatus) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.adminStatus = adminStatus;
    }
    
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int isAdminStatus() {
        return adminStatus;
    }

    public void setAdminStatus(int adminStatus) {
        this.adminStatus = adminStatus;
    }
    
    
}
