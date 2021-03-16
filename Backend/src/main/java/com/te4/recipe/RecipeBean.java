/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.recipe;

import com.te4.backend.ConnectionFactory;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import javax.ejb.Stateless;
import jdk.internal.org.jline.utils.InfoCmp;

/**
 *
 * @author Dator
 */
@Stateless
public class RecipeBean {
    static long stegCont = 0;
    static long imageCount =  0;
    private final String absPath = "C:\\Users\\Elev\\OneDrive\\Dokument\\GitHub\\TastyRecipes\\Front-end_TastyRecipes\\"; 
    private final String folderName = "imges";
    
    public String saveImage(String b64Data){
        String imgType = b64Data.substring(b64Data.indexOf('/')+1,b64Data.indexOf(';'));
        String img = b64Data.substring(b64Data.indexOf(',')+1);
        byte[] bData = Base64.getDecoder().decode(img);
        
        if(!Files.exists(Paths.get(absPath, folderName))){
            try {
                Files.createDirectory(Paths.get(absPath, folderName));
            } catch (Exception e) {
                System.out.println("ImageBean.saveImage; Mappen kan inte skapas: " + e.getMessage());
            }
        }
        
        
        while (Files.exists(Paths.get(absPath, folderName, "\\" + "img" + imageCount + "." + imgType))) {            
            imageCount++;
        }
        
        String relPath = folderName+"\\\\img"+imageCount+"." +imgType;
        
        try {
            Files.write(Paths.get(absPath, relPath), bData);
        } catch (Exception e) {
            System.out.println("ImageBeen.saveImage; Filen kan inte skapas" + e.getMessage());
        }
        return relPath;
    }
    
    public void deleteImge(String imgPath){
        String relPath = imgPath;
        try {
            Files.delete(Paths.get(absPath, relPath));
        } catch (IOException e) {
            System.out.println("RecipeBean.deleteImge" + e);
        }
    }
    
    public int createRecipe(Recipe recipe){
        try (Connection con1 = ConnectionFactory.getConnection()){
           String insertRecipt = String.format("INSERT INTO recept (title, userName, likes) VALUES ('%s', '%s', '%d');", recipe.getTitle(), recipe.getUserName(), 0);

           PreparedStatement stmt = con1.prepareStatement(insertRecipt );
           int rows = stmt.executeUpdate(insertRecipt );
           
           try (Connection con2 = ConnectionFactory.getConnection()){
                String imgPath = saveImage(recipe.getImgPath());
               String insertRecipetInfo = String.format("INSERT INTO receptinfo VALUES ((SELECT max(receptID) FROM recept),'%s', '%s', '%s', '%s','%s');", 
                recipe.getDescription(), recipe.getCategory(), recipe.getNutritionalValue(), imgPath, recipe.getTime());
                
                PreparedStatement stmt2 = con2.prepareStatement(insertRecipetInfo );
                stmt2.executeUpdate(insertRecipetInfo);
                
            } catch (Exception e) {
                System.out.println("Error RecepiBean.CreateRecipe.con2 " +e.getMessage());
            }
           
           try (Connection con3 = ConnectionFactory.getConnection()){
               String[] ingredens = recipe.getIngredientInfo().split(",");
               
                for (int i = 0; i < ingredens.length ; i++) {
                     String insertReciptIngredientInfo = String.format("INSERT INTO ingredientinfo VALUES ((SELECT max(receptID) FROM recept),'%s');", ingredens[i]);

                     PreparedStatement stmt3 = con3.prepareStatement(insertReciptIngredientInfo );
                     stmt3.executeUpdate(insertReciptIngredientInfo);
                 }
              
            } catch (Exception e) {
                System.out.println("Error RecepiBean.CreateRecipe.con3 " +e.getMessage());
            }
           
           try (Connection con4 = ConnectionFactory.getConnection()){ 
               String[] steg = recipe.getSteg().split(",");
               
                for (int i = 0; i < steg.length ; i++) {
                        long stegtId = stegCont++;
                    
                    String insertReciptSteg = String.format("INSERT INTO receptsteg VALUES ('%d',(SELECT max(receptID) FROM recept),'%s');", stegtId ,steg[i]);
                    
                    PreparedStatement stmt4 = con4.prepareStatement(insertReciptSteg );
                    stmt4.executeUpdate(insertReciptSteg);
                }
                    stegCont = 0;
                
            } catch (Exception e) {
                System.out.println("Error RecepiBean.CreateRecipe.con4 " +e.getMessage());
            }
                
           return rows;
       } catch (Exception e) {
           System.out.println("Error RecepiBean.CreateRecipe.con1 " +e.getMessage());
           return 0;
       }
    }
    
