const express = require("express");
const db = require('../db');
const ExpressError = require("../expressError");

let router = new express.Router();



router.get('/', async (req, res, next) => {
    try{
        let result = await db.query('SELECT id, comp_code FROM invoices ORDER BY id');
        return res.json({"invoices": result.rows});

    } catch(err){
        return next(err);
    }
});


router.get('/:id', async (req, res, next) => {
    try{let id = req.params.id;
    let result = await db.query(`
        SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date 
        FROM invoices AS i INNER JOIN companies AS co ON(i.comp_code = co.code)
        WHERE id = $1`, [id]);
        
        if(result.rows.length === 0){
            throw new ExpressError(`No invoice with id: "${id}" found`, 404);
        } else {
            const data = result.rows[0];
            const invoice = {
                id: data.id,
                company: {
                    code: data.comp_code,
                    name: data.name,
                    description: data.description,
                },
                amt: data.amt,
                paid: data.paid,
                add_date: data.add_date,
                paid_date: data.paid_date,
            }; 
            return res.json({"invoice": invoice});
        }
    } catch(err){
        return next(err);
    }
});

router.post('/', async (req, res, next) => {
    try{
        let {comp_code, amt} = req.body;
        let result = await db.query(`
            INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2) RETURNING 
            id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        
        return res.json({'invoice': result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try{
        let {amt, paid} = req.body;
        let id = req.params.id;
        let paidDate;

        const curResult = await db.query(
            `SELECT paid
             FROM invoices
             WHERE id = $1`,
          [id]);
  
        if (curResult.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }
  
        const curPaidDate = curResult.rows[0].paid_date;
  
        if (!curPaidDate && paid) {
            paidDate = new Date();
        } else if (!paid) {
            paidDate = null
        } else {
            paidDate = curPaidDate;
        }
        
        const result = await db.query(
            `UPDATE invoices
             SET amt=$1, paid=$2, paid_date=$3
             WHERE id=$4
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
          [amt, paid, paidDate, id]);
  
      return res.json({"invoice": result.rows[0]});

    } catch(err) {
        return next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try{
        let id = req.params.id;
        let result = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING id`, [id]);

        if(result.rows.length === 0){
            throw new ExpressError(`Invoice with id: "${id}" does not exist, no deletion performed.`);
        } else {
            return res.json({"status": "deleted"});
        }

    } catch(err) {
        return next(err);
    }
});



module.exports = router;