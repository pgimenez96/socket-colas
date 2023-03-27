const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl()

const socketController = (socket) => {

    socket.on('disconnect', () => {/* Lógica cuando se desconecta un cliente */});

    // Cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo)
    socket.emit('estado-actual', ticketControl.ultimos4)
    socket.emit('tickets-pendientes', ticketControl.ticktes.length)

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente()
        callback(siguiente)
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticktes.length)

    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {

        if ( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.antenderTicket(escritorio);
        if (!ticket) {
            return callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })
        }
        
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        socket.emit('tickets-pendientes', ticketControl.ticktes.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticktes.length)

        callback({
            ok: true,
            ticket
        })

    })

}

module.exports = {
    socketController
}

