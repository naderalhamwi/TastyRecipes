/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.recipe;

import com.te4.backend.ConnectionFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.ejb.Stateless;
import jdk.internal.org.jline.utils.InfoCmp;

/**
 *
 * @author Dator
 */
@Stateless
public class RecipeBean {
    static long stegCont = 0;
    public int createRecipe(Recipe recipe){
        try (Connection con1 = ConnectionFactory.getConnection()){
           String insertRecipt = String.format("INSERT INTO recept (title, userName, likes) VALUES ('%s', '%s', '%d');", recipe.getTitle(), recipe.getUserName(), 0);

           PreparedStatement stmt = con1.prepareStatement(insertRecipt );
           int rows = stmt.executeUpdate(insertRecipt );
                
           try (Connection con2 = ConnectionFactory.getConnection()){
                String insertRecipetInfo = String.format("INSERT INTO receptinfo VALUES ((SELECT max(receptID) FROM recept),'%s', '%s', '%s', '%s');", 
                   recipe.getDescription(), recipe.getCategory(), recipe.getNutritionalValue(), recipe.getImgPath());
                
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
}