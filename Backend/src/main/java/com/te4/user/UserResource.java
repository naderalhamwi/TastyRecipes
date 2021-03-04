/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.user;

import com.google.gson.Gson;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Mohame Nader Alhamwi
 */
@Path("user")
public class UserResource {
    
    @EJB
    UserBean userBean;
    
    /**
     * med denn metoden loggar man in 
     * den får informationen på detta viset {"userName":"användarens namn","password":"KRYPTERAD lösenordet"}
     * */
    @Path("/confirm")
    @GET
    public Response logInUser(@HeaderParam("Authorization") String userData){
        
        User user = userBean.createUser(userData);
        
        if(userBean.logInUser(user)){
            return Response.ok(user.isAdminStatus()).build();
        }else{
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
     }
    
    /**
     * denna metoden skapar ny användare.
     *  den får informationen på detta viset 
     * {"userName":"användarens namn",
     * "password":"ej KRYPTERAD lösenordet",
     * "email":"sin Email"}
     * */
    @Path("/create")
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public Response createUser(String userInfo){
        
        Gson gson = new Gson();
        User user = gson.fromJson(userInfo, User.class);
        
        if(userBean.saveUser(user) == 1){
           return Response.status(Response.Status.CREATED).build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @Path("/change")
    @PUT
    @Consumes(MediaType.TEXT_PLAIN)
    public Response changeUserInfo(String userData){
        Gson gson = new Gson();
        User user = gson.fromJson(userData, User.class);
        
        if(userBean.changeUserData(user) == 1){
           return Response.status(Response.Status.ACCEPTED).build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @Path("/search")
    @GET
    public Response searchUser(@HeaderParam("userName")String userData){
       if(userBean.searchUser(userData) != null){
           return Response.accepted(userBean.searchUser(userData)).build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @Path("/delete")
    @DELETE
    public Response deleteUser(@HeaderParam("userName")String userName){
       if(userBean.deleteUser(userName) == 1){
           return Response.ok().build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
}
