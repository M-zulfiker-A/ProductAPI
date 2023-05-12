import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Category, Product } from "./schema.js";
import { log } from "console";


const router = express.Router()

router.get("/products", async (req, res)=>{
    try {
        const data = await Product.find({})
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({
            message : err.message
        })
    }
})

router.get("/products/search", async (req, res)=>{
    const { q , limit , page } = req.query
    let query = {}
    let dblimit = 0;
    let dbskip = 0;
    if(q){
        query = {
            $or :[
                {
                    name : { "$regex" : q , "$options" : "i"}
                },
                {
                    "attributes.value" : { "$regex" : q , "$options" : "i"}
                }
            ]
        }
    }
    if(limit){
        dblimit = parseInt(limit)
    }
    if(page){
        if(!limit) return res.status(400).json({
            message : "provide a limit per page"
        })
        dbskip = (page-1) * limit
    }
    try {
        const data = await Product.find(query).limit(dblimit).skip(dbskip)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})

router.get("/products/filter", async(req, res)=>{
    const {categoryname } = req.query
    

    try {
        const data =await Product.find({}).populate("categories")
        let filtereddata = []
        if(categoryname){
           filtereddata =  data.filter(item => item.categories.some(category => category.name === categoryname) && item) 
           log(filtereddata)
        }
        res.status(200).json(filtereddata)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.get("/products/:id", async (req, res)=>{
    try {
        const data = await Product.findById(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})

router.post("/products", async (req, res)=>{
    try {
        const data = await Product.insertMany(req.body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})

router.patch("/products/:id", async (req, res)=>{
    try {
        const data = await Product.findById(req.params.id)
        await data.updateOne(req.body)
        await data.save()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({
            message : err.message
        })
    }
})

router.delete("/products/:id", async (req, res)=>{
    try {
        const data = await Product.findByIdAndDelete(req.params.id)

        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({
            message : err.message
        })
    }
})

router.post("/categories", async (req,res)=>{
    try {
        const dat = await Category.create(req.body)
        res.status(201).json({
            message : "new category created",
            category : dat
        })
    } catch (error) {
        res.status(400).json({
            message : error.messsage
        })
    }
})







export default router