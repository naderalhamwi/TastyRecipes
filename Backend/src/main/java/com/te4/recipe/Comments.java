/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.te4.recipe;

/**
 *
 * @author Dator
 */
public class Comments {
    private String userName;
    private String content;
    private int commentId;
    private String date;
    private int receptId;
    private String relatedUserName;
    private int parentId;

    public Comments(String userName, String content, int commentId, String date, int receptId) {
        this.userName = userName;
        this.content = content;
        this.commentId = commentId;
        this.date = date;
        this.receptId = receptId;
    }

    public Comments(String userName, String content, int commentId, String date, String relatedUserName, int parentId) {
        this.userName = userName;
        this.content = content;
        this.commentId = commentId;
        this.date = date;
        this.relatedUserName = relatedUserName;
        this.parentId = parentId;
    }

    
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getCommentId() {
        return commentId;
    }

    public void setCommentId(int commentId) {
        this.commentId = commentId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getReceptId() {
        return receptId;
    }

    public void setReceptId(int receptId) {
        this.receptId = receptId;
    }

    public String getRelatedUserName() {
        return relatedUserName;
    }

    public void setRelatedUserName(String relatedUserName) {
        this.relatedUserName = relatedUserName;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }
    
    
}
