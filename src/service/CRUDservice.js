const connection = require('../config/database')
const redisConnection = require("../config/redis");

//-------------------------------MySQL-------------------------------


const getAllData = async () => {
    let [results, fields] = await connection.query('select * from report')
    return results
}

const addOrdersToDB = async (table_id, date, time, dishName, quantity) => {
    let [results, fields] = await connection.query(
        `
        INSERT INTO orderList (table_id, date, time, dishName, quantity) 
        VALUES (?, ?, ?, ?, ?)
        `, [table_id, date, time, dishName, quantity]
    );
}

const deleteOrdersFromDB = async () => {
    let [results, fields] = await connection.query(
        `
        TRUNCATE TABLE orderList
        `
    );
}

const getOrdersFromDB = async () => {
    let [results, fields] = await connection.query(
        `
        SELECT table_id, dishName, quantity, date, time 
        FROM orderList
        ORDER BY dishName
        `
    );
    return results;
}

const addToReport = async (tableNumber, date, time, code, nameDish, quantity, totalCheck, shipFee, discountCheck) => {
    let [results, fields] = await connection.query(
        `
        INSERT INTO report (table_id, date, hour, product_code, product_name, quantity, total, ship_fee, discount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [tableNumber, date, time, code, nameDish, quantity, totalCheck, shipFee, discountCheck]
    );
}

const deleteReportDB = async () => {
    let [results, fields] = await connection.query(
        `
        TRUNCATE TABLE report
        `
    );
}

//-------------------------------Redis-------------------------------

const checkDataInRedis = async () => {
    redisConnection.on('error', err => console.log('Redis Client Error', err));
    try{
        await redisConnection.connect();
        const size = await redisConnection.dbSize();
        await redisConnection.disconnect();
        return size;
    } catch (error) {
        throw new Error("Error retrieving dbSize from Redis");
    }
    //console.log(size);
}

const getDataInRedis = async () => {
    redisConnection.on('error', err => console.log('Redis Client Error', err));
    try{
        const key = "myArray";
        await redisConnection.connect();
        const data = await redisConnection.get(key);
        await redisConnection.disconnect();
        return data;
    } catch (error) {
        throw new Error("Error retrieving dbSize from Redis");
    }
    //console.log(size);
}

module.exports = {
    getAllData,
    addOrdersToDB,
    deleteOrdersFromDB,
    getOrdersFromDB,
    addToReport,
    deleteReportDB,
    checkDataInRedis,
    getDataInRedis

}