    public List<Recipe> searchRecipe(String title){
         List<Recipe> recipeData = new ArrayList<>();
         
          try (Connection con = ConnectionFactory.getConnection()){
           
            String getRecept = String.format("SELECT * FROM recept WHERE title LIKE ?");

            PreparedStatement pstmt = con.prepareStatement(getRecept);
            pstmt.setString(1, "%" + title + "%");
            ResultSet data1 = pstmt.executeQuery();
           
            while(data1.next()){
                String getReceptInfo = String.format("SELECT * FROM receptinfo WHERE receptId=?");
                
                PreparedStatement pstmt1 = con.prepareStatement(getReceptInfo);
                pstmt1.setInt(1, data1.getInt("receptId"));
                ResultSet data2 = pstmt1.executeQuery();  
                
                data2.next();

                Recipe recipe = new Recipe(
                data1.getString("title"),
                data1.getString("userName"),
                data2.getString("description"),
                data2.getString("imgPath"),
                data2.getInt("receptId"));

                recipeData.add(recipe);
            }
           return recipeData;
       } catch (Exception e) {
           System.out.println("Error RecipeBean.searchRecipe: " +e.getMessage());
           return null;
       }
    }
    public List<Recipe> searchRecipeCategory(String category){
         List<Recipe> recipeData = new ArrayList<>();
         
          try (Connection con = ConnectionFactory.getConnection()){
           
            String getRecept = String.format("SELECT * FROM recept WHERE receptId in (SELECT receptId FROM receptinfo WHERE category=?);");

            PreparedStatement pstmt = con.prepareStatement(getRecept);
            pstmt.setString(1, category );
            ResultSet data1 = pstmt.executeQuery();
           
            while(data1.next()){
                String getReceptInfo = String.format("SELECT * FROM receptinfo WHERE receptId=?");
                
                PreparedStatement pstmt1 = con.prepareStatement(getReceptInfo);
                pstmt1.setInt(1, data1.getInt("receptId"));
                ResultSet data2 = pstmt1.executeQuery();  
                
                data2.next();
                
                Recipe recipe = new Recipe(
                data1.getString("title"),
                data1.getString("userName"),
                data2.getString("description"),
                data2.getString("imgPath"),
                data2.getInt("receptId"));

                recipeData.add(recipe);
            }
           return recipeData;
       } catch (Exception e) {
           System.out.println("Error RecipeBean.searchRecipeCategory: " +e.getMessage());
           return null;
       }
    }
    public Recipe showRecipe(String recipeId){
         
         List<Comments> commentsData = new ArrayList<>();
         List<Comments> replayCommentsData = new ArrayList<>();
         
         List<Object> IngredientInfoList = new ArrayList<>();
         List<Object> stegList = new ArrayList<>();
         
          try (Connection con = ConnectionFactory.getConnection()){
              
            String getRecept = String.format("SELECT * FROM recept WHERE receptId=?;");
            String getReceptInfo = String.format("SELECT * FROM receptinfo WHERE receptId=?;");
            
            String getLikes = String.format("SELECT likes FROM likesamount WHERE receptId=?");
            String getReceptSteg = String.format("SELECT * FROM receptsteg WHERE receptId=?;");
            String getReceptIngredient = String.format("SELECT * FROM ingredientinfo WHERE receptId=?;");
            String getReceptComments = String.format("SELECT * FROM comment WHERE receptId=?;");
            String getReceptReplayComments = String.format("SELECT * FROM replaydcomments WHERE parentId=?");
            
            PreparedStatement pstmt1 = con.prepareStatement(getRecept);
            pstmt1.setString(1, recipeId);
            ResultSet data1 = pstmt1.executeQuery();
            
            PreparedStatement pstmt2 = con.prepareStatement(getReceptInfo);
            pstmt2.setString(1, recipeId);
            ResultSet data2 = pstmt2.executeQuery();
              
            PreparedStatement pstmt3 = con.prepareStatement(getReceptSteg);
            pstmt3.setString(1, recipeId);
            ResultSet data3 = pstmt3.executeQuery();
            
            PreparedStatement pstmt4 = con.prepareStatement(getReceptIngredient);
            pstmt4.setString(1, recipeId);
            ResultSet data4= pstmt4.executeQuery(); 
            
            PreparedStatement pstmt5 = con.prepareStatement(getReceptComments);
            pstmt5.setString(1, recipeId);
            ResultSet data5 = pstmt5.executeQuery(); 
            
            PreparedStatement pstmt7 = con.prepareStatement(getLikes);
            pstmt7.setString(1, recipeId);
            ResultSet data7 = pstmt7.executeQuery(); 
            
            data1.next();
            data2.next();
            data7.next();
            
             while (data3.next()) {                  
              stegList.add(data3.getString("steg"));
            }
            while (data4.next()) {                  
              IngredientInfoList.add(data4.getString("Ingredients"));
            }
             while (data5.next()) { 
               Comments comments = new Comments(
               data5.getString("userName"),
               data5.getString("content"),
               data5.getInt("commentId"),
               data5.getString("date"),
               data5.getInt("receptId"));
                 
                commentsData.add(comments);
              
                PreparedStatement pstmt6 = con.prepareStatement(getReceptReplayComments);
                pstmt6.setString(1, data5.getString("commentId"));
                ResultSet data6 = pstmt6.executeQuery(); 
            
                while (data6.next()) { 
                   Comments replayComments = new Comments(
                   data6.getString("userName"),
                   data6.getString("content"),
                   data6.getInt("commentId"),
                   data6.getString("date"),
                   data6.getString("relatedUserName"),
                   data6.getInt("parentId")
                   );

                  replayCommentsData.add(replayComments);
                }
            }
            Recipe r = new Recipe(
                data1.getString("title"),
                data1.getString("userName"),
                data2.getString("nutritionalValue"),
                data2.getString("description"),
                data2.getString("category"),
                data2.getString("imgPath"),
                IngredientInfoList,
                stegList,
                commentsData,
                replayCommentsData,
                data2.getString("time"),
                data1.getInt("receptId"),
                data7.getInt("likes"));
            
           return r;
       } catch (Exception e) {
           System.out.println("Error RecipeBean.showRecipe: " +e.getMessage());
           return null;
       }
    }
    
   public int deleteRecipe(String recipeId){
       
       try (Connection con1 = ConnectionFactory.getConnection()){
           String getImgPath = String.format("SELECT `imgPath` FROM `receptinfo` WHERE receptId=?;");
            PreparedStatement pstmt = con1.prepareStatement(getImgPath);
            pstmt.setString(1, recipeId);
            
            ResultSet data = pstmt.executeQuery(); 
            
            data.next();
            deleteImge(data.getString("imgPath"));
                
           try (Connection con2 = ConnectionFactory.getConnection()){
               String deleteRecipe = String.format("DELETE FROM recept WHERE receptId='%s'", recipeId);

                PreparedStatement pstmt1 = con2.prepareStatement(deleteRecipe);
                int rows = pstmt1.executeUpdate(deleteRecipe);

                return rows;
           } catch (Exception e) {
               System.out.println("Error RecipeBean.deleteRecipe.con1: " +e.getMessage());
                return 0;
           }
           
       } catch (Exception e) {
          System.out.println("Error RecipeBean.deleteRecipe.con1: " +e.getMessage());
            return 0; 
       }
   }
}