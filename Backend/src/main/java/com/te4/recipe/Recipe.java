/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.recipe;

import java.util.List;

/**
 *
 * @author Dator
 */
public class Recipe {
    private String title;
    private String userName;
    private String nutritionalValue;
    private String description;
    private String category;
    private String imgPath;
    private String time;
    
    private String IngredientInfo;
    private String steg;
    
    private List IngredientInfoList;
    private List stegList;
    
    private int reciptId;
    private int likes;
    
    private List comments;
    private List replayComments;

    public Recipe(String title, String userName, String nutritionalValue, String description, String category, String imgPath, List IngredientInfo, List steg, List comments, List replayComments, String time,int reciptId,int likes) {
        this.title = title;
        this.userName = userName;
        this.nutritionalValue = nutritionalValue;
        this.description = description;
        this.category = category;
        this.imgPath = imgPath;
        this.IngredientInfoList = IngredientInfo;
        this.stegList = steg;
        this.comments = comments;
        this.replayComments = replayComments;
        this.time = time;
        this.reciptId = reciptId;
        this.likes = likes;
        
    }

    public Recipe(String title, String userName, String description, String imgPath, int reciptId) {
        this.title = title;
        this.userName = userName;
        this.description = description;
        this.imgPath = imgPath;
        this.reciptId = reciptId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNutritionalValue() {
        return nutritionalValue;
    }

    public void setNutritionalValue(String nutritionalValue) {
        this.nutritionalValue = nutritionalValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImgPath() {
        return imgPath;
    }

    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getIngredientInfo() {
        return IngredientInfo;
    }

    public void setIngredientInfo(String IngredientInfo) {
        this.IngredientInfo = IngredientInfo;
    }

    public String getSteg() {
        return steg;
    }

    public void setSteg(String steg) {
        this.steg = steg;
    }

    public List getIngredientInfoList() {
        return IngredientInfoList;
    }

    public void setIngredientInfoList(List IngredientInfoList) {
        this.IngredientInfoList = IngredientInfoList;
    }

    public List getStegList() {
        return stegList;
    }

    public void setStegList(List stegList) {
        this.stegList = stegList;
    }

    public int getReciptId() {
        return reciptId;
    }

    public void setReciptId(int reciptId) {
        this.reciptId = reciptId;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public List getComments() {
        return comments;
    }

    public void setComments(List comments) {
        this.comments = comments;
    }

    public List getReplayComments() {
        return replayComments;
    }

    public void setReplayComments(List replayComments) {
        this.replayComments = replayComments;
    }
    
    
}

