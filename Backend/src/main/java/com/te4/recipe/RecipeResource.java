/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.recipe;

import com.google.gson.Gson;
import com.te4.user.User;
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
 * @author Dator
 */
@Path("recipe")
public class RecipeResource {
    
    @EJB
    RecipeBean recipeBean;
            
            
    @Path("/create")
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public Response createRecipe(String recipeData){
        
        Gson gson = new Gson();
        Recipe recipe = gson.fromJson(recipeData, Recipe.class);
        
        if(recipeBean.createRecipe(recipe) >= 1){
           return Response.status(Response.Status.CREATED).build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @Path("/search")
    @GET
    public Response searchRecepi(@HeaderParam("title")String recipeData){
       if(recipeBean.searchRecipe(recipeData) != null){
           return Response.accepted(recipeBean.searchRecipe(recipeData)).build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
    @Path("/search/category")
    @GET
    public Response searchRecipeCategory(@HeaderParam("title")String recipeData){
       if(recipeBean.searchRecipeCategory(recipeData) != null){
           return Response.accepted(recipeBean.searchRecipeCategory(recipeData)).build();
        }else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
    
}