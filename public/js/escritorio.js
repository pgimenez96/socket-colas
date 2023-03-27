// Referencias HTML
const lblEscritorio = document.querySelector('h1');
const bntAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');


const searchParams = new URLSearchParams(window.location.search);

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    bntAtender.disabled = false;
});

socket.on('disconnect', () => {
    bntAtender.disabled = false;
});

socket.on('tickets-pendientes', (cantPendientes) => {
    if ( cantPendientes === 0 ) {
        return lblPendientes.style.display = 'none'
    }
    lblPendientes.style.display = ''
    lblPendientes.innerText = cantPendientes
});

bntAtender.addEventListener( 'click', () => {

    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        
        if (!ok) {
            lblTicket.innerText = 'Nadie'
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`
        
    });

});