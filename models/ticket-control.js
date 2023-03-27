const fs   = require('fs')
const path = require('path')

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero
    this.escritorio = escritorio
  }
}

class TicketControl {

  constructor() {
    this.ultimo = 0
    this.hoy = new Date().getDate()
    this.ticktes = []
    this.ultimos4 = []

    this.init()
  }

  toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      ticktes: this.ticktes,
      ultimos4: this.ultimos4
    }
  }

  init() {
    const {
      ultimo,
      hoy,
      ticktes,
      ultimos4
    } = require('../db/data.json')
    if ( hoy === this.hoy ) {
      this.ultimo = ultimo
      this.ticktes = ticktes
      this.ultimos4 = ultimos4
    } else { // Es otro día
      this.guardarDB()
    }
  }

  guardarDB() {
    const dbPath = path.join(__dirname, '../db/data.json')
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson()))
  }

  siguiente() {
    this.ultimo += 1
    const ticket = new Ticket(this.ultimo, null)
    this.ticktes.push(ticket)
    this.guardarDB()
    return `Ticket ${ticket.numero}`
  }

  antenderTicket(escritorio) {
    // No tenemos tickets
    if ( this.ticktes.length === 0 ) {
      return null
    }

    const ticket = this.ticktes.shift()
    ticket.escritorio = escritorio
    
    this.ultimos4.unshift(ticket)

    if ( this.ultimos4.length > 4 ) {
      this.ultimos4.splice(-1, 1)
    }

    this.guardarDB()

    return ticket;
  }

}

module.exports = TicketControl