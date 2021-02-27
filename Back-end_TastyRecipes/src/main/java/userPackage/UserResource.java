/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package userPackage;

import com.google.gson.Gson;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
/**
 *
 * @author Elev
 */
@Path("usesr")
public class UserResource {
    
    @EJB
    UserBean userBean;
    
    @GET
    public Response logInUser(@HeaderParam("Authorization") String userData){
        
        User user = userBean.createUser(userData);
        if(userBean.logInUser(user)){
            return Response.ok(user.isAdminStatus()).build();
        }else{
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
     }
    
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public Response createUser(String userData){
        
        Gson gson = new Gson();
        User user = gson.fromJson(userData, User.class);
        
        if(userBean.saveUser(user) == 1){
           return Response.ok().build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
}
