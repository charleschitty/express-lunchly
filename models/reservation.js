"use strict";

/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");

/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getFormattedStartAt() {
    return moment(this.startAt).format("MMMM Do YYYY, h:mm a");
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id,
                  customer_id AS "customerId",
                  num_guests AS "numGuests",
                  start_at AS "startAt",
                  notes AS "notes"
           FROM reservations
           WHERE customer_id = $1`,
        [customerId],
    );

    return results.rows.map(row => new Reservation(row));
  }

  //TODO: How to check for valid inputs???
  async save(){
    if(this.id === undefined){
      const results = await db.query(
        `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
                VALUES ($1,$2,$3,$4)
                RETURNING id`,
                [this.customerId, this.numGuests, this.startAt, this.notes]);
      this.id = results.rows[0].id;
    } else {
      // try{
      const results = await db.query(
        `UPDATE reservations
          SET customer_id = $1,
              num_guests = $2,
              start_at = $3,
              notes = $4
          WHERE id = $5`,
        [this.customerId, this.numGuests, this.startAt, this.notes, this.id]
      );
      // }catch(err){

      //   const err2 = new Error(`Invalid type for num guests}`);
      //   err2.status = 404;
      //   throw err2;
      // }
    }
  }

  //Ways to do this: 2 separate queries (Reservations to find customer ids we want)
  // Then query customer to find full info about said customer ids
  //ERIC - 1 ERIC - 2 ERIC - 3 CHARLES - 4 --> ERIC - 3 Charles - 1
  async getTopTen(){
    const results = await db.query(
      `SELECT customer_id
       FROM reservations
       GROUP BY(customer_id)
       ORDER BY COUNT(id) DESC
       LIMIT(10)`,
    );

    const customer_ids = results.rows //[43,52]

  // return results.rows.map(row => new Reservation(row));

  // const results = await  db.query( group reservations by customer_id and then
  // grab the customer id with the most reservations); return us customer ids
  // ERIC's customer ID

  //Customer.get(ERIC"S customer ID) --> customer class --> customer list
  }
}

module.exports = Reservation;
